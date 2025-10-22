import { reactive, computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import {
  calculateAge,
  isValidAge,
  getTodayInputFormat,
  isValidDateString,
} from '~/utils/dateUtils';

// Import validators from the main validation composable to avoid duplication
import { validators } from '~/composables/useFormValidation';

// Types
export interface QuoteFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  state: string;
  sex: string;
  height: string;
  weight: string;
  healthConditions: string;
  medications: string;
  coverageType: string;
  message: string;
  tcpaConsent: boolean;
  emailMarketingConsent: boolean;
  formVersion: string;
}

export interface QuoteFormErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  state: string;
  sex: string;
  height: string;
  weight: string;
  healthConditions: string;
  medications: string;
  coverageType: string;
}

// Custom validators specific to quote form
const quoteValidators = {
  dateOfBirth: (dateOfBirth: string): string => {
    if (!dateOfBirth.trim()) return 'Date of birth is required';

    if (!isValidDateString(dateOfBirth)) {
      return 'Please enter a valid date';
    }

    if (!isValidAge(dateOfBirth, 18)) {
      return 'You must be at least 18 years old';
    }

    const age = calculateAge(dateOfBirth);
    if (age > 100) {
      return 'Please enter a valid date of birth';
    }

    return '';
  },

  height: (height: string): string => {
    if (!height.trim()) return 'Height is required';
    const heightNum = parseFloat(height);
    if (isNaN(heightNum)) return 'Please enter a valid height';
    if (heightNum < 36 || heightNum > 96) {
      return 'Height must be between 36 and 96 inches';
    }
    return '';
  },

  weight: (weight: string): string => {
    if (!weight.trim()) return 'Weight is required';
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum)) return 'Please enter a valid weight';
    if (weightNum < 50 || weightNum > 500) {
      return 'Weight must be between 50 and 500 pounds';
    }
    return '';
  },

  healthConditions: (value: string): string => {
    if (!value.trim()) return 'Please describe your health conditions';
    if (value.trim().length < 3)
      return 'Please provide more detail (at least 3 characters)';
    return '';
  },

  medications: (value: string): string => {
    if (!value.trim()) return 'Please list current medications';
    if (value.trim().length < 3)
      return 'Please provide more detail (at least 3 characters)';
    return '';
  },

  coverageType: (value: string): string => {
    if (!value.trim()) return 'Coverage type is required';
    return '';
  },

  sex: (sex: string): string => {
    if (!sex.trim()) return 'Sex is required';
    const validSexValues = ['male', 'female', 'other'];
    if (!validSexValues.includes(sex.toLowerCase())) {
      return 'Please select a valid option';
    }
    return '';
  },

  city: (city: string): string => {
    if (!city.trim()) return 'City is required';
    if (city.trim().length < 2) return 'City must be at least 2 characters';
    return '';
  },

  state: (state: string): string => {
    if (!state.trim()) return 'State is required';
    if (state.trim().length < 2) return 'State must be at least 2 characters';
    return '';
  },
};

// Pure function to check if required fields are filled for a step
const hasRequiredFieldsForStep = (
  form: QuoteFormData,
  fields: (keyof QuoteFormData)[]
): boolean => {
  return fields.every((field) => {
    const value = form[field];
    if (typeof value === 'boolean') return value;
    return (value as string).trim() !== '';
  });
};

// Pure function to check if errors exist for given fields
const hasNoErrorsForFields = (
  errors: QuoteFormErrors,
  fields: (keyof QuoteFormErrors)[]
): boolean => {
  return fields.every((field) => errors[field] === '');
};

export const useQuoteForm = () => {
  // Multi-step form state
  const currentStep = ref(1);
  const isMounted = ref(false);

  // Local storage for form submission tracking
  const quoteFormSubmitted = useLocalStorage('quoteFormSubmitted', false);
  const submittedUserName = useLocalStorage('submittedUserName', '');

  // Form data with TCPA compliance
  const form = reactive<QuoteFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    state: '',
    sex: '',
    height: '',
    weight: '',
    healthConditions: '',
    medications: '',
    coverageType: '',
    message: '',
    tcpaConsent: false,
    emailMarketingConsent: false,
    formVersion: 'v1.2',
  });

  // Error tracking
  const errors = reactive<QuoteFormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    state: '',
    sex: '',
    height: '',
    weight: '',
    healthConditions: '',
    medications: '',
    coverageType: '',
  });

  // Form state
  const isSubmitting = ref(false);
  const submitted = ref(false);
  const error = ref(false);
  const errorMessage = ref('');
  const errorType = ref('');

  // Computed: Max date for date picker
  const maxDate = computed(() => getTodayInputFormat());

  // Step 1 validation (Personal Information)
  const step1Fields: (keyof QuoteFormData)[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'dateOfBirth',
    'sex',
    'city',
    'state',
  ];

  const isStep1Valid = computed(() => {
    return (
      hasRequiredFieldsForStep(form, step1Fields) &&
      hasNoErrorsForFields(
        errors,
        step1Fields.filter((f) => f in errors) as (keyof QuoteFormErrors)[]
      )
    );
  });

  // Step 2 validation (Health Information)
  const step2Fields: (keyof QuoteFormData)[] = [
    'height',
    'weight',
    'healthConditions',
    'medications',
  ];

  const isStep2Valid = computed(() => {
    return (
      hasRequiredFieldsForStep(form, step2Fields) &&
      hasNoErrorsForFields(errors, step2Fields as (keyof QuoteFormErrors)[])
    );
  });

  // Step 3 validation (Coverage Information)
  const step3Fields: (keyof QuoteFormData)[] = ['coverageType', 'tcpaConsent'];

  const isStep3Valid = computed(() => {
    return (
      hasRequiredFieldsForStep(form, step3Fields) && errors.coverageType === ''
    );
  });

  // Current step validation
  const isCurrentStepValid = computed(() => {
    if (currentStep.value === 1) return isStep1Valid.value;
    if (currentStep.value === 2) return isStep2Valid.value;
    if (currentStep.value === 3) return isStep3Valid.value;
    return false;
  });

  // Overall form validation
  const isFormValid = computed(() => {
    return isStep1Valid.value && isStep2Valid.value && isStep3Valid.value;
  });

  // Validation function that applies validators
  const validateField = (fieldName: keyof QuoteFormErrors) => {
    const value = form[fieldName as keyof QuoteFormData];

    // Helper function to get error message from ValidationRule
    const getErrorMessage = (
      rule: import('~/composables/useFormValidation').ValidationRule
    ): string => {
      return rule.validate(value) ? '' : rule.message;
    };

    switch (fieldName) {
      case 'firstName':
        errors.firstName = getErrorMessage(
          validators.required('First name is required')
        );
        if (!errors.firstName && value) {
          const nameError = validators.minLength(
            2,
            'First name must be at least 2 characters'
          );
          errors.firstName = getErrorMessage(nameError);
        }
        break;
      case 'lastName':
        errors.lastName = getErrorMessage(
          validators.required('Last name is required')
        );
        if (!errors.lastName && value) {
          const nameError = validators.minLength(
            2,
            'Last name must be at least 2 characters'
          );
          errors.lastName = getErrorMessage(nameError);
        }
        break;
      case 'email':
        errors.email = getErrorMessage(
          validators.required('Email is required')
        );
        if (!errors.email && value) {
          errors.email = getErrorMessage(validators.email());
        }
        break;
      case 'phone':
        errors.phone = getErrorMessage(
          validators.required('Phone is required')
        );
        if (!errors.phone && value) {
          errors.phone = getErrorMessage(validators.phone());
        }
        break;
      case 'dateOfBirth':
        errors.dateOfBirth = quoteValidators.dateOfBirth(value as string);
        break;
      case 'city':
        errors.city = quoteValidators.city(value as string);
        break;
      case 'state':
        errors.state = quoteValidators.state(value as string);
        break;
      case 'sex':
        errors.sex = quoteValidators.sex(value as string);
        break;
      case 'height':
        errors.height = quoteValidators.height(value as string);
        break;
      case 'weight':
        errors.weight = quoteValidators.weight(value as string);
        break;
      case 'healthConditions':
        errors.healthConditions = quoteValidators.healthConditions(
          value as string
        );
        break;
      case 'medications':
        errors.medications = quoteValidators.medications(value as string);
        break;
      case 'coverageType':
        errors.coverageType = quoteValidators.coverageType(value as string);
        break;
    }
  };

  // Navigation functions
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      currentStep.value = step;
    }
  };

  const nextStep = () => {
    if (isCurrentStepValid.value && currentStep.value < 3) {
      currentStep.value++;
    }
  };

  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  // Reset form state
  const resetForm = () => {
    Object.keys(form).forEach((key) => {
      const typedKey = key as keyof QuoteFormData;
      if (typeof form[typedKey] === 'boolean') {
        (form[typedKey] as boolean) = false;
      } else {
        (form[typedKey] as string) = '';
      }
    });

    Object.keys(errors).forEach((key) => {
      errors[key as keyof QuoteFormErrors] = '';
    });

    currentStep.value = 1;
    isSubmitting.value = false;
    submitted.value = false;
    error.value = false;
    errorMessage.value = '';
    errorType.value = '';
  };

  // Form submission handler
  const submitForm = async () => {
    if (!isFormValid.value) {
      return { success: false, error: 'Please complete all required fields' };
    }

    isSubmitting.value = true;
    error.value = false;
    errorMessage.value = '';

    try {
      const response = await $fetch('/api/quote', {
        method: 'POST',
        body: form,
      });

      submitted.value = true;
      quoteFormSubmitted.value = true;
      submittedUserName.value = form.firstName;

      return { success: true, data: response };
    } catch (err: any) {
      error.value = true;
      submitted.value = false;

      // Handle duplicate email gracefully
      if (err.data?.isDuplicate) {
        errorType.value = 'duplicate_email';
        errorMessage.value =
          err.data.message || "We're Already Working on Your Quote!";
        return { success: true, isDuplicate: true, data: err.data };
      }

      errorType.value = 'submission_error';
      errorMessage.value =
        err.data?.message ||
        'There was an error submitting your request. Please try again or call us directly.';

      return { success: false, error: errorMessage.value };
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    // State
    form,
    errors,
    currentStep,
    isMounted,
    isSubmitting,
    submitted,
    error,
    errorMessage,
    errorType,
    quoteFormSubmitted,
    submittedUserName,

    // Computed
    maxDate,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isCurrentStepValid,
    isFormValid,

    // Methods
    validateField,
    goToStep,
    nextStep,
    previousStep,
    resetForm,
    submitForm,

    // Quote-specific validators (export for testing)
    quoteValidators,
  };
};
