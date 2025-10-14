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

// Token encoding/decoding
export const encodeEmailToken = (email: string): string => {
  return Buffer.from(email).toString('base64');
};

export const decodeEmailToken = (token: string): string => {
  return Buffer.from(token, 'base64').toString('utf-8');
};

// Client information extraction
export const extractClientInfo = (event: any) => ({
  ip:
    getHeaders(event)['x-forwarded-for'] ||
    getHeaders(event)['x-real-ip'] ||
    'unknown',
  userAgent: getHeader(event, 'user-agent') || '',
  timestamp: createTimestamp(),
});

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

// Data transformation utilities
export const transformLeadData = (formData: any) => ({
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
  tcpa_consent: formData.tcpaConsent,
  lead_type: 'insurance_quote',
  lead_source: 'quote_form',
  status: 'new',
});

// Create unsubscribe link
export const createUnsubscribeLink = (
  email: string,
  baseUrl: string
): string => {
  const token = encodeEmailToken(email);
  return `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
};
