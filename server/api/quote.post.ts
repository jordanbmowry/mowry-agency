import { serverSupabaseServiceRole } from '#supabase/server';
import {
  validateEmail,
  transformLeadData,
  isDuplicateEmailError,
} from '../utils/form-utils';
import { sendQuoteEmails } from '../utils/email-service-vue';

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event);

    // Get runtime config
    const config = useRuntimeConfig();

    // Basic validation
    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.dateOfBirth ||
      !body.city ||
      !body.state ||
      !body.coverageType ||
      !body.tcpaConsent
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Missing required fields: firstName, lastName, email, phone, dateOfBirth, city, state, coverageType, and tcpaConsent are required',
      });
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format',
      });
    }

    // Transform and sanitize data for database
    const leadData = transformLeadData(body);

    // Get Supabase client with service role for bypassing RLS
    const supabase = serverSupabaseServiceRole(event);

    // Insert into database
    const { data: insertedLead, error: insertError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    // Handle duplicate email with positive messaging
    if (insertError && isDuplicateEmailError(insertError)) {
      return {
        success: true,
        message: "We're Already Working on Your Quote!",
        details:
          "We've found your previous quote request in our system. One of our agents will be contacting you soon. If you need immediate assistance, please call us at (930) 322-1962.",
        isDuplicate: true,
        contactInfo: {
          phone: config.public.agencyPhone,
          email: config.public.agencyEmail,
        },
      };
    }

    // Handle other database errors
    if (insertError) {
      console.error('Database error:', insertError);
      throw createError({
        statusCode: 500,
        statusMessage:
          'We apologize, but there was an issue processing your request. Please call us directly at (930) 322-1962 for immediate assistance.',
      });
    }

    // Prepare email configuration
    const emailConfig = {
      host: config.smtpHost,
      port: parseInt(config.smtpPort),
      user: config.smtpUser,
      pass: config.smtpPass,
    };

    // Send emails using Vue Email templates
    const emailResults = await sendQuoteEmails(
      emailConfig,
      insertedLead,
      config.agencyEmail
    );

    // Return success response
    return {
      success: true,
      message:
        'Quote request submitted successfully! Check your email for confirmation.',
      leadId: insertedLead.id,
      emailStatus: {
        customerEmail: emailResults.customerResult.success ? 'sent' : 'failed',
        agencyEmail: emailResults.agencyResult.success ? 'sent' : 'failed',
      },
      nextSteps: [
        'Review your email confirmation for important details',
        'Expect a call from our licensed agent within 24 hours',
        'Have your questions ready for a personalized consultation',
        "We'll provide competitive quotes from top-rated carriers",
      ],
    };
  } catch (error: any) {
    // Enhanced error handling with user-friendly messages
    console.error('Quote form error:', error);

    if (error.statusCode) {
      throw error; // Re-throw createError errors
    }

    throw createError({
      statusCode: 500,
      statusMessage:
        'We encountered an unexpected error. Please try again or contact us directly at (930) 322-1962 for immediate assistance.',
    });
  }
});
