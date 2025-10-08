// Refactored quote API using functional programming principles
import {
  validateFormData,
  isFormValid,
  getValidationErrors,
} from '../../app/utils/validation';
import { useDatabase } from '../../app/composables/useDatabase';
import { useEmailService } from '../../app/composables/useEmailService';

// Type definitions (inline to avoid import path issues)
interface ApiResponse {
  success: boolean;
  message: string;
  leadId?: string;
  emailSent?: boolean;
}

// Pure function to create error response
const createErrorResponse = (statusCode: number, message: string) => {
  throw createError({
    statusCode,
    statusMessage: message,
  });
};

// Pure function to create success response
const createSuccessResponse = (
  leadId: string,
  emailSent: boolean
): ApiResponse => ({
  success: true,
  message: 'Quote request submitted successfully',
  leadId,
  emailSent,
});

// Main handler using functional composition
export default defineEventHandler(async (event) => {
  try {
    // Parse request body
    const formData = await readBody(event);

    // Validate form data using pure functions
    const validationResults = validateFormData(formData);

    if (!isFormValid(validationResults)) {
      const errors = getValidationErrors(validationResults);
      const errorMessage = Object.values(errors).join(', ');
      return createErrorResponse(400, `Validation failed: ${errorMessage}`);
    }

    // Initialize services
    const { createLeadWithRetry, transformFormDataToLeadData } = useDatabase();
    const { sendQuoteEmails } = useEmailService();

    // Transform and save lead data
    const leadData = transformFormDataToLeadData(formData);
    const dbResult = await createLeadWithRetry(leadData);

    if (!dbResult.success) {
      console.error('Database error:', dbResult.error);
      return createErrorResponse(
        500,
        dbResult.error || 'Failed to save quote request'
      );
    }

    // Send emails (non-blocking for user experience)
    const emailResult = await sendQuoteEmails(formData);

    // Return success response
    return createSuccessResponse(dbResult.data.id, emailResult.emailSent);
  } catch (error: any) {
    console.error('Quote request error:', error);

    // Return appropriate error response
    if (error.statusCode) {
      throw error;
    }

    return createErrorResponse(500, 'Failed to process quote request');
  }
});
