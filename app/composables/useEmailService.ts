// Email service composable using functional programming principles
import nodemailer from 'nodemailer';
import {
  createEmailTemplates,
  transformFormDataToEmailData,
} from './useEmailTemplates';

// Type definitions
interface EmailConfig {
  user: string;
  pass: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

interface EmailSendOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Pure function to create email transporter
const createEmailTransporter = (config: EmailConfig) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

// Pure function to check if email is configured
const isEmailConfigured = (): boolean => {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
};

// Pure function to get email configuration
const getEmailConfig = (): EmailConfig | null => {
  if (!isEmailConfigured()) {
    return null;
  }

  return {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  };
};

// Functional error handling for email sending
const sendEmail = async (
  transporter: any,
  options: EmailSendOptions
): Promise<EmailResult> => {
  try {
    await transporter.sendMail(options);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email sending failed',
    };
  }
};

// Higher-order function to send multiple emails
const sendEmails = async (
  transporter: any,
  emailOptions: EmailSendOptions[]
): Promise<EmailResult[]> => {
  return Promise.all(
    emailOptions.map((options) => sendEmail(transporter, options))
  );
};

// Main email sending function using functional composition
export const sendQuoteEmails = async (
  formData: any
): Promise<{ success: boolean; emailSent: boolean; error?: string }> => {
  // Early return if email not configured
  const emailConfig = getEmailConfig();
  if (!emailConfig) {
    console.log(
      'Email credentials not configured - skipping email notifications'
    );
    return { success: true, emailSent: false };
  }

  try {
    // Transform data and create templates using pure functions
    const emailData = transformFormDataToEmailData(formData);
    const templates = createEmailTemplates(emailData);
    const transporter = createEmailTransporter(emailConfig);

    // Prepare email options
    const emailOptions: EmailSendOptions[] = [
      {
        from: emailConfig.user,
        to: process.env.AGENCY_EMAIL,
        subject: templates.agency.subject,
        html: templates.agency.html,
      },
      {
        from: emailConfig.user,
        to: formData.email,
        subject: templates.customer.subject,
        html: templates.customer.html,
      },
    ];

    // Send emails functionally
    const results = await sendEmails(transporter, emailOptions);

    // Check if all emails sent successfully
    const allSuccessful = results.every((result) => result.success);

    if (!allSuccessful) {
      const failedEmails = results.filter((result) => !result.success);
      const errors = failedEmails.map((result) => result.error).join(', ');

      return {
        success: false,
        emailSent: false,
        error: `Email sending failed: ${errors}`,
      };
    }

    return { success: true, emailSent: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      emailSent: false,
      error: error instanceof Error ? error.message : 'Email sending failed',
    };
  }
};

// Composable for email operations
export const useEmailService = () => {
  return {
    sendQuoteEmails,
    isEmailConfigured,
  };
};
