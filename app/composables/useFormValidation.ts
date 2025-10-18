/**
 * Form Validation Composable
 * Provides reusable form validation logic using functional programming principles
 */

import { ref, computed, type Ref } from 'vue';

// Type definitions
export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface FieldConfig {
  rules: ValidationRule[];
  required?: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Pure validation functions
export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value != null && value !== '';
    },
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Allow empty if not required
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Allow empty if not required
      const phoneRegex = /^[\d\s()+-]+$/;
      const digitsOnly = value.replace(/\D/g, '');
      return phoneRegex.test(value) && digitsOnly.length >= 10;
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Allow empty if not required
      return value.length >= min;
    },
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Allow empty if not required
      return value.length <= max;
    },
    message: message || `Must be no more than ${max} characters`,
  }),

  minAge: (minAge: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Allow empty if not required
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= minAge;
      }
      return age >= minAge;
    },
    message: message || `You must be at least ${minAge} years old`,
  }),

  pattern: (pattern: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Allow empty if not required
      return pattern.test(value);
    },
    message,
  }),

  custom: (
    validator: (value: any) => boolean,
    message: string
  ): ValidationRule => ({
    validate: validator,
    message,
  }),
};

// Pure function to validate a single field
const validateField = (value: any, config: FieldConfig): string | null => {
  // Check required
  if (config.required && !validators.required().validate(value)) {
    return validators.required().message;
  }

  // Check other rules
  for (const rule of config.rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }

  return null;
};

// Pure function to validate all fields
const validateAllFields = (
  formData: Record<string, any>,
  fieldConfigs: Record<string, FieldConfig>
): ValidationErrors => {
  return Object.entries(fieldConfigs).reduce((errors, [fieldName, config]) => {
    const error = validateField(formData[fieldName], config);
    if (error) {
      errors[fieldName] = error;
    }
    return errors;
  }, {} as ValidationErrors);
};

/**
 * Main composable for form validation
 */
export const useFormValidation = <T extends Record<string, any>>(
  formData: Ref<T>,
  fieldConfigs: Record<keyof T, FieldConfig>
) => {
  const errors = ref<ValidationErrors>({});
  const touchedFields = ref<Set<string>>(new Set());

  // Validate a single field (pure function wrapped in reactive)
  const validateSingleField = (fieldName: keyof T): boolean => {
    const config = fieldConfigs[fieldName as string];
    if (!config) return true;

    const error = validateField(formData.value[fieldName], config);

    if (error) {
      errors.value = { ...errors.value, [fieldName]: error };
      return false;
    } else {
      const { [fieldName as string]: _, ...rest } = errors.value;
      errors.value = rest;
      return true;
    }
  };

  // Mark field as touched
  const touchField = (fieldName: keyof T) => {
    touchedFields.value = new Set([
      ...touchedFields.value,
      fieldName as string,
    ]);
  };

  // Validate all fields
  const validateAll = (): boolean => {
    const validationErrors = validateAllFields(
      formData.value,
      fieldConfigs as Record<string, FieldConfig>
    );

    errors.value = validationErrors;

    // Mark all fields as touched
    touchedFields.value = new Set(Object.keys(fieldConfigs));

    return Object.keys(validationErrors).length === 0;
  };

  // Clear a specific field error
  const clearError = (fieldName: keyof T) => {
    const { [fieldName as string]: _, ...rest } = errors.value;
    errors.value = rest;
  };

  // Clear all errors
  const clearAllErrors = () => {
    errors.value = {};
    touchedFields.value = new Set();
  };

  // Check if a field has been touched
  const isFieldTouched = (fieldName: keyof T): boolean => {
    return touchedFields.value.has(fieldName as string);
  };

  // Check if a specific field is valid
  const isFieldValid = (fieldName: keyof T): boolean => {
    return !errors.value[fieldName as string];
  };

  // Check if the entire form is valid
  const isFormValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  // Get error for a specific field
  const getError = (fieldName: keyof T): string | undefined => {
    return errors.value[fieldName as string];
  };

  // Check if any fields have been touched
  const hasAnyTouchedFields = computed(() => {
    return touchedFields.value.size > 0;
  });

  return {
    errors: computed(() => errors.value),
    validateSingleField,
    validateAll,
    touchField,
    clearError,
    clearAllErrors,
    isFieldTouched,
    isFieldValid,
    isFormValid,
    getError,
    hasAnyTouchedFields,
  };
};

// Helper to create field configurations
export const createFieldConfig = (
  required: boolean,
  ...rules: ValidationRule[]
): FieldConfig => ({
  required,
  rules,
});
