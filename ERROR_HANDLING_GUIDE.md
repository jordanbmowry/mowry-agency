# Error Handling System Guide

## Overview

This project uses a centralized, functional error handling system through the `useErrorHandler` composable. This provides consistent error handling, user-friendly messages, automatic categorization, and server-side logging across the entire application.

## Key Principles

1. **DRY (Don't Repeat Yourself)**: Centralized error handling logic
2. **Functional Programming**: Pure functions for error categorization and message generation
3. **User-Friendly**: Automatic conversion of technical errors to user-friendly messages
4. **Debuggable**: Comprehensive context tracking and server-side logging
5. **Graceful**: Handles errors without breaking the user experience

## Core Components

### 1. Error Handler Composable (`~/composables/useErrorHandler.ts`)

The main error handling interface with pure functions and reactive state management.

#### Error Severity Levels

```typescript
export enum ErrorSeverity {
  INFO = 'info', // Informational messages
  WARNING = 'warning', // Non-critical issues
  ERROR = 'error', // Standard errors
  CRITICAL = 'critical', // Critical failures requiring immediate attention
}
```

#### Error Categories

```typescript
export enum ErrorCategory {
  VALIDATION = 'validation', // Form validation errors
  NETWORK = 'network', // Network/connectivity issues
  DATABASE = 'database', // Database operation failures
  AUTHENTICATION = 'authentication', // Auth failures
  AUTHORIZATION = 'authorization', // Permission denied
  NOT_FOUND = 'not_found', // Resource not found (404)
  SERVER = 'server', // Server-side errors (500)
  CLIENT = 'client', // Client-side errors (400)
  UNKNOWN = 'unknown', // Uncategorized errors
}
```

#### AppError Interface

```typescript
interface AppError {
  id: string; // Unique error identifier
  message: string; // Technical error message
  userMessage: string; // User-friendly message
  category: ErrorCategory; // Error classification
  severity: ErrorSeverity; // Severity level
  statusCode?: number; // HTTP status code (if applicable)
  timestamp: Date; // When the error occurred
  context?: Record<string, any>; // Additional debugging context
  originalError?: Error; // Original error object
  stack?: string; // Stack trace
}
```

### 2. Server Error Logger (`~/server/api/errors/log.post.ts`)

Receives and logs client-side errors for debugging and monitoring.

**Current Implementation**: Console logging in development  
**Production Ready**: Integrate with Sentry, DataDog, CloudWatch, or other monitoring services

## Usage Guide

### Basic Error Handling

#### Simple Async Operation

```typescript
const { handleAsync } = useErrorHandler();

const fetchData = async () => {
  const { data, error } = await handleAsync(
    async () => {
      return await $fetch('/api/data');
    },
    {
      showNotification: true, // Show toast notification on error
      logToServer: false, // Don't log to server (not critical)
    },
    {
      operation: 'fetchData', // For debugging
    }
  );

  if (error) {
    // Handle error - user already sees notification
    console.error('Failed to fetch data:', error);
    return;
  }

  // Use data
  console.log('Success:', data);
};
```

#### With Retry Logic

```typescript
const { handleAsyncWithRetry } = useErrorHandler();

const saveData = async () => {
  const { data, error } = await handleAsyncWithRetry(
    async () => {
      return await $fetch('/api/save', {
        method: 'POST',
        body: formData,
      });
    },
    {
      maxRetries: 3, // Retry up to 3 times
      retryDelay: 1000, // 1 second initial delay
      retryDelayMultiplier: 2, // Double delay each retry (exponential backoff)
      showNotification: true,
      logToServer: true, // Log critical save failures
    },
    {
      operation: 'saveFormData',
      formData: { id: formData.id },
    }
  );

  if (error) {
    // All retries failed
    return;
  }

  // Success after retries (if any were needed)
  console.log('Saved:', data);
};
```

### Real-World Examples

#### Quote Form Submission (`~/components/QuoteForm.vue`)

```vue
<script setup lang="ts">
import { useErrorHandler } from '~/composables/useErrorHandler';

const { handleAsync } = useErrorHandler();

const handleSubmit = async () => {
  if (!validateAllFields()) return;

  isSubmitting.value = true;
  error.value = false;

  const { data: response, error: submitError } = await handleAsync(
    async () => {
      return await $fetch('/api/quote', {
        method: 'POST',
        body: formData,
      });
    },
    {
      showNotification: true,
      logToServer: true,
    },
    {
      operation: 'submitQuoteForm',
      formData: {
        email: form.email,
        coverageType: form.coverageType,
      },
    }
  );

  if (submitError) {
    error.value = true;

    // Custom error messages based on error type
    if (submitError.statusCode === 409) {
      errorType.value = 'duplicate_email';
      errorMessage.value = submitError.userMessage;
    } else if (submitError.category === 'database') {
      errorType.value = 'database_error';
      errorMessage.value = submitError.userMessage;
    } else {
      errorType.value = 'general_error';
      errorMessage.value = submitError.userMessage;
    }

    isSubmitting.value = false;
    return;
  }

  // Success - reset form and show confirmation
  resetForm();
  isSubmitting.value = false;
};
</script>
```

#### Admin Lead Detail Page (`~/pages/admin/[id].vue`)

```vue
<script setup lang="ts">
import { useErrorHandler } from '~/composables/useErrorHandler';

const { handleAsync } = useErrorHandler();

// Fetch lead data
onMounted(async () => {
  const { data: leadData, error } = await handleAsync(
    async () => {
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (fetchError) throw fetchError;
      return data;
    },
    {
      showNotification: true,
      logToServer: true,
    },
    {
      operation: 'fetchLead',
      leadId,
    }
  );

  if (error) {
    // Error already shown to user via notification
    pending.value = false;
    return;
  }

  data.value = leadData;
  pending.value = false;
});

// Save notes
const saveNotes = async () => {
  const { data: updatedLead, error } = await handleAsync(
    async () => {
      const { data, error: updateError } = await supabase
        .from('leads')
        .update({ notes: notes.value })
        .eq('id', leadId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    },
    {
      showNotification: true,
      logToServer: true,
    },
    {
      operation: 'saveNotes',
      leadId,
      notesLength: notes.value?.length || 0,
    }
  );

  if (error) {
    return;
  }

  // Success - update local data
  data.value = updatedLead;
};

// Delete lead
const deleteLead = async () => {
  const { error } = await handleAsync(
    async () => {
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (deleteError) throw deleteError;
    },
    {
      showNotification: true,
      logToServer: true,
    },
    {
      operation: 'deleteLead',
      leadId,
      email: data.value?.email,
    }
  );

  if (error) {
    isDeleting.value = false;
    return;
  }

  // Success - redirect to admin index
  await navigateTo('/admin');
};
</script>
```

### Helper Functions

#### Create Specific Error Types

```typescript
import {
  createValidationError,
  createNetworkError,
  createDatabaseError,
  createAuthError,
  createNotFoundError,
} from '~/composables/useErrorHandler';

// Validation error
const validationError = createValidationError('Email is required', {
  field: 'email',
  value: '',
});

// Network error
const networkError = createNetworkError('Failed to connect to server', {
  url: '/api/data',
  method: 'GET',
});

// Database error
const dbError = createDatabaseError('Duplicate email constraint violation', {
  table: 'leads',
  constraint: 'unique_email',
});

// Auth error
const authError = createAuthError('Invalid credentials', {
  email: 'user@example.com',
});

// Not found error
const notFoundError = createNotFoundError('Lead not found', { leadId: '123' });
```

#### Access Error History

```typescript
const {
  errors, // All errors
  lastError, // Most recent error
  getErrorsByCategory, // Filter by category
  getErrorsBySeverity, // Filter by severity
  clearErrors, // Clear all errors
} = useErrorHandler();

// Get all validation errors
const validationErrors = getErrorsByCategory(ErrorCategory.VALIDATION);

// Get all critical errors
const criticalErrors = getErrorsBySeverity(ErrorSeverity.CRITICAL);

// Clear error history
clearErrors();
```

## Error Message Generation

The system automatically generates user-friendly messages based on error category and status code:

### Validation Errors

- **User Message**: "Please check your input and try again."
- **When**: Form validation failures, invalid data

### Network Errors

- **User Message**: "Network connection issue. Please check your internet and try again."
- **When**: Fetch failures, timeout errors, connection issues

### Database Errors

- **User Message**: "We're experiencing technical difficulties. Please try again later."
- **When**: Database operations fail, constraint violations

### Authentication Errors

- **User Message**: "Please sign in to continue."
- **When**: Unauthorized access, expired sessions

### Authorization Errors

- **User Message**: "You don't have permission to perform this action."
- **When**: Insufficient permissions

### Not Found Errors (404)

- **User Message**: "The requested resource was not found."
- **When**: Resource doesn't exist

### Server Errors (500)

- **User Message**: "Server error occurred. We've been notified and are working on it."
- **When**: Internal server errors

### Client Errors (400)

- **User Message**: "Invalid request. Please try again."
- **When**: Bad request format

## Server-Side Integration

### Error Logging Endpoint

```typescript
// server/api/errors/log.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate required fields
  if (!body.message || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: message and category',
    });
  }

  // Log to console (development)
  console.error('Client Error:', {
    id: body.id,
    message: body.message,
    userMessage: body.userMessage,
    category: body.category,
    severity: body.severity,
    statusCode: body.statusCode,
    timestamp: body.timestamp,
    context: body.context,
  });

  // TODO: In production, integrate with:
  // - Sentry: for error tracking and alerting
  // - DataDog: for APM and monitoring
  // - CloudWatch: for AWS-based apps
  // - Custom logging service

  return { success: true };
});
```

### Structured API Error Responses

API endpoints should return consistent error structures:

```typescript
// server/api/quote.post.ts
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validation
    const errors = validateQuoteRequest(body);
    if (errors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: {
          category: 'validation',
          errors,
        },
      });
    }

    // Database operation
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database operation failed',
        data: {
          category: 'database',
          message: error.message,
        },
      });
    }

    return { success: true, data };
  } catch (error: any) {
    // Re-throw structured errors
    if (error.statusCode) throw error;

    // Handle unexpected errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Unexpected error occurred',
      data: {
        category: 'server',
        message: error.message,
      },
    });
  }
});
```

## Best Practices

### 1. Always Provide Context

```typescript
// ✅ GOOD: Helpful debugging context
const { data, error } = await handleAsync(
  operation,
  { showNotification: true, logToServer: true },
  {
    operation: 'deleteUser',
    userId: user.id,
    userEmail: user.email,
    triggeredBy: currentUser.id,
  }
);

// ❌ BAD: No context
const { data, error } = await handleAsync(operation);
```

### 2. Use Appropriate Error Categories

```typescript
// ✅ GOOD: Specific error category
const validationError = createValidationError('Invalid email format', {
  field: 'email',
  value: userInput,
});

// ❌ BAD: Generic unknown category
const error = createAppError(new Error('Invalid email'));
```

### 3. Log Critical Errors to Server

```typescript
// ✅ GOOD: Log payment failures
await handleAsync(
  processPayment,
  { showNotification: true, logToServer: true }, // Log to server
  { operation: 'processPayment', amount, userId }
);

// ✅ GOOD: Don't log minor UI interactions
await handleAsync(
  loadUserPreferences,
  { showNotification: false, logToServer: false }, // No server logging
  { operation: 'loadPreferences' }
);
```

### 4. Handle Errors Gracefully

```typescript
// ✅ GOOD: Graceful degradation
const { data, error } = await handleAsync(loadOptionalData);
if (error) {
  // Show fallback UI or cached data
  data.value = getCachedData();
} else {
  data.value = data;
}

// ❌ BAD: Let errors break the UI
const response = await $fetch('/api/data'); // May throw and break component
```

### 5. Provide Actionable Error Messages

```typescript
// ✅ GOOD: Tell user what to do
if (submitError) {
  if (submitError.category === 'network') {
    errorMessage.value =
      'Connection lost. Please check your internet and try again.';
  } else if (submitError.statusCode === 409) {
    errorMessage.value =
      'This email is already registered. Try signing in instead.';
  }
}

// ❌ BAD: Vague or technical message
errorMessage.value = 'Error occurred'; // Not helpful
errorMessage.value = error.stack; // Too technical
```

## Migration Guide

### Replacing Try-Catch Blocks

#### Before (Without Error Handler)

```typescript
const submitForm = async () => {
  try {
    const response = await $fetch('/api/submit', {
      method: 'POST',
      body: formData,
    });

    // Success handling
    resetForm();
  } catch (err: any) {
    // Generic error handling
    console.error('Error:', err);
    errorMessage.value = 'Something went wrong';
  }
};
```

#### After (With Error Handler)

```typescript
const { handleAsync } = useErrorHandler();

const submitForm = async () => {
  const { data, error } = await handleAsync(
    async () => {
      return await $fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });
    },
    {
      showNotification: true,
      logToServer: true,
    },
    {
      operation: 'submitForm',
      formData: { id: formData.id },
    }
  );

  if (error) {
    // Error already categorized and user-friendly message shown
    return;
  }

  // Success handling
  resetForm();
};
```

## Testing Error Handling

### Unit Tests

```typescript
// test/composables/useErrorHandler.test.ts
import { describe, it, expect } from 'vitest';
import { useErrorHandler } from '~/composables/useErrorHandler';

describe('useErrorHandler', () => {
  it('categorizes network errors correctly', async () => {
    const { handleAsync } = useErrorHandler();

    const { error } = await handleAsync(async () => {
      throw new Error('Failed to fetch');
    });

    expect(error?.category).toBe('network');
    expect(error?.severity).toBe('error');
  });

  it('retries failed operations', async () => {
    const { handleAsyncWithRetry } = useErrorHandler();
    let attempts = 0;

    const { data } = await handleAsyncWithRetry(
      async () => {
        attempts++;
        if (attempts < 3) throw new Error('Temporary failure');
        return 'success';
      },
      { maxRetries: 3 }
    );

    expect(attempts).toBe(3);
    expect(data).toBe('success');
  });
});
```

## Future Enhancements

1. **Notification Integration**: Connect with Nuxt UI toast notifications
2. **Error Boundary Component**: Catch unhandled component errors
3. **Production Logging**: Integrate with Sentry, DataDog, or CloudWatch
4. **Error Recovery**: Automatic retry strategies for specific error types
5. **Error Analytics**: Track error rates and patterns
6. **Custom Error Pages**: User-friendly error pages for different error types

## Troubleshooting

### Error Handler Not Found

If you see "Cannot find name 'useErrorHandler'", ensure:

1. File is in `~/composables/useErrorHandler.ts`
2. Export statement: `export const useErrorHandler = () => { ... }`
3. Import explicitly if auto-import fails: `import { useErrorHandler } from '~/composables/useErrorHandler';`

### Errors Not Logged to Server

Verify:

1. `logToServer: true` is set in options
2. Error severity is `CRITICAL` or `ERROR`
3. Server endpoint `/api/errors/log` is accessible
4. Network tab shows POST request to `/api/errors/log`

### User Messages Not Showing

Check:

1. `showNotification: true` is set in options
2. Notification system is implemented (currently placeholder)
3. Error has a `userMessage` property

## Summary

The error handling system provides:

- ✅ **Centralized** error handling across the entire application
- ✅ **User-friendly** messages automatically generated
- ✅ **Comprehensive** context tracking for debugging
- ✅ **Functional** approach with pure functions
- ✅ **Graceful** degradation without breaking user experience
- ✅ **Server-side** logging for critical errors
- ✅ **Retry logic** with exponential backoff
- ✅ **Type-safe** with full TypeScript support

Use this system consistently throughout the application for a better developer experience and more reliable error handling.
