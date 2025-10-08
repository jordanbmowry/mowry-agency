// Type definitions for validation and form handling
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  coverageType: string;
  healthConditions: string;
  medications: string;
  message?: string;
}

export interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  coverage_type: string;
  health_conditions: string;
  current_medications: string;
  message: string;
  lead_type: string;
  lead_source: string;
  status: string;
}

export interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  coverageType: string;
  healthConditions: string;
  medications: string;
  message: string;
  submittedAt: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  leadId?: string;
  emailSent?: boolean;
}
