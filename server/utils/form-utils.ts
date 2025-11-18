// Pure utility functions for form validation and processing
import type { H3Event } from 'h3';
import { getHeader, getHeaders } from 'h3';
import { createTimestamp, isValidAge } from '~/utils/dateUtils';

export interface ClientInfo {
  ip: string;
  userAgent: string;
  timestamp: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  coverageType: string;
  healthConditions: string;
  medications?: string;
  currentMedications?: string;
  message?: string;
  city: string;
  state: string;
  sex: string;
  height: number | string;
  weight: number | string;
  tcpaConsent: boolean;
  tcpaText?: string;
  emailMarketingConsent?: boolean;
  formVersion?: string;
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-().]{10,}$/;
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
export const extractClientInfo = (event: H3Event): ClientInfo => {
  const headers = getHeaders(event);
  return {
    ip: (headers['x-forwarded-for'] as string) || (headers['x-real-ip'] as string) || 'unknown',
    userAgent: getHeader(event, 'user-agent') || '',
    timestamp: createTimestamp(),
  };
};

// TCPA compliance text - this should match exactly what's shown to users
// Enhanced to include clear caller identity and opt-out information
export const getTcpaConsentText = (version: string = 'v1.2'): string => {
  const defaultText =
    'By checking this box and submitting this form, you consent to receive calls, text messages, and emails from Mowry Agency (owned by Mowry Digital Enterprise LLC) and our licensed insurance agents at the phone number and email address you provided. We will contact you to provide your personalized life insurance quotes and answer questions. This consent is not required as a condition of purchase. Standard message and data rates may apply. You can opt-out at any time by replying STOP to text messages, calling us, or emailing us.';

  const tcpaTexts: Record<string, string> = {
    'v1.0':
      'By clicking Submit, you agree to be contacted by Mowry Agency and its agents at the number provided, including calls, texts, or emails. Consent is not a condition of purchase. Message and data rates may apply. You may opt out at any time.',
    'v1.1':
      'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency and our licensed agents at the contact information provided. This consent is not required as a condition of purchase. Standard message and data rates may apply. You can unsubscribe at any time.',
    'v1.2': defaultText,
  };

  return tcpaTexts[version] ?? defaultText;
};

// Form data sanitization
export const sanitizeFormData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};

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
export const isDuplicateEmailError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const err = error as { code?: string; details?: string; message?: string };
  return (
    err.code === '23505' &&
    !!(
      err.details?.includes('unique_email_per_lead') ||
      err.message?.includes('duplicate key') ||
      err.message?.includes('unique_email')
    )
  );
};

// Map coverage_type (user-facing) to lead_type (database constraint)
export const mapCoverageTypeToLeadType = (coverageType: string): string => {
  const mapping: Record<string, string> = {
    'term-life': 'term',
    'whole-life': 'whole_life',
    iul: 'universal',
    'mortgage-protection': 'mortgage_protection',
    'final-expense': 'final_expense',
    'not-sure': 'term', // Default to term if not sure
  };
  return mapping[coverageType] || 'term';
};

// Result type for async operations
export type AsyncResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Safe async wrapper
export const safeAsync = async <T>(operation: () => Promise<T>): Promise<AsyncResult<T>> => {
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
export const transformLeadData = (formData: FormData, clientInfo?: ClientInfo) => {
  // Convert height and weight from strings to numbers
  const height =
    typeof formData.height === 'string' ? parseFloat(formData.height) : formData.height;
  const weight =
    typeof formData.weight === 'string' ? parseFloat(formData.weight) : formData.weight;

  return {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email.toLowerCase(),
    phone: formData.phone,
    date_of_birth: formData.dateOfBirth,
    coverage_type: formData.coverageType,
    health_conditions: formData.healthConditions,
    current_medications: formData.medications || formData.currentMedications || 'None',
    message: formData.message || null,
    city: formData.city,
    state: formData.state,
    sex: formData.sex,
    height: height || 0, // Ensure number
    weight: weight || 0, // Ensure number
    tcpa_consent: formData.tcpaConsent,
    tcpa_text: formData.tcpaText || getTcpaConsentText(formData.formVersion),
    email_marketing_consent: formData.emailMarketingConsent || false,
    ip_address: clientInfo?.ip || null,
    user_agent: clientInfo?.userAgent || null,
    form_version: formData.formVersion || 'v1.0',
    compliance_review_status: 'pending',
    lead_type: mapCoverageTypeToLeadType(formData.coverageType || 'not-sure'),
    lead_source: 'quote_form',
    status: 'new',
  };
};

// Create unsubscribe link
export const createUnsubscribeLink = (email: string, baseUrl: string): string => {
  const token = encodeEmailToken(email);
  return `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
};
