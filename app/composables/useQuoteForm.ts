import { reactive, computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import {
  calculateAge,
  isValidAge,
  getTodayInputFormat,
  isValidDateString,
} from '~/utils/dateUtils';

// Import Joi validation for DRY principle and database consistency
import { useQuoteFormValidation } from '~/composables/useJoiValidation';

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

  // Initialize Joi validation
  const joiValidation = useQuoteFormValidation();

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

  // Error tracking (using Joi validation errors)
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

  // Validation function using Joi
  const validateField = (fieldName: keyof QuoteFormErrors) => {
    const value = form[fieldName as keyof QuoteFormData];
    const errorMsg = joiValidation.validateField(fieldName, value);
    errors[fieldName] = errorMsg;
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
  };
};
