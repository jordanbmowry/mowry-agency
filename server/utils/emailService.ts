// Enhanced email service with unsubscribe checking
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
  skipped?: boolean;
  reason?: string;
}

// Check if email address has unsubscribed
export const checkUnsubscribeStatus = async (
  email: string
): Promise<boolean> => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.supabaseUrl, config.supabaseKey);

  try {
    // Check if email exists in leads table with email_marketing_consent = false
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('email_marketing_consent, unsubscribed_at')
      .eq('email', email)
      .single();

    if (leadError && leadError.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      console.error('Error checking lead unsubscribe status:', leadError);
      return false; // Default to allowing email if we can't check
    }

    // If lead exists and has unsubscribed, don't send
    if (leadData && leadData.email_marketing_consent === false) {
      return true; // Email has unsubscribed
    }

    // Also check the unsubscribes table
    const { data: unsubscribeData, error: unsubscribeError } = await supabase
      .from('unsubscribes')
      .select('email')
      .eq('email', email)
      .single();

    if (unsubscribeError && unsubscribeError.code !== 'PGRST116') {
      console.error('Error checking unsubscribe table:', unsubscribeError);
      return false; // Default to allowing email if we can't check
    }

    // If email exists in unsubscribes table, don't send
    return !!unsubscribeData;
  } catch (error) {
    console.error('Error in checkUnsubscribeStatus:', error);
    return false; // Default to allowing email if we can't check
  }
};

// Enhanced send email function with unsubscribe checking
export const sendEmailWithUnsubscribeCheck = async (
  options: EmailOptions
): Promise<EmailResult> => {
  const config = useRuntimeConfig();

  // Check if email configuration is available
  if (!config.smtpUser || !config.smtpPass) {
    return {
      success: false,
      error: 'Email configuration not available',
    };
  }

  // Check unsubscribe status
  const hasUnsubscribed = await checkUnsubscribeStatus(options.to);
  if (hasUnsubscribed) {
    console.log(`Skipping email to ${options.to} - user has unsubscribed`);
    return {
      success: true,
      skipped: true,
      reason: 'User has unsubscribed from marketing emails',
    };
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });

    // Send email
    await transporter.sendMail({
      from: options.from || config.smtpUser,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
};

// Function to send transactional emails (like quote confirmations)
// These are allowed even if user unsubscribed from marketing
export const sendTransactionalEmail = async (
  options: EmailOptions
): Promise<EmailResult> => {
  const config = useRuntimeConfig();

  if (!config.smtpUser || !config.smtpPass) {
    return {
      success: false,
      error: 'Email configuration not available',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });

    await transporter.sendMail({
      from: options.from || config.smtpUser,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending transactional email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
};
