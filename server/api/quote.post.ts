import nodemailer from 'nodemailer';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    // Use serverSupabaseServiceRole for server-side operations (bypasses RLS)
    const supabase = serverSupabaseServiceRole(event);

    const body = await readBody(event);

    // Validate required fields
    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.dateOfBirth ||
      !body.city ||
      !body.state ||
      !body.coverageType
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Missing required fields: firstName, lastName, email, phone, dateOfBirth, city, state, and coverageType are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format',
      });
    }

    // Create lead data for database - include required fields from constraint
    const leadData = {
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      date_of_birth: body.dateOfBirth,
      city: body.city,
      state: body.state,
      coverage_type: body.coverageType,
      health_conditions: body.healthConditions || '',
      current_medications: body.medications || '',
      message: body.message || '',
      lead_type: 'insurance_quote',
      lead_source: 'quote_form',
      status: 'new',
    };

    // Save to Supabase using Nuxt Supabase module
    const { data: savedLead, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Email configuration - make it optional
    let emailSent = false;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Use Vue Email templates
        const emailData = {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          dateOfBirth: body.dateOfBirth,
          cityState: body.cityState,
          coverageType: body.coverageType,
          healthConditions: body.healthConditions || 'Not provided',
          medications: body.medications || 'Not provided',
          message: body.message || '',
          submittedAt: new Date().toLocaleString(),
        };

        // Create professional HTML email templates
        const agencyEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>New Quote Request - Mowry Agency</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
            <div style="background-color: #ffffff; margin: 0 auto; padding: 0; max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="background-color: #1e40af; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">New Life Insurance Quote Request</h1>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #1e40af; margin-top: 0;">Customer Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${body.firstName} ${body.lastName}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${body.email}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${body.phone}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${body.city}, ${body.state}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold;">Date of Birth:</td><td style="padding: 8px;">${body.dateOfBirth}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold;">Coverage Type:</td><td style="padding: 8px;">${body.coverageType}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold;">Health Conditions:</td><td style="padding: 8px;">${body.healthConditions || 'Not provided'}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold;">Medications:</td><td style="padding: 8px;">${body.medications || 'Not provided'}</td></tr>
                  ${body.message ? `<tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${body.message}</td></tr>` : ''}
                  <tr><td style="padding: 8px; font-weight: bold;">Submitted:</td><td style="padding: 8px;">${new Date().toLocaleString()}</td></tr>
                </table>
              </div>
            </div>
          </body>
          </html>
        `;

        const customerEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Quote Request Confirmation - Mowry Agency</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
            <div style="background-color: #ffffff; margin: 0 auto; padding: 0; max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="background-color: #1e40af; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">Thank You for Your Quote Request!</h1>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #1e40af; margin-top: 0;">Hi ${body.firstName},</h2>
                <p>We've received your comprehensive quote request for life insurance and will contact you within 24 hours with personalized coverage options designed to protect your family's future.</p>
                <p>Our team specializes in helping families build lasting legacies through tax-advantaged life insurance strategies, and we'll use the information you provided to find the best rates for your specific situation.</p>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
                  <ul>
                    <li>We'll review your information and research the best options for you</li>
                    <li>Our team will contact you within 24 hours</li>
                    <li>We'll provide you with personalized quote options</li>
                    <li>No obligation - we're here to help you make the best decision for your family</li>
                  </ul>
                </div>
                <p>If you have any immediate questions, please don't hesitate to call us at <strong>(930) 322-1962</strong>.</p>
                <p>Best regards,<br><strong>The Mowry Agency Team</strong></p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Send email to agency
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.AGENCY_EMAIL || 'mowryagency@gmail.com',
          subject: `New Life Insurance Quote Request from ${body.firstName} ${body.lastName}`,
          html: agencyEmailHtml,
        });

        // Send confirmation email to customer
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: body.email,
          subject: 'Life Insurance Quote Request Confirmation - Mowry Agency',
          html: customerEmailHtml,
        });

        emailSent = true;
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue without email - don't fail the entire request
      }
    } else {
      console.log(
        'Email credentials not configured - skipping email notifications'
      );
    }

    return {
      success: true,
      message: 'Quote request submitted successfully',
      leadId: savedLead[0]?.id,
      emailSent,
    };
  } catch (error: any) {
    console.error('Quote request error:', error);

    // Return appropriate error response
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process quote request',
    });
  }
});
