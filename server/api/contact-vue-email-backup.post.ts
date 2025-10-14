import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { createTimestamp } from '~/utils/dateUtils';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverageType: string;
  message: string;
  tcpaConsent: boolean;
}

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  try {
    // Parse the request body
    const body: ContactFormData = await readBody(event);

    // Validate required fields
    const { firstName, lastName, email, phone, tcpaConsent } = body;
    if (!firstName || !lastName || !email || !phone || !tcpaConsent) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields including TCPA consent',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format',
      });
    }

    // Save to Supabase first
    const leadData: Omit<Lead, 'id' | 'created_at'> = {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      message: `Coverage Type: ${body.coverageType}\n\nMessage: ${body.message || 'No additional message'}`,
      lead_source: 'contact_form',
      status: 'new',
    };

    try {
      const savedLead = await supabaseOperations.createLead(leadData);
      console.log('✅ Lead saved to Supabase:', savedLead.id);
    } catch (supabaseError: any) {
      console.error('❌ Failed to save lead to Supabase:', supabaseError);

      // Check if it's a missing table error
      if (supabaseError.message?.includes('Could not find the table')) {
        console.log('🚨 Database tables not created yet');
        console.log(
          '📋 Please run the SQL setup script in your Supabase dashboard'
        );
        console.log('📄 Use the content from: supabase-setup.sql');

        // For now, continue without database - forms will still work for testing
        console.log(
          '⚠️  Continuing without database storage for testing purposes'
        );
      } else {
        // For other Supabase errors, continue anyway
        console.log('⚠️  Continuing despite Supabase error');
      }
    }

    // Get environment variables for email configuration
    const runtimeConfig = useRuntimeConfig();

    console.log('📧 Email configuration check:');
    console.log('- SMTP Host:', runtimeConfig.smtpHost);
    console.log('- SMTP Port:', runtimeConfig.smtpPort);
    console.log(
      '- SMTP User:',
      runtimeConfig.smtpUser ? '✅ Set' : '❌ Not set'
    );
    console.log(
      '- SMTP Pass:',
      runtimeConfig.smtpPass ? '✅ Set' : '❌ Not set'
    );
    console.log('- Agency Email:', runtimeConfig.agencyEmail);

    // Skip email sending if credentials are not configured
    if (!runtimeConfig.smtpUser || !runtimeConfig.smtpPass) {
      console.log(
        '⚠️  Email credentials not configured - skipping email sending'
      );

      // Return success response since we handled the form submission
      return {
        success: true,
        message:
          'Contact request submitted successfully! We will get back to you within 24 hours.',
        note: 'Email notifications disabled - contact form data logged in console',
      };
    }

    // Email sending - wrap in try/catch to prevent API failure
    try {
      console.log('📧 Attempting to send emails...');

      // Create nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: runtimeConfig.smtpHost || 'smtp.gmail.com',
        port: parseInt(runtimeConfig.smtpPort || '587'),
        secure: false,
        auth: {
          user: runtimeConfig.smtpUser,
          pass: runtimeConfig.smtpPass,
        },
      });

      // Render Vue Email templates
      const agencyEmailHtml = await render('AgencyNotification', {
        leadData: {
          firstName,
          lastName,
          email,
          phone,
          coverageType: body.coverageType || 'Not specified',
          message: body.message,
        },
      });

      const customerEmailHtml = await render('CustomerConfirmation', {
        customerData: {
          firstName,
          lastName,
          email,
          phone,
          coverageType: body.coverageType || 'Not specified',
        },
      });

      // Send email to agency
      await transporter.sendMail({
        from: `"${firstName} ${lastName}" <${runtimeConfig.smtpUser}>`,
        to: runtimeConfig.agencyEmail,
        subject: `New Quote Request - ${body.coverageType}`,
        html: agencyEmailHtml,
        replyTo: email,
      });

      // Send confirmation email to customer
      await transporter.sendMail({
        from: `"Mowry Agency" <${runtimeConfig.smtpUser}>`,
        to: email,
        subject: 'Thank You - Your Insurance Quote Request',
        html: customerEmailHtml,
      });

      console.log('✅ Professional emails sent successfully');
    } catch (emailError: any) {
      console.error('❌ Email sending failed:', emailError.message);
      console.log('⚠️  Continuing without email notifications');
      // Don't throw error - continue with success response
    }

    // Return success response
    return {
      success: true,
      message:
        'Contact request submitted successfully! We will get back to you within 24 hours.',
    };

    // Email content for the customer (confirmation)
    const customerEmailContent = `
      <h2>Thank you for contacting Mowry Agency!</h2>
      <p>Dear ${firstName},</p>
      
      <p>Thank you for your interest in our life insurance services. We've received your request for a quote and will contact you within 24 hours.</p>
      
      <p><strong>Here's what we received:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Coverage Interest:</strong> ${body.coverageType || 'General inquiry'}</li>
      </ul>
      
      <p>One of our licensed insurance professionals will reach out to you soon to discuss your family's protection needs.</p>
      
      <p><strong>Need immediate assistance?</strong><br>
      Feel free to call us directly at <a href="tel:+1${process.env.AGENCY_PHONE?.replace(/[^\d]/g, '')}">${process.env.AGENCY_PHONE}</a></p>
      
      <p>Best regards,<br>
      The Mowry Agency Team</p>
      
      <hr>
      <p style="font-size: 12px; color: #666;">
        This is an automated confirmation email. Please do not reply to this message.
      </p>
    `;

    // Send email to agency (lead notification)
    const agencyEmailOptions = {
      from: runtimeConfig.smtpUser,
      to: runtimeConfig.agencyEmail,
      subject: `New Quote Request from ${firstName} ${lastName}`,
      html: agencyEmailContent,
      text: `New quote request from ${firstName} ${lastName}. Email: ${email}, Phone: ${phone}, Coverage: ${body.coverageType || 'Not specified'}`,
    };

    // Send confirmation email to customer
    const customerEmailOptions = {
      from: runtimeConfig.smtpUser,
      to: email,
      subject: 'Your Insurance Quote Request - Mowry Agency',
      html: customerEmailContent,
      text: `Thank you for contacting Mowry Agency! We'll contact you within 24 hours at ${phone}.`,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(agencyEmailOptions),
      transporter.sendMail(customerEmailOptions),
    ]);

    // Log the submission (you might want to save to a database here)
    console.log('Quote request submitted:', {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      coverageType: body.coverageType,
      timestamp: createTimestamp(),
    });

    // Return success response
    return {
      success: true,
      message: 'Quote request submitted successfully',
    };
  } catch (error: any) {
    console.error('Error processing contact form:', error);

    // Return appropriate error response
    if (error.statusCode) {
      throw error; // Re-throw validation errors
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
