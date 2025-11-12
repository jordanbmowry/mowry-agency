import type { SupabaseClient } from '@supabase/supabase-js';
import type { H3Event } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~/types/database.types';
import { createTimestamp } from '~/utils/dateUtils';

interface ClientInfo {
  ip: string;
  userAgent: string;
}

// Pure function to decode unsubscribe token
const decodeUnsubscribeToken = (token: string): string => {
  return Buffer.from(token, 'base64').toString('utf-8');
};

// Pure function to validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Pure function to extract client information
const getClientInfo = (event: H3Event): ClientInfo => ({
  ip: getHeaders(event)['x-forwarded-for'] || getHeaders(event)['x-real-ip'] || 'unknown',
  userAgent: getHeader(event, 'user-agent') || '',
});

// Database operations
const createUnsubscribeRecord = async (
  supabase: SupabaseClient<Database>,
  email: string,
  clientInfo: ClientInfo,
) => {
  return await supabase.from('unsubscribes').upsert({
    email,
    ip_address: clientInfo.ip,
    user_agent: clientInfo.userAgent,
    reason: 'User initiated unsubscribe',
  });
};

const updateLeadMarketingConsent = async (supabase: SupabaseClient<Database>, email: string) => {
  return await supabase
    .from('leads')
    .update({
      email_marketing_consent: false,
      unsubscribed_at: createTimestamp(),
    })
    .eq('email', email)
    .select();
};

// Success page template
const createSuccessPage = (email: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed - Mowry Agency</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
      color: #374151;
    }
    .container {
      text-align: center;
      padding: 40px 20px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #f9fafb;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      color: #1f2937;
      margin-bottom: 20px;
    }
    .contact-info {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-icon">✅</div>
    <h1>Successfully Unsubscribed</h1>
    <p>You have been successfully unsubscribed from marketing emails from Mowry Agency.</p>
    <p>You will no longer receive promotional emails at <strong>${email}</strong>.</p>
    <p>Please note that you may still receive important transactional emails related to any existing policies or ongoing quote requests.</p>
    
    <div class="contact-info">
      <p>If you have any questions, please contact us:</p>
      <p><strong>Mowry Agency</strong><br>
      Phone: (930) 322-1962<br>
      Email: mowryagency@gmail.com<br>
      1284 W Rangeview Cir, Bloomington, IN 47403</p>
    </div>
  </div>
</body>
</html>
`;

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing unsubscribe token',
    });
  }

  try {
    const email = decodeUnsubscribeToken(token);

    if (!validateEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email in token',
      });
    }

    const clientInfo = getClientInfo(event);

    // Execute database operations in parallel
    const [unsubscribeResult, leadsResult] = await Promise.allSettled([
      createUnsubscribeRecord(supabase, email, clientInfo),
      updateLeadMarketingConsent(supabase, email),
    ]);

    // Log any errors but don't fail the request
    if (unsubscribeResult.status === 'rejected') {
      // Failed to create unsubscribe record - could log to error tracking service
    }

    if (leadsResult.status === 'rejected') {
      // Failed to update leads table - could log to error tracking service
    }

    return createSuccessPage(email);
  } catch (_error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while processing your unsubscribe request',
    });
  }
});
