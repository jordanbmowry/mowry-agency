import { serverSupabaseServiceRole } from '#supabase/server';
import {
  transformLeadData,
  isDuplicateEmailError,
  extractClientInfo,
} from '../utils/form-utils';
import { sendQuoteEmails } from '../utils/email-service-vue';
import { quoteValidationSchema } from '../utils/validation';

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event);

    // Get runtime config
    const config = useRuntimeConfig();

    // Transform data from camelCase to snake_case for validation
    const transformedBody = {
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      date_of_birth: body.dateOfBirth,
      sex: body.sex,
      city: body.city,
      state: body.state,
      height:
        typeof body.height === 'string' ? parseFloat(body.height) : body.height,
      weight:
        typeof body.weight === 'string' ? parseFloat(body.weight) : body.weight,
      coverage_type: body.coverageType,
      health_conditions: body.healthConditions,
      current_medications: body.medications || body.currentMedications,
      tcpa_consent: body.tcpaConsent,
      message: body.message,
    };

    // Validate using Joi schema
    const { error: validationError, value: validatedData } =
      quoteValidationSchema.validate(transformedBody, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (validationError) {
      console.error('Joi validation error:', validationError.details);
      const errors = validationError.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: { errors },
      });
    }

    // Extract client information for TCPA compliance audit trail
    const clientInfo = extractClientInfo(event);

    // Transform validated data back to camelCase for transformLeadData function
    const formDataForTransform = {
      firstName: validatedData.first_name,
      lastName: validatedData.last_name,
      email: validatedData.email,
      phone: validatedData.phone,
      dateOfBirth: validatedData.date_of_birth,
      sex: validatedData.sex,
      city: validatedData.city,
      state: validatedData.state,
      height: validatedData.height,
      weight: validatedData.weight,
      coverageType: validatedData.coverage_type,
      healthConditions: validatedData.health_conditions,
      medications: validatedData.current_medications,
      tcpaConsent: validatedData.tcpa_consent,
      message: validatedData.message || '',
      formVersion: body.formVersion || 'v1.0',
      tcpaText: body.tcpaText,
      emailMarketingConsent: body.emailMarketingConsent || false,
    };

    // Transform and sanitize data for database with compliance info
    const leadData = transformLeadData(formDataForTransform, clientInfo);

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
      console.error('Database insert error:', insertError);
      console.error(
        'Lead data being inserted:',
        JSON.stringify(leadData, null, 2)
      );
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
    const emailResults = await sendQuoteEmails(emailConfig, insertedLead, {
      email: config.agencyEmail,
      phone: config.agencyPhone,
      address: config.agencyAddress,
      website: config.agencyWebsite,
      npn: config.agencyNpn,
    });

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
