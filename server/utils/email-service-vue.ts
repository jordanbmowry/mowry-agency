import nodemailer from 'nodemailer';
import { render } from '@vue-email/render';
import {
  createUnsubscribeLink,
  type AsyncResult,
  safeAsync,
} from './form-utils';
import { createTimestamp } from '~/utils/dateUtils';

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
  tcpaText?: string;
  emailMarketingConsent?: boolean;
  tcpaConsentTimestamp?: string;
  agencyEmail: string;
  agencyPhone: string;
  agencyAddress: string;
  agencyWebsite: string;
  agencyNpn: string;
  unsubscribeLink: string;
};

type AgencyEmailData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  coverage_type: string;
  health_conditions: string;
  current_medications: string;
  message?: string;
  city: string;
  state: string;
  tcpa_consent: boolean;
  tcpa_text?: string;
  email_marketing_consent?: boolean;
  ip_address?: string;
  user_agent?: string;
  form_version?: string;
  lead_type: string;
  lead_source: string;
  status: string;
  submittedAt?: string;
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
          tcpaText: data.tcpaText,
          emailMarketingConsent: data.emailMarketingConsent,
          tcpaConsentTimestamp: data.tcpaConsentTimestamp,
        },
        agencyEmail: data.agencyEmail,
        agencyPhone: data.agencyPhone,
        agencyAddress: data.agencyAddress,
        agencyWebsite: data.agencyWebsite,
        agencyNpn: data.agencyNpn,
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
          tcpaText: data.tcpaText,
          emailMarketingConsent: data.emailMarketingConsent,
          tcpaConsentTimestamp: data.tcpaConsentTimestamp,
        },
        agencyEmail: data.agencyEmail,
        agencyPhone: data.agencyPhone,
        agencyAddress: data.agencyAddress,
        agencyWebsite: data.agencyWebsite,
        agencyNpn: data.agencyNpn,
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
  leadData: any,
  agencyInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
    npn: string;
  }
): Promise<AsyncResult<any>> => {
  return safeAsync(async () => {
    const transporter = createTransporter(config);
    const unsubscribeLink = createUnsubscribeLink(
      leadData.email,
      agencyInfo.website
    );

    const emailData: CustomerEmailData = {
      firstName: leadData.first_name,
      email: leadData.email,
      coverageType: leadData.coverage_type,
      tcpaText: leadData.tcpa_text,
      emailMarketingConsent: leadData.email_marketing_consent,
      tcpaConsentTimestamp: leadData.tcpa_consent_timestamp,
      agencyEmail: agencyInfo.email,
      agencyPhone: agencyInfo.phone,
      agencyAddress: agencyInfo.address,
      agencyWebsite: agencyInfo.website,
      agencyNpn: agencyInfo.npn,
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
      ...leadData, // Spread the lead data which already has the correct structure
      submittedAt: createTimestamp(),
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
  agencyInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
    npn: string;
  }
): Promise<{
  customerResult: AsyncResult<any>;
  agencyResult: AsyncResult<any>;
}> => {
  const [customerResult, agencyResult] = await Promise.allSettled([
    sendCustomerConfirmationEmail(config, leadData, agencyInfo),
    sendAgencyNotificationEmail(config, leadData, agencyInfo.email),
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
