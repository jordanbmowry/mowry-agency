// Functional API client composable
import type { QuoteFormData } from './useQuoteForm';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pure function to transform form data for API
const transformFormData = (formData: QuoteFormData) => ({
  firstName: formData.firstName.trim(),
  lastName: formData.lastName.trim(),
  email: formData.email.toLowerCase().trim(),
  phone: formData.phone.trim(),
  dateOfBirth: formData.dateOfBirth,
  city: formData.city.trim(),
  state: formData.state.trim(),
  coverageType: formData.coverageType,
  healthConditions: formData.healthConditions?.trim(),
  medications: formData.medications?.trim(),
  message: formData.message?.trim(),
  tcpaConsent: formData.tcpaConsent,
});

// API client functions
const apiClient = {
  async submitQuote(formData: QuoteFormData): Promise<ApiResponse> {
    try {
      const transformedData = transformFormData(formData);
      const response = await $fetch('/api/quote', {
        method: 'POST',
        body: transformedData,
      });

      return {
        success: true,
        data: response,
        message: 'Quote submitted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to submit quote',
        data: error,
      };
    }
  },
};

// Main composable
export const useApiClient = () => {
  const isLoading = ref(false);
  const lastError = ref<string | null>(null);

  // Execute any async operation with loading and error handling
  const executeOperation = async <T>(
    operation: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    isLoading.value = true;
    lastError.value = null;

    try {
      const result = await operation();

      if (!result.success && result.error) {
        lastError.value = result.error;
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      lastError.value = errorMessage;

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Specific operations
  const submitQuote = (formData: QuoteFormData) =>
    executeOperation(() => apiClient.submitQuote(formData));

  // Clear error state
  const clearError = () => {
    lastError.value = null;
  };

  return {
    // State
    isLoading: readonly(isLoading),
    lastError: readonly(lastError),

    // Operations
    submitQuote,
    clearError,

    // Utilities
    transformFormData,
  };
};
