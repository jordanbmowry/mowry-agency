// Functional validation composable with pure functions

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Higher-order function to create validators
const createValidator =
  <T>(rules: ValidationRule<T>[]) =>
  (value: T): ValidationResult => {
    for (const rule of rules) {
      if (!rule.validate(value)) {
        return { isValid: false, error: rule.message };
      }
    }
    return { isValid: true };
  };

// Pure validation rules
export const validationRules = {
  required: <T>(fieldName: string): ValidationRule<T> => ({
    validate: (value: T) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value != null && value !== '';
    },
    message: `${fieldName} is required`,
  }),

  minLength: (min: number, fieldName: string): ValidationRule<string> => ({
    validate: (value: string) => value.trim().length >= min,
    message: `${fieldName} must be at least ${min} characters`,
  }),

  email: (): ValidationRule<string> => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address',
  }),

  phone: (): ValidationRule<string> => ({
    validate: (value: string) => /^\+?[\d\s\-\(\)\.]{10,}$/.test(value),
    message: 'Please enter a valid phone number',
  }),

  name: (fieldName: string): ValidationRule<string> => ({
    validate: (value: string) => /^[a-zA-Z\s\-']{2,}$/.test(value.trim()),
    message: `${fieldName} must contain only letters and be at least 2 characters`,
  }),

  age18Plus: (): ValidationRule<string> => ({
    validate: (dateOfBirth: string) => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      return age > 18 || (age === 18 && monthDiff >= 0);
    },
    message: 'You must be at least 18 years old',
  }),

  boolean: (fieldName: string): ValidationRule<boolean> => ({
    validate: (value: boolean) => value === true,
    message: `${fieldName} is required`,
  }),
};

// Pre-configured validators for common fields
export const validators = {
  firstName: createValidator([
    validationRules.required('First name'),
    validationRules.name('First name'),
  ]),

  lastName: createValidator([
    validationRules.required('Last name'),
    validationRules.name('Last name'),
  ]),

  email: createValidator([
    validationRules.required('Email'),
    validationRules.email(),
  ]),

  phone: createValidator([
    validationRules.required('Phone'),
    validationRules.phone(),
  ]),

  dateOfBirth: createValidator([
    validationRules.required('Date of birth'),
    validationRules.age18Plus(),
  ]),

  city: createValidator([
    validationRules.required('City'),
    validationRules.minLength(2, 'City'),
  ]),

  state: createValidator([
    validationRules.required('State'),
    validationRules.minLength(2, 'State'),
  ]),

  coverageType: createValidator([validationRules.required('Coverage type')]),

  healthConditions: createValidator([
    validationRules.required('Health conditions'),
    validationRules.minLength(3, 'Health conditions'),
  ]),

  medications: createValidator([
    validationRules.required('Medications'),
    validationRules.minLength(3, 'Medications'),
  ]),

  tcpaConsent: createValidator([validationRules.boolean('TCPA consent')]),
};

// Functional form validation utility
export const validateForm = <T extends Record<string, any>>(
  formData: T,
  fieldValidators: Record<keyof T, (value: any) => ValidationResult>
): { isValid: boolean; errors: Record<keyof T, string> } => {
  const errors = {} as Record<keyof T, string>;
  let isValid = true;

  for (const [field, validator] of Object.entries(fieldValidators)) {
    const result = validator(formData[field as keyof T]);
    if (!result.isValid && result.error) {
      errors[field as keyof T] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Composable for reactive validation
export const useFormValidation = <T extends Record<string, any>>(
  formData: Ref<T>,
  fieldValidators: Record<keyof T, (value: any) => ValidationResult>
) => {
  const errors = ref<Record<keyof T, string>>({} as Record<keyof T, string>);
  const isValid = ref(true);

  const validateField = (field: keyof T) => {
    const validator = fieldValidators[field];
    if (validator) {
      const result = validator(formData.value[field]);
      if (result.isValid) {
        delete errors.value[field];
      } else if (result.error) {
        errors.value[field] = result.error;
      }
    }
  };

  const validateAll = () => {
    const result = validateForm(formData.value, fieldValidators);
    errors.value = result.errors;
    isValid.value = result.isValid;
    return result;
  };

  // Watch form changes and validate in real-time
  watch(
    formData,
    () => {
      validateAll();
    },
    { deep: true }
  );

  return {
    errors: readonly(errors),
    isValid: readonly(isValid),
    validateField,
    validateAll,
  };
};
