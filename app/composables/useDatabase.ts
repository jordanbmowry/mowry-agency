// Database operations composable using functional programming principles
import { createClient } from '@supabase/supabase-js';

// Type definitions
interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  coverage_type: string;
  health_conditions: string;
  current_medications: string;
  message: string;
  lead_type: string;
  lead_source: string;
  status: string;
}

interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pure function to create Supabase client
const createSupabaseClient = () => {
  const config = useRuntimeConfig();
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
};

// Pure function to transform form data to lead data
export const transformFormDataToLeadData = (formData: any): LeadData => ({
  first_name: formData.firstName,
  last_name: formData.lastName,
  email: formData.email,
  phone: formData.phone,
  date_of_birth: formData.dateOfBirth,
  coverage_type: formData.coverageType,
  health_conditions: formData.healthConditions || '',
  current_medications: formData.medications || '',
  message: formData.message || '',
  lead_type: 'insurance_quote',
  lead_source: 'quote_form',
  status: 'new',
});

// Functional error handling using Result pattern
export const createLead = async (
  leadData: LeadData
): Promise<DatabaseResult<any>> => {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }

    return {
      success: true,
      data: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to create lead: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Higher-order function for database operations with retry logic
export const withRetry = <T extends any[], R>(
  fn: (...args: T) => Promise<DatabaseResult<R>>,
  maxRetries: number = 3,
  delay: number = 1000
) => {
  return async (...args: T): Promise<DatabaseResult<R>> => {
    let lastError: string = '';

    for (let i = 0; i < maxRetries; i++) {
      const result = await fn(...args);

      if (result.success) {
        return result;
      }

      lastError = result.error || 'Unknown error';

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }

    return {
      success: false,
      error: `Failed after ${maxRetries} attempts: ${lastError}`,
    };
  };
};

// Database operations with retry
export const createLeadWithRetry = withRetry(createLead);

// Composable for database operations
export const useDatabase = () => {
  return {
    createLead,
    createLeadWithRetry,
    transformFormDataToLeadData,
  };
};
