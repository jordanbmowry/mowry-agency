import Joi from 'joi';

// Joi validation schema for quote form data (includes all required fields)
export const quoteValidationSchema = Joi.object({
  first_name: Joi.string().required().min(2).max(50).trim().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must be less than 50 characters',
  }),

  last_name: Joi.string().required().min(2).max(50).trim().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must be less than 50 characters',
  }),

  email: Joi.string().required().email().max(100).trim().lowercase().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
    'string.max': 'Email must be less than 100 characters',
  }),

  phone: Joi.string().required().min(10).trim().messages({
    'string.empty': 'Phone number is required',
    'string.min': 'Phone number must be at least 10 digits',
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
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
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
      'date.age': 'Age must be between 18 and 85 years old',
    }),

  sex: Joi.string().required().valid('male', 'female').messages({
    'any.required': 'Sex is required',
    'any.only': 'Please select a valid option',
  }),

  city: Joi.string().required().min(2).max(50).trim().messages({
    'string.empty': 'City is required',
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City must be less than 50 characters',
  }),

  state: Joi.string().required().length(2).uppercase().messages({
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

  coverage_type: Joi.string()
    .required()
    .valid('term-life', 'whole-life', 'iul', 'mortgage-protection', 'final-expense', 'not-sure')
    .messages({
      'string.empty': 'Coverage type is required',
      'any.only': 'Please select a valid coverage type',
    }),

  health_conditions: Joi.string().required().max(500).messages({
    'string.empty': 'Health conditions information is required',
    'string.max': 'Health conditions must be less than 500 characters',
  }),

  current_medications: Joi.string().required().max(500).messages({
    'string.empty': 'Current medications information is required',
    'string.max': 'Medications must be less than 500 characters',
  }),

  tcpa_consent: Joi.boolean().required().valid(true).messages({
    'any.required': 'TCPA consent is required',
    'any.only': 'You must agree to TCPA consent to proceed',
  }),

  message: Joi.string().optional().allow('').max(1000).messages({
    'string.max': 'Message must be less than 1000 characters',
  }),
});

// Joi validation schema for lead data (admin updates - all fields optional)
export const leadUpdateValidationSchema = Joi.object({
  first_name: Joi.string().optional().min(2).max(50).trim().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must be less than 50 characters',
  }),

  last_name: Joi.string().optional().min(2).max(50).trim().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must be less than 50 characters',
  }),

  email: Joi.string().optional().email().max(100).trim().lowercase().messages({
    'string.email': 'Please enter a valid email address',
    'string.max': 'Email must be less than 100 characters',
  }),

  phone: Joi.string().optional().min(10).trim().messages({
    'string.min': 'Phone number must be at least 10 digits',
  }),

  date_of_birth: Joi.string()
    .optional()
    .custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('date.invalid');
      }

      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();

      let actualAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        actualAge = age - 1;
      }

      if (actualAge < 18 || actualAge > 85) {
        return helpers.error('date.age');
      }

      return value;
    })
    .messages({
      'date.invalid': 'Please enter a valid date',
      'date.age': 'Age must be between 18 and 85 years old',
    }),

  sex: Joi.string().optional().valid('male', 'female').messages({
    'any.only': 'Please select a valid option',
  }),

  city: Joi.string().optional().min(2).max(50).trim().messages({
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City must be less than 50 characters',
  }),

  state: Joi.string().optional().length(2).uppercase().messages({
    'string.length': 'State must be a 2-letter code',
  }),

  height: Joi.number()
    .optional()
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
      'height.range': 'Height must be between 3.0 and 8.0 (3\'0" to 8\'0")',
    }),

  weight: Joi.number().optional().min(50).max(500).messages({
    'number.base': 'Weight must be a number',
    'number.min': 'Weight must be between 50 and 500 pounds',
    'number.max': 'Weight must be between 50 and 500 pounds',
  }),

  coverage_type: Joi.string()
    .optional()
    .valid('term-life', 'whole-life', 'iul', 'mortgage-protection', 'final-expense', 'not-sure')
    .messages({
      'any.only': 'Please select a valid coverage type',
    }),

  status: Joi.string()
    .optional()
    .valid('new', 'in_progress', 'contacted', 'quoted', 'closed')
    .messages({
      'any.only': 'Please select a valid status',
    }),

  health_conditions: Joi.string().optional().allow('').max(500).messages({
    'string.max': 'Health conditions must be less than 500 characters',
  }),

  current_medications: Joi.string().optional().allow('').max(500).messages({
    'string.max': 'Medications must be less than 500 characters',
  }),

  message: Joi.string().optional().allow('').max(1000).messages({
    'string.max': 'Message must be less than 1000 characters',
  }),

  loan_amount: Joi.number().optional().allow(null).min(0).max(10000000).messages({
    'number.min': 'Loan amount must be a positive number',
    'number.max': 'Loan amount must be less than $10,000,000',
  }),
});

// Type definitions
export interface QuoteValidationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  sex: 'male' | 'female';
  city: string;
  state: string;
  height: number;
  weight: number;
  coverage_type:
    | 'term-life'
    | 'whole-life'
    | 'iul'
    | 'mortgage-protection'
    | 'final-expense'
    | 'not-sure';
  health_conditions: string;
  current_medications: string;
  tcpa_consent: boolean;
  message?: string;
}

export interface LeadUpdateValidationData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  sex?: 'male' | 'female';
  city?: string;
  state?: string;
  height?: number;
  weight?: number;
  coverage_type?:
    | 'term-life'
    | 'whole-life'
    | 'iul'
    | 'mortgage-protection'
    | 'final-expense'
    | 'not-sure';
  status?: 'new' | 'in_progress' | 'contacted' | 'quoted' | 'closed';
  health_conditions?: string;
  current_medications?: string;
  message?: string;
  loan_amount?: number | null;
}
