// Application constants and configuration
// Using functional programming principles - immutable data structures

// Form field configurations
export const FORM_FIELDS = Object.freeze({
  FIRST_NAME: {
    id: 'firstName',
    name: 'firstName',
    type: 'text' as const,
    label: 'First Name',
    placeholder: 'John',
    autocomplete: 'given-name',
    required: true,
  },
  LAST_NAME: {
    id: 'lastName',
    name: 'lastName',
    type: 'text' as const,
    label: 'Last Name',
    placeholder: 'Doe',
    autocomplete: 'family-name',
    required: true,
  },
  EMAIL: {
    id: 'email',
    name: 'email',
    type: 'email' as const,
    label: 'Email Address',
    placeholder: 'john.doe@example.com',
    autocomplete: 'email',
    required: true,
  },
  PHONE: {
    id: 'phone',
    name: 'phone',
    type: 'tel' as const,
    label: 'Phone Number',
    placeholder: '(555) 123-4567',
    autocomplete: 'tel',
    required: true,
  },
  DATE_OF_BIRTH: {
    id: 'dateOfBirth',
    name: 'dateOfBirth',
    type: 'date' as const,
    label: 'Date of Birth',
    required: true,
    helpText: 'Must be 18 years or older',
  },
  COVERAGE_TYPE: {
    id: 'coverageType',
    name: 'coverageType',
    type: 'select' as const,
    label: 'Type of Coverage',
    placeholder: 'Select coverage type',
    required: true,
    helpText: "Don't worry if you're not sure - we'll help you choose",
    options: [
      { value: 'term-life', label: 'Term Life Insurance' },
      { value: 'whole-life', label: 'Whole Life Insurance' },
      { value: 'iul', label: 'Indexed Universal Life (IUL)' },
      { value: 'not-sure', label: 'Not Sure / Need Guidance' },
    ],
  },
  HEALTH_CONDITIONS: {
    id: 'healthConditions',
    name: 'healthConditions',
    type: 'textarea' as const,
    label: 'Current Health Conditions',
    placeholder:
      "Please describe any current health conditions, chronic illnesses, or ongoing medical treatments. If you're in good health, simply write 'None' or 'Good health'.",
    required: true,
    rows: 3,
    helpText: 'This helps us find the best rates for your situation',
  },
  MEDICATIONS: {
    id: 'medications',
    name: 'medications',
    type: 'textarea' as const,
    label: 'Current Medications',
    placeholder:
      "Please list all current medications including dosages if known. If none, please write 'None'.",
    required: true,
    rows: 3,
    helpText:
      'Include prescription medications, over-the-counter drugs, and supplements',
  },
  MESSAGE: {
    id: 'message',
    name: 'message',
    type: 'textarea' as const,
    label: 'Additional Information (Optional)',
    placeholder:
      'Tell us about your family situation, coverage goals, budget considerations, or any questions you have about life insurance.',
    required: false,
    rows: 3,
    helpText: 'Help us better understand your needs and goals',
  },
} as const);

// Form sections for better organization
export const FORM_SECTIONS = Object.freeze({
  PERSONAL_INFO: {
    title: 'Personal Information',
    fields: [
      'FIRST_NAME',
      'LAST_NAME',
      'EMAIL',
      'PHONE',
      'DATE_OF_BIRTH',
    ] as const,
  },
  INSURANCE_INFO: {
    title: 'Insurance Information',
    fields: ['COVERAGE_TYPE'] as const,
  },
  HEALTH_INFO: {
    title: 'Health Information',
    fields: ['HEALTH_CONDITIONS', 'MEDICATIONS'] as const,
  },
  ADDITIONAL_INFO: {
    title: 'Additional Information',
    fields: ['MESSAGE'] as const,
  },
} as const);

// Validation patterns
export const VALIDATION_PATTERNS = Object.freeze({
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)\.]+$/,
  NAME: /^[a-zA-Z\s\-']{2,}$/,
} as const);

// Error messages
export const ERROR_MESSAGES = Object.freeze({
  REQUIRED: (fieldName: string) => `${fieldName} is required`,
  EMAIL_INVALID: 'Please enter a valid email address',
  PHONE_INVALID: 'Please enter a valid phone number',
  NAME_TOO_SHORT: (fieldName: string) =>
    `${fieldName} must be at least 2 characters`,
  AGE_REQUIREMENT: 'You must be at least 18 years old',
  INVALID_COVERAGE_TYPE: 'Please select a valid coverage type',
} as const);

// API endpoints
export const API_ENDPOINTS = Object.freeze({
  QUOTE: '/api/quote',
  HEALTH_CHECK: '/api/health',
} as const);

// Email configuration
export const EMAIL_CONFIG = Object.freeze({
  SERVICE: 'gmail',
  AGENCY_SUBJECT: (firstName: string, lastName: string) =>
    `New Life Insurance Quote Request from ${firstName} ${lastName}`,
  CUSTOMER_SUBJECT: 'Life Insurance Quote Request Confirmation - Mowry Agency',
  CONTACT_PHONE: '(930) 322-1962',
} as const);

// Database configuration
export const DATABASE_CONFIG = Object.freeze({
  LEAD_TYPE: 'insurance_quote',
  LEAD_SOURCE: 'quote_form',
  DEFAULT_STATUS: 'new',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const);

// UI configuration
export const UI_CONFIG = Object.freeze({
  FORM_DEBOUNCE_DELAY: 300,
  LOADING_TIMEOUT: 30000,
  SUCCESS_MESSAGE: 'Quote request submitted successfully',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const);

// Functional helper to get field configuration
export const getFieldConfig = (fieldName: keyof typeof FORM_FIELDS) =>
  FORM_FIELDS[fieldName];

// Functional helper to get section fields
export const getSectionFields = (sectionName: keyof typeof FORM_SECTIONS) =>
  FORM_SECTIONS[sectionName].fields.map((fieldName) => FORM_FIELDS[fieldName]);

// Type definitions for better type safety
export type FormFieldName = keyof typeof FORM_FIELDS;
export type FormSectionName = keyof typeof FORM_SECTIONS;
export type ValidationPattern = keyof typeof VALIDATION_PATTERNS;
