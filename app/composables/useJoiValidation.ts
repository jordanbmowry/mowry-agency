import Joi from 'joi';
import { ref, computed, readonly } from 'vue';

// Joi validation schema for admin lead edit form
export const leadEditValidationSchema = Joi.object({
  first_name: Joi.string().required().min(2).max(100).trim().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must be less than 100 characters',
  }),

  last_name: Joi.string().required().min(2).max(100).trim().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must be less than 100 characters',
  }),

  email: Joi.string().required().email().max(100).trim().lowercase().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
    'string.max': 'Email must be less than 100 characters',
  }),

  phone: Joi.string()
    .required()
    .custom((value, helpers) => {
      // Remove all non-digit characters for validation
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        return helpers.error('phone.length');
      }
      return value;
    })
    .messages({
      'string.empty': 'Phone number is required',
      'phone.length': 'Phone number must be at least 10 digits',
    }),

  date_of_birth: Joi.string()
    .required()
    .custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('date.invalid');
      }

      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();

      let actualAge = age;
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < date.getDate())
      ) {
        actualAge = age - 1;
      }

      if (actualAge < 18 || actualAge > 85) {
        return helpers.error('date.age');
      }

      return value;
    })
    .messages({
      'string.empty': 'Date of birth is required',
      'date.invalid': 'Please enter a valid date',
      'date.age': 'Must be between 18 and 85 years old',
    }),

  sex: Joi.string().required().valid('male', 'female', 'other').messages({
    'string.empty': 'Sex is required',
    'any.only': 'Please select a valid option',
  }),

  city: Joi.string().required().min(2).max(50).trim().messages({
    'string.empty': 'City is required',
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City must be less than 50 characters',
  }),

  state: Joi.string().required().length(2).messages({
    'string.empty': 'State is required',
    'string.length': 'State must be a 2-letter code',
  }),

  height: Joi.number()
    .required()
    .custom((value, helpers) => {
      // Height should be in decimal feet format (e.g., 5.8 for 5'8")
      if (value < 3.0 || value > 8.0) {
        return helpers.error('height.range');
      }

      // Convert to inches for validation
      const feet = Math.floor(value);
      const inches = Math.round((value - feet) * 10);
      const totalInches = feet * 12 + inches;

      if (totalInches < 36 || totalInches > 96) {
        return helpers.error('height.range');
      }

      return value;
    })
    .messages({
      'number.base': 'Height must be a number',
      'any.required': 'Height is required',
      'height.range': 'Height must be between 3.0 and 8.0 (3\'0" to 8\'0")',
    }),

  weight: Joi.number().required().min(50).max(500).messages({
    'number.base': 'Weight must be a number',
    'any.required': 'Weight is required',
    'number.min': 'Weight must be between 50 and 500 pounds',
    'number.max': 'Weight must be between 50 and 500 pounds',
  }),

  coverage_type: Joi.string().required().messages({
    'string.empty': 'Coverage type is required',
  }),

  status: Joi.string()
    .required()
    .valid('new', 'in_progress', 'contacted', 'quoted', 'closed')
    .messages({
      'string.empty': 'Status is required',
      'any.only': 'Please select a valid status',
    }),

  health_conditions: Joi.string().optional().allow('').max(1000).messages({
    'string.max': 'Health conditions must be less than 1000 characters',
  }),

  medications: Joi.string().optional().allow('').max(1000).messages({
    'string.max': 'Medications must be less than 1000 characters',
  }),

  loan_amount: Joi.number().optional().allow(null).min(0).messages({
    'number.base': 'Loan amount must be a number',
    'number.min': 'Loan amount must be positive',
  }),

  message: Joi.string().optional().allow('').max(1000).messages({
    'string.max': 'Message must be less than 1000 characters',
  }),
});

export interface LeadFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  sex: 'male' | 'female' | 'other';
  city: string;
  state: string;
  height: number | string;
  weight: number | string;
  coverage_type: string;
  status: 'new' | 'in_progress' | 'contacted' | 'quoted' | 'closed';
  health_conditions: string;
  medications: string;
  loan_amount: number | string | null;
  message: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useJoiValidation = () => {
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
  const validateForm = (
    data: LeadFormData
  ): { isValid: boolean; errors: ValidationErrors } => {
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
