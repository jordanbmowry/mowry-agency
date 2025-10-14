import nodemailer from 'nodemailer';
import { render } from '@vue-email/render';
import {
  createUnsubscribeLink,
  type AsyncResult,
  safeAsync,
} from './form-utils';

// Import Vue Email templates
import CustomerConfirmation from '../../emails/CustomerConfirmation.vue';
import AgencyNotification from '../../emails/AgencyNotification.vue';

// Email configuration type
type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

// Email data types
type CustomerEmailData = {
  firstName: string;
  email: string;
  coverageType: string;
  agencyEmail: string;
  unsubscribeLink: string;
};

type AgencyEmailData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverageType: string;
  desiredCoverage: string;
  timeFrame: string;
  age: string;
  healthConditions: string;
  budgetRange: string;
  currentCoverage: string;
  additionalInfo?: string;
  preferredContact: string;
  tcpaConsent: boolean;
  submittedAt: string;
};

// Create email transporter (pure function)
const createTransporter = (config: EmailConfig) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

// Render customer confirmation email using Vue Email
const renderCustomerConfirmationEmail = async (
  data: CustomerEmailData
): Promise<{ html: string; text: string }> => {
  const [html, text] = await Promise.all([
    render(
      CustomerConfirmation,
      {
        customerData: {
          firstName: data.firstName,
          email: data.email,
          coverageType: data.coverageType,
        },
        agencyEmail: data.agencyEmail,
        unsubscribeLink: data.unsubscribeLink,
      },
      {
        pretty: true,
      }
    ),
    render(
      CustomerConfirmation,
      {
        customerData: {
          firstName: data.firstName,
          email: data.email,
          coverageType: data.coverageType,
        },
        agencyEmail: data.agencyEmail,
        unsubscribeLink: data.unsubscribeLink,
      },
      {
        plainText: true,
      }
    ),
  ]);

  return { html, text };
};

// Render agency notification email using Vue Email
const renderAgencyNotificationEmail = async (
  data: AgencyEmailData
): Promise<{ html: string; text: string }> => {
  const [html, text] = await Promise.all([
    render(
      AgencyNotification,
      {
        leadData: data,
      },
      {
        pretty: true,
      }
    ),
    render(
      AgencyNotification,
      {
        leadData: data,
      },
      {
        plainText: true,
      }
    ),
  ]);

  return { html, text };
};

// Send single email (pure function)
const sendSingleEmail = async (
  transporter: any,
  to: string,
  subject: string,
  html: string,
  text: string,
  from: string = 'Mowry Agency <noreply@mowryagency.com>'
): Promise<AsyncResult<any>> => {
  return safeAsync(async () => {
    return await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
  });
};

// Send customer confirmation email
export const sendCustomerConfirmationEmail = async (
  config: EmailConfig,
  leadData: any
): Promise<AsyncResult<any>> => {
  return safeAsync(async () => {
    const transporter = createTransporter(config);
    const unsubscribeLink = createUnsubscribeLink(
      leadData.email,
      'https://mowryagency.com'
    );

    const emailData: CustomerEmailData = {
      firstName: leadData.first_name,
      email: leadData.email,
      coverageType: leadData.coverage_type,
      agencyEmail: config.user,
      unsubscribeLink,
    };

    const { html, text } = await renderCustomerConfirmationEmail(emailData);

    return await sendSingleEmail(
      transporter,
      leadData.email,
      'Quote Request Confirmation - Mowry Agency',
      html,
      text
    );
  });
};

// Send agency notification email
export const sendAgencyNotificationEmail = async (
  config: EmailConfig,
  leadData: any,
  agencyEmail: string
): Promise<AsyncResult<any>> => {
  return safeAsync(async () => {
    const transporter = createTransporter(config);

    const emailData: AgencyEmailData = {
      firstName: leadData.first_name,
      lastName: leadData.last_name,
      email: leadData.email,
      phone: leadData.phone,
      coverageType: leadData.coverage_type,
      desiredCoverage: leadData.desired_coverage,
      timeFrame: leadData.time_frame,
      age: leadData.age,
      healthConditions: leadData.health_conditions,
      budgetRange: leadData.budget_range,
      currentCoverage: leadData.current_coverage,
      additionalInfo: leadData.additional_info,
      preferredContact: leadData.preferred_contact,
      tcpaConsent: leadData.tcpa_consent,
      submittedAt: new Date(leadData.created_at).toLocaleString(),
    };

    const { html, text } = await renderAgencyNotificationEmail(emailData);

    return await sendSingleEmail(
      transporter,
      agencyEmail,
      `🚨 New Quote Request from ${leadData.first_name} ${leadData.last_name}`,
      html,
      text
    );
  });
};

// Send both emails in parallel
export const sendQuoteEmails = async (
  config: EmailConfig,
  leadData: any,
  agencyEmail: string
): Promise<{
  customerResult: AsyncResult<any>;
  agencyResult: AsyncResult<any>;
}> => {
  const [customerResult, agencyResult] = await Promise.allSettled([
    sendCustomerConfirmationEmail(config, leadData),
    sendAgencyNotificationEmail(config, leadData, agencyEmail),
  ]);

  return {
    customerResult:
      customerResult.status === 'fulfilled'
        ? customerResult.value
        : { success: false, error: customerResult.reason },
    agencyResult:
      agencyResult.status === 'fulfilled'
        ? agencyResult.value
        : { success: false, error: agencyResult.reason },
  };
};
