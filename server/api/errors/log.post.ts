/**
 * Error Logging API Endpoint
 * Logs client-side errors for monitoring and debugging
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.id || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: id and message',
      });
    }

    // Log error to console (in production, this could go to a logging service)
    console.error('[Client Error]', {
      id: body.id,
      message: body.message,
      category: body.category,
      severity: body.severity,
      statusCode: body.statusCode,
      timestamp: body.timestamp,
      context: body.context,
      userAgent: body.userAgent,
      url: body.url,
      stack: body.stack,
    });

    // In production, you could send this to:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - CloudWatch
    // - Your own logging service

    // Example: Send to external logging service
    // if (process.env.NODE_ENV === 'production') {
    //   await $fetch(process.env.LOGGING_SERVICE_URL, {
    //     method: 'POST',
    //     body: {
    //       ...body,
    //       environment: process.env.NODE_ENV,
    //       serverTimestamp: new Date().toISOString(),
    //     },
    //   });
    // }

    return {
      success: true,
      message: 'Error logged successfully',
    };
  } catch (error) {
    console.error('Error logging failed:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to log error',
    });
  }
});
