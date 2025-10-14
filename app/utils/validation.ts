// Pure validation functions following functional programming principles
// These functions are pure - same input always produces same output, no side effects

// Type definitions for better type safety
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
  tcpaConsent: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Pure validation functions
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
    ? { isValid: true }
    : { isValid: false, error: 'Please enter a valid email address' };
};

export const validateName = (
  name: string,
  fieldName: string
): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters`,
    };
  }

  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }

  return { isValid: true };
};

export const validateDateOfBirth = (dateOfBirth: string): ValidationResult => {
  if (!dateOfBirth) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;

  if (actualAge < 18) {
    return { isValid: false, error: 'You must be at least 18 years old' };
  }

  return { isValid: true };
};

export const validateCoverageType = (
  coverageType: string
): ValidationResult => {
  const validTypes = ['term-life', 'whole-life', 'iul', 'not-sure'];

  if (!coverageType) {
    return { isValid: false, error: 'Please select a coverage type' };
  }

  if (!validTypes.includes(coverageType)) {
    return { isValid: false, error: 'Please select a valid coverage type' };
  }

  return { isValid: true };
};

export const validateRequiredText = (
  text: string,
  fieldName: string
): ValidationResult => {
  if (!text.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

export const validateTcpaConsent = (consent: boolean): ValidationResult => {
  if (consent !== true) {
    return {
      isValid: false,
      error: 'You must agree to be contacted to submit this form',
    };
  }

  return { isValid: true };
};

// Higher-order function for validation composition
export const composeValidations = (
  ...validators: ((value: any) => ValidationResult)[]
): ((value: any) => ValidationResult) => {
  return (value: any): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
};

// Form validation function using functional composition
export const validateFormData = (
  formData: Partial<FormData>
): Record<string, ValidationResult> => {
  return {
    firstName: validateName(formData.firstName || '', 'First name'),
    lastName: validateName(formData.lastName || '', 'Last name'),
    email: validateEmail(formData.email || ''),
    phone: validatePhone(formData.phone || ''),
    dateOfBirth: validateDateOfBirth(formData.dateOfBirth || ''),
    coverageType: validateCoverageType(formData.coverageType || ''),
    healthConditions: validateRequiredText(
      formData.healthConditions || '',
      'Health conditions'
    ),
    medications: validateRequiredText(
      formData.medications || '',
      'Current medications'
    ),
    tcpaConsent: validateTcpaConsent(formData.tcpaConsent || false),
  };
};

// Utility function to check if form is valid (pure function)
export const isFormValid = (
  validationResults: Record<string, ValidationResult>
): boolean => {
  return Object.values(validationResults).every((result) => result.isValid);
};

// Extract validation errors (pure function)
export const getValidationErrors = (
  validationResults: Record<string, ValidationResult>
): Record<string, string> => {
  return Object.entries(validationResults)
    .filter(([_, result]) => !result.isValid)
    .reduce(
      (errors, [field, result]) => ({
        ...errors,
        [field]: result.error || 'Invalid input',
      }),
      {}
    );
};
