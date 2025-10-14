// Improved quote API with better validation and organization
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import {
  validateFormData,
  isFormValid,
  getValidationErrors,
} from '../../app/utils/validation';

// Type definitions
interface ApiResponse {
  success: boolean;
  message: string;
  leadId?: string;
  emailSent?: boolean;
}

// Pure function to create error response
const createErrorResponse = (statusCode: number, message: string) => {
  throw createError({
    statusCode,
    statusMessage: message,
  });
};

// Pure function to create success response
const createSuccessResponse = (
  leadId: string,
  emailSent: boolean
): ApiResponse => ({
  success: true,
  message: 'Quote request submitted successfully',
  leadId,
  emailSent,
});

// Pure function to transform form data to lead data
const transformToLeadData = (formData: any) => ({
  first_name: formData.firstName,
  last_name: formData.lastName,
  email: formData.email,
  phone: formData.phone,
  date_of_birth: formData.dateOfBirth,
  city: formData.city,
  state: formData.state,
  coverage_type: formData.coverageType,
  health_conditions: formData.healthConditions || '',
  current_medications: formData.medications || '',
  message: formData.message || '',
  tcpa_consent: formData.tcpaConsent,
  tcpa_consent_timestamp: new Date().toISOString(),
  lead_type: 'insurance_quote',
  lead_source: 'quote_form',
  status: 'new',
});

// Pure email template functions
function createAgencyEmailTemplate(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><title>New Quote Request - Mowry Agency</title></head>
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
}

function createCustomerEmailTemplate(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><title>Quote Request Confirmation - Mowry Agency</title></head>
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
          <p>If you have any immediate questions, please don't hesitate to call us at <strong>${process.env.AGENCY_PHONE}</strong>.</p>
          <p>Best regards,<br><strong>The Mowry Agency Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Main handler using improved validation and organization
export default defineEventHandler(async (event) => {
  try {
    // Parse request body
    const formData = await readBody(event);

    // Use functional validation instead of manual checks
    const validationResults = validateFormData(formData);

    if (!isFormValid(validationResults)) {
      const errors = getValidationErrors(validationResults);
      const errorMessage = Object.values(errors).join(', ');
      return createErrorResponse(400, `Validation failed: ${errorMessage}`);
    }

    // Transform and save lead data using pure function
    const leadData = transformToLeadData(formData);

    // Save to Supabase
    const config = useRuntimeConfig();
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

    const { data: savedLead, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Email logic (simplified but still functional)
    let emailSent = false;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Create email data using pure function
        const emailData = {
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
        };

        // Email templates (extracted for reusability)
        const agencyEmailHtml = createAgencyEmailTemplate(emailData);
        const customerEmailHtml = createCustomerEmailTemplate(emailData);

        // Send emails using Promise.all for better performance
        await Promise.all([
          transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.AGENCY_EMAIL,
            subject: `New Life Insurance Quote Request from ${formData.firstName} ${formData.lastName}`,
            html: agencyEmailHtml,
          }),
          transporter.sendMail({
            from: process.env.SMTP_USER,
            to: formData.email,
            subject: 'Life Insurance Quote Request Confirmation - Mowry Agency',
            html: customerEmailHtml,
          }),
        ]);

        emailSent = true;
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue without email - don't fail the entire request
      }
    }

    // Return success response using pure function
    return createSuccessResponse(savedLead[0]?.id, emailSent);
  } catch (error: any) {
    console.error('Quote request error:', error);

    // Return appropriate error response
    if (error.statusCode) {
      throw error;
    }

    return createErrorResponse(500, 'Failed to process quote request');
  }
});
