import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  // Use Nuxt Supabase module's server service role client (bypasses RLS)
  const supabase = serverSupabaseServiceRole(event);

  const query = getQuery(event);
  const token = query.token as string;

  console.log('=== UNSUBSCRIBE API DEBUG START ===');
  console.log('Using serverSupabaseServiceRole for database operations');
  console.log('Received unsubscribe request:', {
    hasToken: !!token,
    queryKeys: Object.keys(query),
    userAgent: getHeader(event, 'user-agent'),
    timestamp: new Date().toISOString(),
  });

  if (!token) {
    console.error('Missing unsubscribe token');
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing unsubscribe token',
    });
  }

  try {
    // Decode email from token
    const email = Buffer.from(token, 'base64').toString('utf-8');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email in token',
      });
    }

    const clientIP =
      getHeaders(event)['x-forwarded-for'] ||
      getHeaders(event)['x-real-ip'] ||
      'unknown';
    const userAgent = getHeader(event, 'user-agent') || '';

    console.log('Processing unsubscribe for email:', email);

    // Add to unsubscribes table
    const { data: unsubscribeData, error: unsubscribeError } = await supabase
      .from('unsubscribes')
      .upsert({
        email,
        ip_address: clientIP,
        user_agent: userAgent,
        reason: 'User initiated unsubscribe',
      });

    if (unsubscribeError) {
      console.error('=== UNSUBSCRIBES TABLE ERROR ===');
      console.error('Error adding to unsubscribes table:', unsubscribeError);
      console.error(
        'Error details:',
        JSON.stringify(unsubscribeError, null, 2)
      );
      console.error('Attempted data:', {
        email,
        ip_address: clientIP,
        user_agent: userAgent,
      });
    } else {
      console.log(
        '✅ Successfully added to unsubscribes table:',
        unsubscribeData
      );
    }

    // Update leads table
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .update({
        email_marketing_consent: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email)
      .select(); // Add select to return updated data for verification

    if (leadsError) {
      console.error('=== LEADS TABLE ERROR ===');
      console.error('Error updating leads table:', leadsError);
      console.error('Error details:', JSON.stringify(leadsError, null, 2));
      console.error('Attempted update for email:', email);
    } else {
      console.log(
        '✅ Successfully updated leads table. Rows affected:',
        leadsData?.length || 0
      );
      console.log('Updated lead data:', leadsData);
    }

    // Final verification
    console.log('=== UNSUBSCRIBE PROCESS COMPLETE ===');
    console.log('Email processed:', email);
    console.log('Unsubscribes table success:', !unsubscribeError);
    console.log('Leads table success:', !leadsError);
    console.log('=== END DEBUG ===');

    // Return success page
    return `
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
  } catch (error) {
    console.error('Unsubscribe error:', error);
    throw createError({
      statusCode: 500,
      statusMessage:
        'An error occurred while processing your unsubscribe request',
    });
  }
});
