import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import nodemailer from 'nodemailer';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransporter: vi.fn(),
    createTransport: vi.fn(),
  },
}));

// Mock supabase operations
const mockCreateLead = vi.fn();
vi.mock('../../lib/supabase', () => ({
  supabaseOperations: {
    createLead: mockCreateLead,
  },
}));

// Import the handler function after mocks are set up
import handler from '../../server/api/quote.post';

describe('Quote API Backend Tests', () => {
  let mockTransporter: any;
  let sendMailSpy: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Set up email mock
    sendMailSpy = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });
    mockTransporter = {
      sendMail: sendMailSpy,
    };
    vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter);

    // Set up database mock
    mockCreateLead.mockResolvedValue({
      id: 'test-lead-id-123',
      created_at: new Date().toISOString(),
    });

    // Mock environment variables
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'test-password';
    process.env.AGENCY_EMAIL = 'agency@test.com';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Mock createError function
  const createError = (options: {
    statusCode: number;
    statusMessage: string;
  }) => {
    const error = new Error(options.statusMessage) as any;
    error.statusCode = options.statusCode;
    error.statusMessage = options.statusMessage;
    return error;
  };

  // Mock readBody function
  const createMockEvent = (body: any) => ({
    node: {
      req: {},
      res: {},
    },
  });

  const readBody = vi.fn();

  // Mock the Nuxt event handler functions
  vi.stubGlobal('defineEventHandler', (handler: any) => handler);
  vi.stubGlobal('readBody', readBody);
  vi.stubGlobal('createError', createError);

  describe('Request Validation', () => {
    it('should reject requests missing required fields', async () => {
      const incompleteData = {
        firstName: 'John',
        lastName: 'Doe',
        // Missing email, phone, dateOfBirth, coverageType
      };

      readBody.mockResolvedValue(incompleteData);
      const mockEvent = createMockEvent(incompleteData);

      try {
        await handler(mockEvent);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
        expect(error.statusMessage).toContain('Missing required fields');
      }
    });

    it('should reject invalid email format', async () => {
      const invalidEmailData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '555-1234',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
      };

      readBody.mockResolvedValue(invalidEmailData);
      const mockEvent = createMockEvent(invalidEmailData);

      try {
        await handler(mockEvent);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
        expect(error.statusMessage).toBe('Invalid email format');
      }
    });

    it('should accept valid quote request data', async () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
        healthConditions: 'Good health',
        medications: 'None',
        message: 'Looking for coverage',
      };

      readBody.mockResolvedValue(validData);
      const mockEvent = createMockEvent(validData);

      const result = await handler(mockEvent);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Quote request submitted successfully');
      expect(result.leadId).toBe('test-lead-id-123');
    });
  });

  describe('Database Integration', () => {
    it('should save lead data to database with correct field mapping', async () => {
      const quoteData = {
        firstName: 'Database',
        lastName: 'Test',
        email: 'database@test.com',
        phone: '555-DB-TEST',
        dateOfBirth: '1980-05-15',
        coverageType: 'whole-life',
        healthConditions: 'Type 2 diabetes',
        medications: 'Metformin',
        message: 'Need life insurance',
      };

      readBody.mockResolvedValue(quoteData);
      const mockEvent = createMockEvent(quoteData);

      await handler(mockEvent);

      expect(mockCreateLead).toHaveBeenCalledWith({
        first_name: 'Database',
        last_name: 'Test',
        name: 'Database Test',
        email: 'database@test.com',
        phone: '555-DB-TEST',
        date_of_birth: '1980-05-15',
        coverage_type: 'whole-life',
        health_conditions: 'Type 2 diabetes',
        current_medications: 'Metformin',
        message: 'Need life insurance',
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
      });
    });

    it('should handle database errors gracefully', async () => {
      mockCreateLead.mockRejectedValue(new Error('Database connection failed'));

      const validData = {
        firstName: 'Error',
        lastName: 'Test',
        email: 'error@test.com',
        phone: '555-ERROR-01',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
      };

      readBody.mockResolvedValue(validData);
      const mockEvent = createMockEvent(validData);

      try {
        await handler(mockEvent);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.statusCode).toBe(500);
        expect(error.statusMessage).toBe('Failed to process quote request');
      }
    });
  });

  describe('Email Functionality', () => {
    it('should send agency notification email with all details', async () => {
      const detailedData = {
        firstName: 'Email',
        lastName: 'Test',
        email: 'email@test.com',
        phone: '555-EMAIL-01',
        dateOfBirth: '1985-01-01',
        coverageType: 'iul',
        healthConditions: 'High cholesterol',
        medications: 'Lipitor 20mg daily',
        message: 'Interested in IUL policy',
      };

      readBody.mockResolvedValue(detailedData);
      const mockEvent = createMockEvent(detailedData);

      await handler(mockEvent);

      // Should send 2 emails
      expect(sendMailSpy).toHaveBeenCalledTimes(2);

      // Check agency email (first call)
      const agencyEmail = sendMailSpy.mock.calls[0][0];
      expect(agencyEmail.to).toBe('agency@test.com');
      expect(agencyEmail.subject).toContain(
        'New Life Insurance Quote Request from Email Test'
      );
      expect(agencyEmail.html).toContain('Email Test');
      expect(agencyEmail.html).toContain('email@test.com');
      expect(agencyEmail.html).toContain('555-EMAIL-01');
      expect(agencyEmail.html).toContain('1985-01-01');
      expect(agencyEmail.html).toContain('iul');
      expect(agencyEmail.html).toContain('High cholesterol');
      expect(agencyEmail.html).toContain('Lipitor 20mg daily');
      expect(agencyEmail.html).toContain('Interested in IUL policy');
    });

    it('should send customer confirmation email', async () => {
      const customerData = {
        firstName: 'Customer',
        lastName: 'Confirmation',
        email: 'customer@test.com',
        phone: '555-CUST-001',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
      };

      readBody.mockResolvedValue(customerData);
      const mockEvent = createMockEvent(customerData);

      await handler(mockEvent);

      // Check customer email (second call)
      const customerEmail = sendMailSpy.mock.calls[1][0];
      expect(customerEmail.to).toBe('customer@test.com');
      expect(customerEmail.subject).toBe(
        'Life Insurance Quote Request Confirmation - Mowry Agency'
      );
      expect(customerEmail.html).toContain('Hi Customer,');
      expect(customerEmail.html).toContain(
        "We've received your comprehensive quote request"
      );
      expect(customerEmail.html).toContain('(930) 322-1962');
      expect(customerEmail.html).toContain('The Mowry Agency Team');
    });

    it('should handle email sending failures', async () => {
      sendMailSpy.mockRejectedValue(new Error('SMTP connection failed'));

      const validData = {
        firstName: 'Email',
        lastName: 'Failure',
        email: 'failure@test.com',
        phone: '555-FAIL-001',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
      };

      readBody.mockResolvedValue(validData);
      const mockEvent = createMockEvent(validData);

      try {
        await handler(mockEvent);
        expect.fail('Should have thrown an error when emails fail');
      } catch (error: any) {
        expect(error.statusCode).toBe(500);
        expect(error.statusMessage).toBe('Failed to process quote request');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional fields gracefully', async () => {
      const minimalData = {
        firstName: 'Minimal',
        lastName: 'Data',
        email: 'minimal@test.com',
        phone: '555-MIN-001',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
        // No healthConditions, medications, or message
      };

      readBody.mockResolvedValue(minimalData);
      const mockEvent = createMockEvent(minimalData);

      const result = await handler(mockEvent);

      expect(result.success).toBe(true);
      expect(mockCreateLead).toHaveBeenCalledWith(
        expect.objectContaining({
          health_conditions: undefined,
          current_medications: undefined,
          message: '',
        })
      );
    });

    it('should handle empty strings for optional fields', async () => {
      const emptyOptionalData = {
        firstName: 'Empty',
        lastName: 'Optional',
        email: 'empty@test.com',
        phone: '555-EMPTY-01',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
        healthConditions: '',
        medications: '',
        message: '',
      };

      readBody.mockResolvedValue(emptyOptionalData);
      const mockEvent = createMockEvent(emptyOptionalData);

      const result = await handler(mockEvent);

      expect(result.success).toBe(true);

      // Check that agency email shows "Not provided" for empty optional fields
      const agencyEmail = sendMailSpy.mock.calls[0][0];
      expect(agencyEmail.html).toContain('Not provided');
    });
  });
});
