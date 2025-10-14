export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Create a safe configuration report (without exposing sensitive data)
  const configReport = {
    timestamp: new Date().toISOString(),
    environment: {
      // Check if variables are set (without exposing values)
      supabaseUrl: {
        isSet: !!config.supabaseUrl,
        preview: config.supabaseUrl
          ? config.supabaseUrl.substring(0, 30) + '...'
          : 'NOT SET',
        length: config.supabaseUrl?.length || 0,
      },
      supabaseKey: {
        isSet: !!config.supabaseKey,
        preview: config.supabaseKey
          ? config.supabaseKey.substring(0, 20) + '...'
          : 'NOT SET',
        length: config.supabaseKey?.length || 0,
      },
      supabaseServiceKey: {
        isSet: !!config.supabaseServiceKey,
        preview: config.supabaseServiceKey
          ? config.supabaseServiceKey.substring(0, 20) + '...'
          : 'NOT SET',
        length: config.supabaseServiceKey?.length || 0,
      },
      agencyEmail: config.agencyEmail || 'NOT SET',
      agencyPhone: config.agencyPhone || 'NOT SET',
      publicConfig: {
        siteUrl: config.public.siteUrl,
        agencyEmail: config.public.agencyEmail,
        agencyPhone: config.public.agencyPhone,
      },
    },
    deployment: {
      userAgent: getHeader(event, 'user-agent'),
      host: getHeader(event, 'host'),
      forwardedFor: getHeader(event, 'x-forwarded-for'),
      netlifyId: getHeader(event, 'x-nf-request-id'),
    },
  };

  // Test Supabase connection if credentials are available
  let connectionTest = null;
  if (config.supabaseUrl && (config.supabaseKey || config.supabaseServiceKey)) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      // Use service key if available, otherwise fall back to regular key
      const keyToUse = config.supabaseServiceKey || config.supabaseKey;
      const supabase = createClient(config.supabaseUrl, keyToUse);

      // Simple connection test
      const { data, error } = await supabase
        .from('leads')
        .select('id')
        .limit(1);

      connectionTest = {
        success: !error,
        error: error?.message || null,
        hasData: !!data,
        recordCount: data?.length || 0,
      };
    } catch (err) {
      connectionTest = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        hasData: false,
        recordCount: 0,
      };
    }
  }

  return {
    status: 'Environment check complete',
    config: configReport,
    supabaseConnection: connectionTest,
    recommendations: {
      environmentIssues:
        !config.supabaseUrl || !config.supabaseKey
          ? ['Missing Supabase configuration in deployment environment']
          : [],
      connectionIssues:
        connectionTest?.success === false
          ? ['Supabase connection failed - check credentials']
          : [],
    },
  };
});
