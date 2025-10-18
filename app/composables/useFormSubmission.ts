/**
 * Form Submission Composable
 * Provides reusable form submission logic with loading states and error handling
 * Using functional programming principles
 */

import { ref, computed, type Ref } from 'vue';

export interface SubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  data: any | null;
}

export interface SubmissionOptions<T> {
  onSuccess?: (data: any) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
  resetOnSuccess?: boolean;
  successMessage?: string;
}

/**
 * Composable for handling form submissions
 */
export const useFormSubmission = <T extends Record<string, any>>(
  submitFn: (data: T) => Promise<any>,
  options: SubmissionOptions<T> = {}
) => {
  const isSubmitting = ref(false);
  const isSuccess = ref(false);
  const isError = ref(false);
  const error = ref<Error | null>(null);
  const submittedData = ref<any | null>(null);

  // Computed state
  const canSubmit = computed(() => !isSubmitting.value);

  const state = computed<SubmissionState>(() => ({
    isSubmitting: isSubmitting.value,
    isSuccess: isSuccess.value,
    isError: isError.value,
    error: error.value,
    data: submittedData.value,
  }));

  // Reset state function (pure in nature)
  const resetState = () => {
    isSubmitting.value = false;
    isSuccess.value = false;
    isError.value = false;
    error.value = null;
    if (options.resetOnSuccess) {
      submittedData.value = null;
    }
  };

  // Submit function
  const submit = async (data: T): Promise<boolean> => {
    if (isSubmitting.value) {
      return false;
    }

    try {
      // Reset previous state
      isSubmitting.value = true;
      isSuccess.value = false;
      isError.value = false;
      error.value = null;

      // Call the submit function
      const result = await submitFn(data);

      // Set success state
      submittedData.value = result;
      isSuccess.value = true;

      // Call success callback if provided
      if (options.onSuccess) {
        await options.onSuccess(result);
      }

      return true;
    } catch (err) {
      // Set error state
      isError.value = true;
      error.value = err instanceof Error ? err : new Error(String(err));

      // Call error callback if provided
      if (options.onError) {
        await options.onError(error.value);
      }

      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    submit,
    resetState,
    canSubmit,
    state,
    isSubmitting: computed(() => isSubmitting.value),
    isSuccess: computed(() => isSuccess.value),
    isError: computed(() => isError.value),
    error: computed(() => error.value),
    submittedData: computed(() => submittedData.value),
  };
};

/**
 * Helper to create API submission function
 */
export const createApiSubmitter = <T extends Record<string, any>>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST'
) => {
  return async (data: T) => {
    const response = await $fetch(endpoint, {
      method,
      body: data,
    });
    return response;
  };
};

/**
 * Composable for handling multi-step forms
 */
export const useMultiStepForm = <T extends Record<string, any>>(
  totalSteps: number,
  initialStep = 1
) => {
  const currentStep = ref(initialStep);
  const completedSteps = ref<Set<number>>(new Set());

  // Pure functions for step navigation
  const canGoNext = computed(() => currentStep.value < totalSteps);
  const canGoPrevious = computed(() => currentStep.value > 1);
  const isFirstStep = computed(() => currentStep.value === 1);
  const isLastStep = computed(() => currentStep.value === totalSteps);
  const progress = computed(() => (currentStep.value / totalSteps) * 100);

  // Mark step as completed
  const completeStep = (step: number) => {
    completedSteps.value = new Set([...completedSteps.value, step]);
  };

  // Check if step is completed
  const isStepCompleted = (step: number): boolean => {
    return completedSteps.value.has(step);
  };

  // Navigation functions
  const goToStep = (step: number): boolean => {
    if (step < 1 || step > totalSteps) {
      return false;
    }
    currentStep.value = step;
    return true;
  };

  const nextStep = (): boolean => {
    if (!canGoNext.value) return false;
    completeStep(currentStep.value);
    currentStep.value++;
    return true;
  };

  const previousStep = (): boolean => {
    if (!canGoPrevious.value) return false;
    currentStep.value--;
    return true;
  };

  const resetSteps = () => {
    currentStep.value = initialStep;
    completedSteps.value = new Set();
  };

  return {
    currentStep: computed(() => currentStep.value),
    completedSteps: computed(() => Array.from(completedSteps.value)),
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
    progress,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    isStepCompleted,
    resetSteps,
    totalSteps,
  };
};
