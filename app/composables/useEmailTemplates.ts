// Email template composable using functional programming principles

// Type definitions (inline to avoid import issues)
interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  coverageType: string;
  healthConditions: string;
  medications: string;
  message: string;
  submittedAt: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
}

// Pure function to generate agency notification email
export const createAgencyEmailTemplate = (data: EmailData): EmailTemplate => {
  const subject = `New Life Insurance Quote Request from ${data.firstName} ${data.lastName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>New Quote Request - Mowry Agency</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
      <div style="background-color: #ffffff; margin: 0 auto; padding: 0; max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="background-color: #1e40af; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">New Life Insurance Quote Request</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1e40af; margin-top: 0;">Customer Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${data.email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${data.phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Date of Birth:</td><td style="padding: 8px;">${data.dateOfBirth}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Coverage Type:</td><td style="padding: 8px;">${data.coverageType}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Health Conditions:</td><td style="padding: 8px;">${data.healthConditions}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Medications:</td><td style="padding: 8px;">${data.medications}</td></tr>
            ${data.message ? `<tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${data.message}</td></tr>` : ''}
            <tr><td style="padding: 8px; font-weight: bold;">Submitted:</td><td style="padding: 8px;">${data.submittedAt}</td></tr>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};

// Pure function to generate customer confirmation email
export const createCustomerEmailTemplate = (data: EmailData): EmailTemplate => {
  const subject = 'Life Insurance Quote Request Confirmation - Mowry Agency';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quote Request Confirmation - Mowry Agency</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
      <div style="background-color: #ffffff; margin: 0 auto; padding: 0; max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="background-color: #1e40af; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Thank You for Your Quote Request!</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1e40af; margin-top: 0;">Hi ${data.firstName},</h2>
          <p>We've received your comprehensive quote request for life insurance and will contact you within 24 hours with personalized coverage options designed to protect your family's future.</p>
          <p>Our team specializes in helping families build lasting legacies through tax-advantaged life insurance strategies, and we'll use the information you provided to find the best rates for your specific situation.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
            <ul>
              <li>We'll review your information and research the best options for you</li>
              <li>Our team will contact you within 24 hours</li>
              <li>We'll provide you with personalized quote options</li>
              <li>No obligation - we're here to help you make the best decision for your family</li>
            </ul>
          </div>
          <p>If you have any immediate questions, please don't hesitate to call us at <strong>(930) 322-1962</strong>.</p>
          <p>Best regards,<br><strong>The Mowry Agency Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};

// Higher-order function for email template creation
export const createEmailTemplates = (data: EmailData) => ({
  agency: createAgencyEmailTemplate(data),
  customer: createCustomerEmailTemplate(data),
});

// Pure function to transform form data to email data
export const transformFormDataToEmailData = (formData: any): EmailData => ({
  firstName: formData.firstName,
  lastName: formData.lastName,
  email: formData.email,
  phone: formData.phone,
  dateOfBirth: formData.dateOfBirth,
  coverageType: formData.coverageType,
  healthConditions: formData.healthConditions || 'Not provided',
  medications: formData.medications || 'Not provided',
  message: formData.message || '',
  submittedAt: new Date().toLocaleString(),
});
