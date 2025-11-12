import { render } from '@vue-email/render';
import nodemailer, { type Transporter } from 'nodemailer';
import type { Database } from '~/types/database.types';
import { createTimestamp } from '~/utils/dateUtils';
import AgencyNotification from '../../emails/AgencyNotification.vue';

// Import Vue Email templates
import CustomerConfirmation from '../../emails/CustomerConfirmation.vue';
import { type AsyncResult, createUnsubscribeLink, safeAsync } from './form-utils';

// Nodemailer types
type SendMailResult = {
  messageId: string;
  accepted?: string[];
  rejected?: string[];
  response?: string;
};

// Lead data type from database
type LeadData = Database['public']['Tables']['leads']['Row'];

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
  data: CustomerEmailData,
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
      },
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
      },
    ),
  ]);

  return { html, text };
};

// Render agency notification email using Vue Email
const renderAgencyNotificationEmail = async (
  data: AgencyEmailData,
): Promise<{ html: string; text: string }> => {
  const [html, text] = await Promise.all([
    render(
      AgencyNotification,
      {
        leadData: data,
      },
      {
        pretty: true,
      },
    ),
    render(
      AgencyNotification,
      {
        leadData: data,
      },
      {
        plainText: true,
      },
    ),
  ]);

  return { html, text };
};

// Send single email (pure function)
const sendSingleEmail = async (
  transporter: Transporter,
  to: string,
  subject: string,
  html: string,
  text: string,
  from: string = 'Mowry Agency <noreply@mowryagency.com>',
): Promise<AsyncResult<SendMailResult>> => {
  return safeAsync(async () => {
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    return result as SendMailResult;
  });
};

// Send customer confirmation email
export const sendCustomerConfirmationEmail = async (
  config: EmailConfig,
  leadData: LeadData,
  agencyInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
    npn: string;
  },
): Promise<AsyncResult<SendMailResult>> => {
  return safeAsync(async () => {
    const transporter = createTransporter(config);
    const unsubscribeLink = createUnsubscribeLink(leadData.email, agencyInfo.website);

    const emailData: CustomerEmailData = {
      firstName: leadData.first_name,
      email: leadData.email,
      coverageType: leadData.coverage_type,
      tcpaText: leadData.tcpa_text ?? undefined,
      emailMarketingConsent: leadData.email_marketing_consent,
      tcpaConsentTimestamp: leadData.tcpa_consent_timestamp ?? undefined,
      agencyEmail: agencyInfo.email,
      agencyPhone: agencyInfo.phone,
      agencyAddress: agencyInfo.address,
      agencyWebsite: agencyInfo.website,
      agencyNpn: agencyInfo.npn,
      unsubscribeLink,
    };

    const { html, text } = await renderCustomerConfirmationEmail(emailData);

    const result = await sendSingleEmail(
      transporter,
      leadData.email,
      'Quote Request Confirmation - Mowry Agency',
      html,
      text,
    );

    if (result.error || !result.data) {
      throw result.error || new Error('Failed to send email');
    }
    return result.data;
  });
};

// Send agency notification email
export const sendAgencyNotificationEmail = async (
  config: EmailConfig,
  leadData: LeadData,
  agencyEmail: string,
): Promise<AsyncResult<SendMailResult>> => {
  return safeAsync(async () => {
    const transporter = createTransporter(config);

    const emailData: AgencyEmailData = {
      first_name: leadData.first_name,
      last_name: leadData.last_name,
      email: leadData.email,
      phone: leadData.phone,
      date_of_birth: leadData.date_of_birth,
      coverage_type: leadData.coverage_type,
      health_conditions: leadData.health_conditions,
      current_medications: leadData.current_medications,
      message: leadData.message ?? undefined,
      city: leadData.city,
      state: leadData.state,
      tcpa_consent: leadData.tcpa_consent,
      tcpa_text: leadData.tcpa_text ?? undefined,
      email_marketing_consent: leadData.email_marketing_consent ?? undefined,
      ip_address: leadData.ip_address ?? undefined,
      user_agent: leadData.user_agent ?? undefined,
      form_version: leadData.form_version ?? undefined,
      lead_type: leadData.lead_type ?? 'web',
      lead_source: leadData.lead_source ?? 'website',
      status: leadData.status ?? 'new',
      submittedAt: createTimestamp(),
    };

    const { html, text } = await renderAgencyNotificationEmail(emailData);

    const result = await sendSingleEmail(
      transporter,
      agencyEmail,
      `New Quote Request from ${leadData.first_name} ${leadData.last_name}`,
      html,
      text,
    );

    if (result.error || !result.data) {
      throw result.error || new Error('Failed to send email');
    }
    return result.data;
  });
};

// Send both emails in parallel
export const sendQuoteEmails = async (
  config: EmailConfig,
  leadData: LeadData,
  agencyInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
    npn: string;
  },
): Promise<{
  customerResult: AsyncResult<SendMailResult>;
  agencyResult: AsyncResult<SendMailResult>;
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
