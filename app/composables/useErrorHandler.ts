/**
 * Error Handler Composable
 * Centralized error handling with descriptive messages and logging
 * Using functional programming principles - pure functions and composability
 */

import { ref, readonly } from 'vue';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Error categories for better classification
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  NETWORK = 'network',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

/**
 * Structured error interface
 */
export interface AppError {
  id: string;
  message: string;
  userMessage: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  statusCode?: number;
  timestamp: Date;
  context?: Record<string, any>;
  originalError?: Error;
  stack?: string;
}

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  showNotification?: boolean;
  logToConsole?: boolean;
  logToServer?: boolean;
  retryable?: boolean;
}

/**
 * Pure function to generate unique error ID
 */
const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Pure function to extract status code from error
 */
const extractStatusCode = (error: any): number | undefined => {
  if (error?.statusCode) return error.statusCode;
  if (error?.response?.status) return error.response.status;
  if (error?.status) return error.status;
  return undefined;
};

/**
 * Pure function to categorize error based on status code and message
 */
const categorizeError = (error: any, statusCode?: number): ErrorCategory => {
  // By status code
  if (statusCode) {
    if (statusCode === 400) return ErrorCategory.VALIDATION;
    if (statusCode === 401) return ErrorCategory.AUTHENTICATION;
    if (statusCode === 403) return ErrorCategory.AUTHORIZATION;
    if (statusCode === 404) return ErrorCategory.NOT_FOUND;
    if (statusCode >= 500) return ErrorCategory.SERVER;
    if (statusCode >= 400) return ErrorCategory.CLIENT;
  }

  // By error message/type
  const errorMessage = error?.message?.toLowerCase() || '';
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return ErrorCategory.NETWORK;
  }
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return ErrorCategory.VALIDATION;
  }
  if (errorMessage.includes('auth')) {
    return ErrorCategory.AUTHENTICATION;
  }
  if (errorMessage.includes('not found')) {
    return ErrorCategory.NOT_FOUND;
  }
  if (errorMessage.includes('database') || errorMessage.includes('supabase')) {
    return ErrorCategory.DATABASE;
  }

  return ErrorCategory.UNKNOWN;
};

/**
 * Pure function to determine severity based on category and status code
 */
const determineSeverity = (
  category: ErrorCategory,
  statusCode?: number
): ErrorSeverity => {
  if (statusCode && statusCode >= 500) return ErrorSeverity.CRITICAL;
  if (
    category === ErrorCategory.DATABASE ||
    category === ErrorCategory.SERVER
  ) {
    return ErrorSeverity.CRITICAL;
  }
  if (
    category === ErrorCategory.AUTHENTICATION ||
    category === ErrorCategory.AUTHORIZATION
  ) {
    return ErrorSeverity.ERROR;
  }
  if (category === ErrorCategory.VALIDATION) return ErrorSeverity.WARNING;
  if (category === ErrorCategory.NOT_FOUND) return ErrorSeverity.WARNING;
  return ErrorSeverity.ERROR;
};

/**
 * Pure function to create user-friendly error messages
 */
const createUserMessage = (
  category: ErrorCategory,
  statusCode?: number,
  originalMessage?: string
): string => {
  const messages: Record<ErrorCategory, string> = {
    [ErrorCategory.VALIDATION]:
      'Please check your input and try again. Some fields may be invalid.',
    [ErrorCategory.NETWORK]:
      'Unable to connect to the server. Please check your internet connection and try again.',
    [ErrorCategory.DATABASE]:
      'A database error occurred. Please try again or contact support if the problem persists.',
    [ErrorCategory.AUTHENTICATION]:
      'Authentication failed. Please log in again.',
    [ErrorCategory.AUTHORIZATION]:
      "You don't have permission to perform this action.",
    [ErrorCategory.NOT_FOUND]: 'The requested resource was not found.',
    [ErrorCategory.SERVER]:
      'A server error occurred. Our team has been notified. Please try again later.',
    [ErrorCategory.CLIENT]:
      'Something went wrong with your request. Please try again.',
    [ErrorCategory.UNKNOWN]:
      'An unexpected error occurred. Please try again or contact support.',
  };

  let baseMessage = messages[category];

  // Add specific context for certain status codes
  if (statusCode === 429) {
    baseMessage = 'Too many requests. Please wait a moment and try again.';
  }
  if (statusCode === 503) {
    baseMessage =
      'The service is temporarily unavailable. Please try again in a few minutes.';
  }

  return baseMessage;
};

/**
 * Pure function to create structured AppError from any error
 */
export const createAppError = (
  error: any,
  context?: Record<string, any>
): AppError => {
  const statusCode = extractStatusCode(error);
  const category = categorizeError(error, statusCode);
  const severity = determineSeverity(category, statusCode);

  const originalMessage =
    error?.message ||
    error?.data?.message ||
    error?.statusMessage ||
    'Unknown error';

  const userMessage = createUserMessage(category, statusCode, originalMessage);

  return {
    id: generateErrorId(),
    message: originalMessage,
    userMessage,
    category,
    severity,
    statusCode,
    timestamp: new Date(),
    context,
    originalError: error instanceof Error ? error : undefined,
    stack: error?.stack,
  };
};

/**
 * Pure function to format error for logging
 */
const formatErrorForLogging = (appError: AppError): string => {
  const parts = [
    `[${appError.severity.toUpperCase()}]`,
    `[${appError.category}]`,
    appError.statusCode ? `[${appError.statusCode}]` : '',
    appError.message,
  ];

  if (appError.context && Object.keys(appError.context).length > 0) {
    parts.push(`\nContext: ${JSON.stringify(appError.context, null, 2)}`);
  }

  if (appError.stack) {
    parts.push(`\nStack: ${appError.stack}`);
  }

  return parts.filter(Boolean).join(' ');
};

/**
 * Pure function to check if error is retryable
 */
export const isRetryableError = (error: AppError): boolean => {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  const retryableCategories = [ErrorCategory.NETWORK, ErrorCategory.SERVER];

  return (
    (error.statusCode ? retryableStatuses.includes(error.statusCode) : false) ||
    retryableCategories.includes(error.category)
  );
};

/**
 * Main error handler composable
 */
export const useErrorHandler = () => {
  const errors = ref<AppError[]>([]);
  const lastError = ref<AppError | null>(null);

  /**
   * Handle an error with options
   */
  const handleError = (
    error: any,
    options: ErrorHandlerOptions = {},
    context?: Record<string, any>
  ): AppError => {
    const {
      showNotification = true,
      logToConsole = true,
      logToServer = false,
    } = options;

    // Create structured error
    const appError = createAppError(error, context);

    // Store error
    errors.value.push(appError);
    lastError.value = appError;

    // Log to console in development
    if (logToConsole && process.env.NODE_ENV === 'development') {
      const formattedError = formatErrorForLogging(appError);
      console.error(formattedError);
    }

    // Show notification (using Nuxt UI toast or similar)
    if (showNotification && process.client) {
      // This will be implemented with the actual notification system
      showErrorNotification(appError);
    }

    // Log to server for critical errors
    if (
      logToServer &&
      (appError.severity === ErrorSeverity.CRITICAL ||
        appError.severity === ErrorSeverity.ERROR)
    ) {
      logErrorToServer(appError);
    }

    return appError;
  };

  /**
   * Handle async operation with automatic error handling
   */
  const handleAsync = async <T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions = {},
    context?: Record<string, any>
  ): Promise<{ data: T | null; error: AppError | null }> => {
    try {
      const data = await operation();
      return { data, error: null };
    } catch (err) {
      const error = handleError(err, options, context);
      return { data: null, error };
    }
  };

  /**
   * Handle async operation with retry logic
   */
  const handleAsyncWithRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    options: ErrorHandlerOptions = {},
    context?: Record<string, any>
  ): Promise<{ data: T | null; error: AppError | null }> => {
    let lastError: AppError | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await operation();
        return { data, error: null };
      } catch (err) {
        lastError = createAppError(err, {
          ...context,
          attempt: attempt + 1,
          maxRetries,
        });

        // Only retry if it's a retryable error and we have attempts left
        if (attempt < maxRetries && isRetryableError(lastError)) {
          // Exponential backoff
          const delay = delayMs * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // Final attempt failed or non-retryable error
        handleError(err, options, context);
        break;
      }
    }

    return { data: null, error: lastError };
  };

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    errors.value = [];
    lastError.value = null;
  };

  /**
   * Clear specific error by ID
   */
  const clearError = (errorId: string) => {
    errors.value = errors.value.filter((e) => e.id !== errorId);
    if (lastError.value?.id === errorId) {
      lastError.value = errors.value[errors.value.length - 1] || null;
    }
  };

  /**
   * Get errors by category
   */
  const getErrorsByCategory = (category: ErrorCategory): AppError[] => {
    return errors.value.filter((e) => e.category === category);
  };

  /**
   * Get errors by severity
   */
  const getErrorsBySeverity = (severity: ErrorSeverity): AppError[] => {
    return errors.value.filter((e) => e.severity === severity);
  };

  return {
    errors: readonly(errors),
    lastError: readonly(lastError),
    handleError,
    handleAsync,
    handleAsyncWithRetry,
    clearErrors,
    clearError,
    getErrorsByCategory,
    getErrorsBySeverity,
    isRetryableError,
  };
};

/**
 * Show error notification (to be integrated with UI notification system)
 */
const showErrorNotification = (error: AppError) => {
  // This will be implemented based on your notification system
  // For now, we'll use a simple console log
  if (process.client && typeof window !== 'undefined') {
    console.warn(`[User Notification] ${error.userMessage}`);
    // TODO: Integrate with Nuxt UI toast system
    // const toast = useToast();
    // toast.add({
    //   title: error.category === ErrorCategory.VALIDATION ? 'Validation Error' : 'Error',
    //   description: error.userMessage,
    //   color: error.severity === ErrorSeverity.CRITICAL ? 'red' : 'yellow',
    // });
  }
};

/**
 * Log error to server for monitoring
 */
const logErrorToServer = async (error: AppError) => {
  try {
    // Only log in production
    if (process.env.NODE_ENV === 'production') {
      await $fetch('/api/errors/log', {
        method: 'POST',
        body: {
          id: error.id,
          message: error.message,
          category: error.category,
          severity: error.severity,
          statusCode: error.statusCode,
          timestamp: error.timestamp,
          context: error.context,
          stack: error.stack,
          userAgent:
            typeof window !== 'undefined' ? window.navigator.userAgent : '',
          url: typeof window !== 'undefined' ? window.location.href : '',
        },
      });
    }
  } catch (err) {
    // Silently fail - don't want error logging to cause more errors
    console.error('Failed to log error to server:', err);
  }
};

/**
 * Validation error helper - creates a structured validation error
 */
export const createValidationError = (
  fields: Record<string, string>,
  context?: Record<string, any>
): AppError => {
  return createAppError(
    {
      message: 'Validation failed',
      statusCode: 400,
    },
    {
      ...context,
      validationErrors: fields,
    }
  );
};

/**
 * Network error helper
 */
export const createNetworkError = (
  message: string = 'Network request failed',
  context?: Record<string, any>
): AppError => {
  return createAppError(
    {
      message,
      name: 'NetworkError',
    },
    context
  );
};

/**
 * Database error helper
 */
export const createDatabaseError = (
  message: string,
  context?: Record<string, any>
): AppError => {
  return createAppError(
    {
      message: `Database error: ${message}`,
      statusCode: 500,
    },
    context
  );
};
