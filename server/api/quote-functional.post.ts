import { serverSupabaseServiceRole } from '#supabase/server';
import {
  validateEmail,
  validatePhone,
  validateName,
  validateAge,
  sanitizeFormData,
  transformLeadData,
  isDuplicateEmailError,
  safeAsync,
  type AsyncResult,
} from '../utils/form-utils';
import { sendQuoteEmails } from '../utils/email-service';

// Type definitions
type QuoteFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  state: string;
  coverageType: string;
  healthConditions?: string;
  medications?: string;
  message?: string;
  tcpaConsent: boolean;
};

type ValidationErrors = {
  [key: string]: string;
};

// Pure validation function
const validateQuoteForm = (data: QuoteFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!validateName(data.firstName)) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!validateName(data.lastName)) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!validateAge(data.dateOfBirth)) {
    errors.dateOfBirth = 'You must be at least 18 years old';
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!data.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!data.coverageType?.trim()) {
    errors.coverageType = 'Coverage type is required';
  }

  if (!data.healthConditions?.trim()) {
    errors.healthConditions = 'Health conditions information is required';
  }

  if (!data.medications?.trim()) {
    errors.medications = 'Medications information is required';
  }

  if (!data.tcpaConsent) {
    errors.tcpaConsent = 'TCPA consent is required';
  }

  return errors;
};

// Database operations
const saveLead = async (
  supabase: any,
  leadData: any
): Promise<AsyncResult<any>> => {
  return safeAsync(async () => {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) throw error;
    return data[0];
  });
};

// Error response creators
const createDuplicateEmailError = (config: any) =>
  createError({
    statusCode: 409,
    statusMessage: 'DUPLICATE_EMAIL',
    data: {
      message: `Great news! We already have your information on file. Our team will be in touch soon. For immediate assistance or to update your quote request, please give us a call.`,
      phone: config.public.agencyPhone,
      email: config.public.agencyEmail,
    },
  });

const createValidationError = (errors: ValidationErrors) =>
  createError({
    statusCode: 400,
    statusMessage: 'VALIDATION_ERROR',
    data: {
      message: 'Please correct the following errors:',
      errors,
    },
  });

const createDatabaseError = (config: any) =>
  createError({
    statusCode: 500,
    statusMessage: 'DATABASE_ERROR',
    data: {
      message: `We encountered an issue processing your request. Please try again or call us at ${config.public.agencyPhone} for immediate assistance.`,
      phone: config.public.agencyPhone,
      email: config.public.agencyEmail,
    },
  });

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  const config = useRuntimeConfig();

  try {
    const body = await readBody(event);
    const sanitizedData = sanitizeFormData(body) as QuoteFormData;

    // Validate form data
    const validationErrors = validateQuoteForm(sanitizedData);
    if (Object.keys(validationErrors).length > 0) {
      throw createValidationError(validationErrors);
    }

    // Transform and save lead data
    const leadData = transformLeadData(sanitizedData);
    const saveResult = await saveLead(supabase, leadData);

    if (!saveResult.success) {
      if (isDuplicateEmailError(saveResult.error)) {
        throw createDuplicateEmailError(config);
      }
      throw createDatabaseError(config);
    }

    // Send emails (optional, don't fail if email fails)
    let emailsSent = false;
    if (config.smtpUser && config.smtpPass) {
      try {
        const emailResult = await sendQuoteEmails(
          leadData,
          {
            host: config.smtpHost,
            port: parseInt(config.smtpPort),
            user: config.smtpUser,
            pass: config.smtpPass,
          },
          config.agencyEmail,
          config.public.siteUrl
        );
        emailsSent = emailResult.customerSent && emailResult.agencySent;
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Email sending failed:', emailError);
      }
    }

    return {
      success: true,
      message: 'Quote request submitted successfully',
      leadId: saveResult.data.id,
      emailSent: emailsSent,
    };
  } catch (error: any) {
    // Re-throw createError responses as-is
    if (error?.statusCode) {
      throw error;
    }

    // Handle unexpected errors
    console.error('Unexpected error in quote API:', error);
    throw createDatabaseError(config);
  }
});
