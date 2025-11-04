import Joi from 'joi';
import { computed, readonly, ref } from 'vue';
import type { QuoteFormData } from './useQuoteForm';

/**
 * Joi Validation Schemas for Lead Forms
 * All schemas match database.types.ts constraints from the 'leads' table
 */

// Shared field validators matching database constraints
const sharedValidators = {
  firstName: Joi.string().required().min(2).max(100).trim().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must be less than 100 characters',
  }),

  lastName: Joi.string().required().min(2).max(100).trim().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must be less than 100 characters',
  }),

  email: Joi.string().required().email().max(254).trim().lowercase().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
    'string.max': 'Email must be less than 254 characters',
  }),

  // Database: phone: string (required, not nullable)
  phone: Joi.string()
    .required()
    .custom((value, helpers) => {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        return helpers.error('phone.length');
      }
      if (digitsOnly.length > 15) {
        return helpers.error('phone.maxLength');
      }
      return value;
    })
    .messages({
      'string.empty': 'Phone number is required',
      'phone.length': 'Phone number must have at least 10 digits',
      'phone.maxLength': 'Phone number must be less than 15 digits',
    }),

  // Database: date_of_birth: string | null
  dateOfBirth: Joi.string()
    .required()
    .custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('date.invalid');
      }

      const today = new Date();
      if (date > today) {
        return helpers.error('date.future');
      }

      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();

      let actualAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        actualAge = age - 1;
      }

      if (actualAge < 18) {
        return helpers.error('date.minAge');
      }
      if (actualAge > 100) {
        return helpers.error('date.maxAge');
      }

      return value;
    })
    .messages({
      'string.empty': 'Date of birth is required',
      'date.invalid': 'Please enter a valid date',
      'date.future': 'Date of birth cannot be in the future',
      'date.minAge': 'You must be at least 18 years old',
      'date.maxAge': 'Please enter a valid date of birth',
    }),

  // Database: sex: string | null
  sex: Joi.string().required().valid('male', 'female').messages({
    'any.required': 'Sex is required',
    'any.only': 'Please select a valid option',
  }),

  // Database: city: string | null
  city: Joi.string().required().min(2).max(100).trim().messages({
    'string.empty': 'City is required',
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City must be less than 100 characters',
  }),

  // Database: state: string | null
  state: Joi.string().required().length(2).uppercase().messages({
    'string.empty': 'State is required',
    'string.length': 'State must be a 2-letter code',
  }),

  // Database: height: number | null (in inches: 36-96)
  height: Joi.number().required().min(36).max(96).messages({
    'number.base': 'Height must be a number',
    'any.required': 'Height is required',
    'number.min': 'Height must be between 36 and 96 inches',
    'number.max': 'Height must be between 36 and 96 inches',
  }),

  // Database: weight: number | null (in pounds: 50-500)
  weight: Joi.number().required().min(50).max(500).messages({
    'number.base': 'Weight must be a number',
    'any.required': 'Weight is required',
    'number.min': 'Weight must be between 50 and 500 pounds',
    'number.max': 'Weight must be between 50 and 500 pounds',
  }),

  // Database: health_conditions: string | null
  healthConditions: Joi.string().required().min(3).max(500).trim().messages({
    'string.empty': 'Please describe your health conditions or enter "None"',
    'string.min': 'Please provide more detail (at least 3 characters)',
    'string.max': 'Health conditions must be less than 500 characters',
  }),

  // Database: current_medications: string | null
  currentMedications: Joi.string().required().min(3).max(500).trim().messages({
    'string.empty': 'Please list current medications or enter "None"',
    'string.min': 'Please provide more detail (at least 3 characters)',
    'string.max': 'Medications must be less than 500 characters',
  }),

  // Database: coverage_type: string | null
  coverageType: Joi.string()
    .required()
    .valid('term-life', 'whole-life', 'iul', 'mortgage-protection', 'final-expense', 'not-sure')
    .messages({
      'string.empty': 'Coverage type is required',
      'any.only': 'Please select a valid coverage type',
    }),

  // Database: loan_amount: number | null (optional)
  loanAmount: Joi.number().optional().allow(null).min(0).max(10000000).messages({
    'number.base': 'Loan amount must be a number',
    'number.min': 'Loan amount cannot be negative',
    'number.max': 'Loan amount must be less than $10,000,000',
  }),

  // Database: status: string (default 'new')
  status: Joi.string().required().valid('new', 'in_progress', 'contacted', 'closed').messages({
    'string.empty': 'Status is required',
    'any.only': 'Please select a valid status',
  }),

  // Database: tcpa_consent: boolean (required)
  tcpaConsent: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must consent to be contacted',
    'any.required': 'TCPA consent is required',
  }),

  // Database: email_marketing_consent: boolean
  emailMarketingConsent: Joi.boolean().optional().default(false),

  // Database: message: string | null
  message: Joi.string().optional().allow('', null).max(1000).messages({
    'string.max': 'Message must be less than 1000 characters',
  }),

  // Database: agent_notes: string | null (admin only)
  agentNotes: Joi.string().optional().allow('', null).max(1000).messages({
    'string.max': 'Agent notes must be less than 1000 characters',
  }),
};

/**
 * Quote Form Validation Schema (Public-facing quote request form)
 * Matches all required fields for new lead submission
 */
export const quoteFormValidationSchema = Joi.object({
  firstName: sharedValidators.firstName,
  lastName: sharedValidators.lastName,
  email: sharedValidators.email,
  phone: sharedValidators.phone,
  dateOfBirth: sharedValidators.dateOfBirth,
  sex: sharedValidators.sex,
  city: sharedValidators.city,
  state: sharedValidators.state,
  height: sharedValidators.height,
  weight: sharedValidators.weight,
  healthConditions: sharedValidators.healthConditions,
  medications: sharedValidators.currentMedications, // Frontend uses 'medications'
  coverageType: sharedValidators.coverageType,
  tcpaConsent: sharedValidators.tcpaConsent,
  emailMarketingConsent: sharedValidators.emailMarketingConsent,
  message: sharedValidators.message,
  formVersion: Joi.string().optional().default('v1.2'),
});

/**
 * Admin Lead Edit Validation Schema
 * Used for editing existing leads in the admin panel
 */
export const leadEditValidationSchema = Joi.object({
  first_name: sharedValidators.firstName,
  last_name: sharedValidators.lastName,
  email: sharedValidators.email,
  phone: sharedValidators.phone,
  date_of_birth: sharedValidators.dateOfBirth,
  sex: sharedValidators.sex,
  city: sharedValidators.city,
  state: sharedValidators.state,
  height: sharedValidators.height,
  weight: sharedValidators.weight,
  coverage_type: sharedValidators.coverageType,
  status: sharedValidators.status,
  health_conditions: Joi.string().optional().allow('', null).max(500).messages({
    'string.max': 'Health conditions must be less than 500 characters',
  }),
  current_medications: Joi.string().optional().allow('', null).max(500).messages({
    'string.max': 'Medications must be less than 500 characters',
  }),
  loan_amount: sharedValidators.loanAmount,
  agent_notes: sharedValidators.agentNotes,
  message: sharedValidators.message,
});

// TypeScript interfaces matching the schemas
export interface LeadEditFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  sex: 'male' | 'female';
  city: string;
  state: string;
  height: number | string;
  weight: number | string;
  coverage_type: string;
  status: 'new' | 'in_progress' | 'contacted' | 'closed';
  health_conditions?: string;
  current_medications?: string;
  loan_amount?: number | null;
  agent_notes?: string;
  message?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Composable for Quote Form Validation
 */
export const useQuoteFormValidation = () => {
  const errors = ref<ValidationErrors>({});
  const isValidating = ref(false);

  // Validate a single field
  const validateField = (fieldName: string, value: any): string => {
    try {
      const fieldSchema = quoteFormValidationSchema.extract(fieldName);
      fieldSchema.validate(value, { abortEarly: true });

      // Clear error if validation passes
      if (errors.value[fieldName]) {
        delete errors.value[fieldName];
      }
      return '';
    } catch (error: any) {
      const errorMessage = error.details?.[0]?.message || 'Invalid value';
      errors.value[fieldName] = errorMessage;
      return errorMessage;
    }
  };

  // Validate entire form
  const validateForm = (data: QuoteFormData): { isValid: boolean; errors: ValidationErrors } => {
    isValidating.value = true;
    const newErrors: ValidationErrors = {};

    try {
      quoteFormValidationSchema.validate(data, { abortEarly: false });
    } catch (error: any) {
      if (error.details) {
        error.details.forEach((detail: any) => {
          newErrors[detail.path[0]] = detail.message;
        });
      }
    }

    errors.value = newErrors;
    isValidating.value = false;

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  // Clear all errors
  const clearErrors = () => {
    errors.value = {};
  };

  // Clear specific field error
  const clearFieldError = (fieldName: string) => {
    if (errors.value[fieldName]) {
      delete errors.value[fieldName];
    }
  };

  // Get error for specific field
  const getFieldError = (fieldName: string): string => {
    return errors.value[fieldName] || '';
  };

  // Check if form has any errors
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  return {
    errors: readonly(errors),
    isValidating: readonly(isValidating),
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasErrors,
  };
};

/**
 * Composable for Lead Edit Form Validation (Admin)
 */
export const useLeadEditValidation = () => {
  const errors = ref<ValidationErrors>({});
  const isValidating = ref(false);

  // Validate a single field
  const validateField = (fieldName: string, value: any): string => {
    try {
      const fieldSchema = leadEditValidationSchema.extract(fieldName);
      fieldSchema.validate(value, { abortEarly: true });

      // Clear error if validation passes
      if (errors.value[fieldName]) {
        delete errors.value[fieldName];
      }
      return '';
    } catch (error: any) {
      const errorMessage = error.details?.[0]?.message || 'Invalid value';
      errors.value[fieldName] = errorMessage;
      return errorMessage;
    }
  };

  // Validate entire form
  const validateForm = (data: LeadEditFormData): { isValid: boolean; errors: ValidationErrors } => {
    isValidating.value = true;
    const newErrors: ValidationErrors = {};

    try {
      leadEditValidationSchema.validate(data, { abortEarly: false });
    } catch (error: any) {
      if (error.details) {
        error.details.forEach((detail: any) => {
          newErrors[detail.path[0]] = detail.message;
        });
      }
    }

    errors.value = newErrors;
    isValidating.value = false;

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  // Clear all errors
  const clearErrors = () => {
    errors.value = {};
  };

  // Clear specific field error
  const clearFieldError = (fieldName: string) => {
    if (errors.value[fieldName]) {
      delete errors.value[fieldName];
    }
  };

  // Get error for specific field
  const getFieldError = (fieldName: string): string => {
    return errors.value[fieldName] || '';
  };

  // Check if form has any errors
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  return {
    errors: readonly(errors),
    isValidating: readonly(isValidating),
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasErrors,
  };
};
