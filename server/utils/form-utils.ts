// Pure utility functions for form validation and processing
import { calculateAge, isValidAge, createTimestamp } from '~/utils/dateUtils';

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)\.]{10,}$/;
  return phoneRegex.test(phone);
};

// Name validation
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s\-']{2,}$/.test(name);
};

// Age validation (18+)
export const validateAge = (dateOfBirth: string): boolean => {
  return isValidAge(dateOfBirth, 18);
};

// Sex validation
export const validateSex = (sex: string): boolean => {
  return ['Male', 'Female'].includes(sex);
};

// Height validation (4'0" to 7'0")
export const validateHeight = (height: number): boolean => {
  return height >= 4.0 && height <= 7.0;
};

// Weight validation (50-500 lbs)
export const validateWeight = (weight: number): boolean => {
  return weight >= 50 && weight <= 500;
};

// Token encoding/decoding
export const encodeEmailToken = (email: string): string => {
  return Buffer.from(email).toString('base64');
};

export const decodeEmailToken = (token: string): string => {
  return Buffer.from(token, 'base64').toString('utf-8');
};

// Client information extraction for TCPA compliance
export const extractClientInfo = (event: any) => ({
  ip:
    getHeaders(event)['x-forwarded-for'] ||
    getHeaders(event)['x-real-ip'] ||
    'unknown',
  userAgent: getHeader(event, 'user-agent') || '',
  timestamp: createTimestamp(),
});

// TCPA compliance text - this should match exactly what's shown to users
export const getTcpaConsentText = (version: string = 'v1.0'): string => {
  const tcpaTexts: Record<string, string> = {
    'v1.0':
      'By clicking Submit, you agree to be contacted by Mowry Agency and its agents at the number provided, including calls, texts, or emails. Consent is not a condition of purchase. Message and data rates may apply. You may opt out at any time.',
    'v1.1':
      'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency and our licensed agents at the contact information provided. This consent is not required as a condition of purchase. Standard message and data rates may apply. You can unsubscribe at any time.',
  };

  return tcpaTexts[version] || tcpaTexts['v1.0'];
};

// Form data sanitization
export const sanitizeFormData = (data: Record<string, any>) => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Database error handling
export const isDuplicateEmailError = (error: any): boolean => {
  return (
    error.code === '23505' &&
    (error.details?.includes('unique_email_per_lead') ||
      error.message?.includes('duplicate key') ||
      error.message?.includes('unique_email'))
  );
};

// Result type for async operations
export type AsyncResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Safe async wrapper
export const safeAsync = async <T>(
  operation: () => Promise<T>
): Promise<AsyncResult<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Data transformation utilities with enhanced TCPA compliance
// Pure function: transforms frontend form data (camelCase) to database format (snake_case)
// Handles type conversions: string → number for height/weight
export const transformLeadData = (formData: any, clientInfo?: any) => {
  // Convert height and weight from strings to numbers
  const height =
    typeof formData.height === 'string'
      ? parseFloat(formData.height)
      : formData.height;
  const weight =
    typeof formData.weight === 'string'
      ? parseFloat(formData.weight)
      : formData.weight;

  return {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email.toLowerCase(),
    phone: formData.phone,
    date_of_birth: formData.dateOfBirth,
    coverage_type: formData.coverageType,
    health_conditions: formData.healthConditions,
    current_medications: formData.medications || formData.currentMedications,
    message: formData.message,
    city: formData.city,
    state: formData.state,
    sex: formData.sex,
    height: height || null, // Ensure number or null
    weight: weight || null, // Ensure number or null
    tcpa_consent: formData.tcpaConsent,
    tcpa_text: formData.tcpaText || getTcpaConsentText(formData.formVersion),
    email_marketing_consent: formData.emailMarketingConsent || false,
    ip_address: clientInfo?.ip,
    user_agent: clientInfo?.userAgent,
    form_version: formData.formVersion || 'v1.0',
    compliance_review_status: 'pending',
    lead_type: 'insurance_quote',
    lead_source: 'quote_form',
    status: 'new',
  };
};

// Create unsubscribe link
export const createUnsubscribeLink = (
  email: string,
  baseUrl: string
): string => {
  const token = encodeEmailToken(email);
  return `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
};
