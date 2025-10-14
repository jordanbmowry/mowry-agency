import nodemailer from 'nodemailer';
import {
  createUnsubscribeLink,
  type AsyncResult,
  safeAsync,
} from './form-utils';

// Email configuration type
type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

// Email template type
type EmailTemplate = {
  to: string;
  subject: string;
  html: string;
  text?: string;
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

// Create customer confirmation email template
const createCustomerConfirmationEmail = (
  leadData: any,
  agencyEmail: string,
  unsubscribeLink: string
): EmailTemplate => ({
  to: leadData.email,
  subject: `Quote Request Confirmation - Mowry Agency`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1f2937;">Thank you for your quote request!</h2>
      
      <p>Hi ${leadData.first_name},</p>
      
      <p>We've received your request for <strong>${leadData.coverage_type}</strong> coverage and will be in touch within 24 hours to discuss your insurance needs.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Your Request Details:</h3>
        <ul style="color: #6b7280;">
          <li><strong>Coverage Type:</strong> ${leadData.coverage_type}</li>
          <li><strong>Contact Phone:</strong> ${leadData.phone}</li>
          <li><strong>Location:</strong> ${leadData.city}, ${leadData.state}</li>
        </ul>
      </div>
      
      <p style="color: #6b7280;">
        <strong>Next Steps:</strong><br>
        One of our licensed agents will review your information and contact you to discuss rates and coverage options that fit your specific needs.
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #9ca3af;">
        <strong>Mowry Agency</strong><br>
        Phone: (930) 322-1962<br>
        Email: ${agencyEmail}<br>
        1284 W Rangeview Cir, Bloomington, IN 47403<br><br>
        
        You're receiving this email because you requested a quote through our website. 
        If you no longer wish to receive emails from us, you can 
        <a href="${unsubscribeLink}" style="color: #6b7280;">unsubscribe here</a>.
      </p>
    </div>
  `,
  text: `
Thank you for your quote request!

Hi ${leadData.first_name},

We've received your request for ${leadData.coverage_type} coverage and will be in touch within 24 hours.

Your Request Details:
- Coverage Type: ${leadData.coverage_type}
- Contact Phone: ${leadData.phone}
- Location: ${leadData.city}, ${leadData.state}

Next Steps:
One of our licensed agents will review your information and contact you to discuss rates and coverage options.

Mowry Agency
Phone: (930) 322-1962
Email: ${agencyEmail}
1284 W Rangeview Cir, Bloomington, IN 47403

To unsubscribe: ${unsubscribeLink}
  `,
});

// Create agency notification email template
const createAgencyNotificationEmail = (
  leadData: any,
  agencyEmail: string
): EmailTemplate => ({
  to: agencyEmail,
  subject: `New Quote Request - ${leadData.first_name} ${leadData.last_name}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1f2937;">New Quote Request Received</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #374151;">Lead Information</h3>
        
        <div style="display: grid; gap: 10px;">
          <div><strong>Name:</strong> ${leadData.first_name} ${leadData.last_name}</div>
          <div><strong>Email:</strong> ${leadData.email}</div>
          <div><strong>Phone:</strong> ${leadData.phone}</div>
          <div><strong>Date of Birth:</strong> ${leadData.date_of_birth}</div>
          <div><strong>Location:</strong> ${leadData.city}, ${leadData.state}</div>
          <div><strong>Coverage Type:</strong> ${leadData.coverage_type}</div>
        </div>
        
        ${
          leadData.health_conditions
            ? `
          <div style="margin-top: 15px;">
            <strong>Health Conditions:</strong><br>
            <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
              ${leadData.health_conditions}
            </div>
          </div>
        `
            : ''
        }
        
        ${
          leadData.medications
            ? `
          <div style="margin-top: 15px;">
            <strong>Medications:</strong><br>
            <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
              ${leadData.medications}
            </div>
          </div>
        `
            : ''
        }
        
        ${
          leadData.message
            ? `
          <div style="margin-top: 15px;">
            <strong>Additional Message:</strong><br>
            <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
              ${leadData.message}
            </div>
          </div>
        `
            : ''
        }
      </div>
      
      <p style="color: #6b7280; margin-top: 20px;">
        <strong>Action Required:</strong> Please contact this lead within 24 hours for best conversion rates.
      </p>
    </div>
  `,
  text: `
New Quote Request Received

Lead Information:
- Name: ${leadData.first_name} ${leadData.last_name}
- Email: ${leadData.email}
- Phone: ${leadData.phone}
- Date of Birth: ${leadData.date_of_birth}
- Location: ${leadData.city}, ${leadData.state}
- Coverage Type: ${leadData.coverage_type}

${leadData.health_conditions ? `Health Conditions: ${leadData.health_conditions}\n` : ''}
${leadData.medications ? `Medications: ${leadData.medications}\n` : ''}
${leadData.message ? `Message: ${leadData.message}\n` : ''}

Action Required: Please contact this lead within 24 hours.
  `,
});

// Send single email
const sendEmail = async (
  transporter: any,
  template: EmailTemplate
): Promise<AsyncResult<any>> => {
  return safeAsync(async () => {
    return await transporter.sendMail(template);
  });
};

// Main email service function
export const sendQuoteEmails = async (
  leadData: any,
  emailConfig: EmailConfig,
  agencyEmail: string,
  baseUrl: string
): Promise<{ customerSent: boolean; agencySent: boolean }> => {
  const transporter = createTransporter(emailConfig);
  const unsubscribeLink = createUnsubscribeLink(leadData.email, baseUrl);

  const customerTemplate = createCustomerConfirmationEmail(
    leadData,
    agencyEmail,
    unsubscribeLink
  );
  const agencyTemplate = createAgencyNotificationEmail(leadData, agencyEmail);

  // Send emails in parallel
  const [customerResult, agencyResult] = await Promise.allSettled([
    sendEmail(transporter, customerTemplate),
    sendEmail(transporter, agencyTemplate),
  ]);

  return {
    customerSent:
      customerResult.status === 'fulfilled' && customerResult.value.success,
    agencySent:
      agencyResult.status === 'fulfilled' && agencyResult.value.success,
  };
};
