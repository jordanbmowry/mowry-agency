import { describe, it, expect, beforeEach, vi } from 'vitest';
import nodemailer from 'nodemailer';

// Mock nodemailer
const mockSendMail = vi.fn();
const mockTransporter = {
  sendMail: mockSendMail,
};

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => mockTransporter),
  },
}));

// Mock supabase operations
const mockSupabaseOperations = {
  createLead: vi.fn(),
  getLeads: vi.fn(),
  updateLeadStatus: vi.fn(),
};

vi.mock('../../lib/supabase', () => ({
  supabaseOperations: mockSupabaseOperations,
}));

// Mock Nuxt server functions
const createError = (options: {
  statusCode: number;
  statusMessage: string;
}) => {
  const error = new Error(options.statusMessage) as any;
  error.statusCode = options.statusCode;
  error.statusMessage = options.statusMessage;
  return error;
};

const readBody = vi.fn();
const defineEventHandler = (handler: any) => handler;

vi.stubGlobal('defineEventHandler', defineEventHandler);
vi.stubGlobal('readBody', readBody);
vi.stubGlobal('createError', createError);

// Import the API handler after mocks are set up
import handler from '../../server/api/quote.post';

describe('QuoteForm End-to-End Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup email mock
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

    // Setup database mock
    mockSupabaseOperations.createLead.mockResolvedValue({
      id: 'lead-12345',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Mock environment variables
    process.env.GMAIL_USER = 'test@agency.com';
    process.env.GMAIL_APP_PASSWORD = 'test-password';
  });

  describe('Complete Quote Request Flow', () => {
    it('should handle complete quote request with all fields', async () => {
      const completeQuoteData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
        healthConditions: 'Good health, no chronic conditions',
        medications: 'Daily multivitamin, occasional ibuprofen',
        message:
          'Looking for $500,000 term life coverage for 20 years to protect my family',
      };

      readBody.mockResolvedValue(completeQuoteData);
      const mockEvent = { node: { req: {}, res: {} } };

      const result = await handler(mockEvent);

      // Verify API response
      expect(result.success).toBe(true);
      expect(result.message).toBe('Quote request submitted successfully');
      expect(result.leadId).toBe('lead-12345');

      // Verify database operation
      expect(mockSupabaseOperations.createLead).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        date_of_birth: '1985-01-01',
        coverage_type: 'term-life',
        health_conditions: 'Good health, no chronic conditions',
        current_medications: 'Daily multivitamin, occasional ibuprofen',
        message:
          'Looking for $500,000 term life coverage for 20 years to protect my family',
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
      });

      // Verify emails were sent (2 emails: agency + customer)
      expect(mockSendMail).toHaveBeenCalledTimes(2);

      // Verify agency email
      const agencyEmail = mockSendMail.mock.calls[0][0];
      expect(agencyEmail.from).toBe('test@agency.com');
      expect(agencyEmail.to).toBe('jordan.b.mowry@gmail.com');
      expect(agencyEmail.subject).toContain(
        'New Life Insurance Quote Request from John Doe'
      );
      expect(agencyEmail.html).toContain('John Doe');
      expect(agencyEmail.html).toContain('john.doe@example.com');
      expect(agencyEmail.html).toContain('555-123-4567');
      expect(agencyEmail.html).toContain('1985-01-01');
      expect(agencyEmail.html).toContain('term-life');
      expect(agencyEmail.html).toContain('Good health, no chronic conditions');
      expect(agencyEmail.html).toContain(
        'Daily multivitamin, occasional ibuprofen'
      );
      expect(agencyEmail.html).toContain(
        'Looking for $500,000 term life coverage'
      );

      // Verify customer confirmation email
      const customerEmail = mockSendMail.mock.calls[1][0];
      expect(customerEmail.from).toBe('test@agency.com');
      expect(customerEmail.to).toBe('john.doe@example.com');
      expect(customerEmail.subject).toBe(
        'Life Insurance Quote Request Confirmation - Mowry Agency'
      );
      expect(customerEmail.html).toContain('Hi John,');
      expect(customerEmail.html).toContain(
        "We've received your comprehensive quote request"
      );
      expect(customerEmail.html).toContain('(930) 322-1962');
    });

    it('should handle minimal quote request with only required fields', async () => {
      const minimalQuoteData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        dateOfBirth: '1990-05-15',
        coverageType: 'whole-life',
        // No optional fields
      };

      readBody.mockResolvedValue(minimalQuoteData);
      const mockEvent = { node: { req: {}, res: {} } };

      const result = await handler(mockEvent);

      expect(result.success).toBe(true);

      // Verify database operation with proper handling of undefined optional fields
      expect(mockSupabaseOperations.createLead).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: 'Smith',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        date_of_birth: '1990-05-15',
        coverage_type: 'whole-life',
        health_conditions: undefined,
        current_medications: undefined,
        message: '',
        lead_type: 'insurance_quote',
        lead_source: 'quote_form',
        status: 'new',
      });

      // Verify agency email shows "Not provided" for missing fields
      const agencyEmail = mockSendMail.mock.calls[0][0];
      expect(agencyEmail.html).toContain('Not provided');

      // Verify customer email still personalizes with first name
      const customerEmail = mockSendMail.mock.calls[1][0];
      expect(customerEmail.html).toContain('Hi Jane,');
    });

    it('should handle quote request with special characters and edge cases', async () => {
      const specialCharQuoteData = {
        firstName: 'José María',
        lastName: "García-O'Connor",
        email: 'jose.garcia@família.com',
        phone: '+1 (555) 123-4567 ext. 890',
        dateOfBirth: '1985-12-25',
        coverageType: 'iul',
        healthConditions:
          'Diabetes Type 2 (well-controlled), high cholesterol managed with diet & exercise',
        medications: 'Metformin 500mg 2x daily, Atorvastatin 20mg @ bedtime',
        message:
          'Need coverage despite health conditions. Budget: $200-300/month. Prefer tax-advantaged solutions.',
      };

      readBody.mockResolvedValue(specialCharQuoteData);
      const mockEvent = { node: { req: {}, res: {} } };

      const result = await handler(mockEvent);

      expect(result.success).toBe(true);

      // Verify special characters are preserved in database
      const createLeadCall = mockSupabaseOperations.createLead.mock.calls[0][0];
      expect(createLeadCall.first_name).toBe('José María');
      expect(createLeadCall.last_name).toBe("García-O'Connor");
      expect(createLeadCall.phone).toBe('+1 (555) 123-4567 ext. 890');

      // Verify special characters in emails
      const agencyEmail = mockSendMail.mock.calls[0][0];
      expect(agencyEmail.html).toContain("José María García-O'Connor");
      expect(agencyEmail.html).toContain('josé.garcia@família.com');
      expect(agencyEmail.html).toContain('Metformin 500mg 2x daily');

      const customerEmail = mockSendMail.mock.calls[1][0];
      expect(customerEmail.html).toContain('Hi José María,');
    });
  });

  describe('Error Scenarios and Recovery', () => {
    it('should handle database failure and still fail gracefully', async () => {
      const validQuoteData = {
        firstName: 'Database',
        lastName: 'Error',
        email: 'db.error@example.com',
        phone: '555-DB-ERROR',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
      };

      // Mock database failure
      mockSupabaseOperations.createLead.mockRejectedValue(
        new Error('Database connection timeout')
      );

      readBody.mockResolvedValue(validQuoteData);
      const mockEvent = { node: { req: {}, res: {} } };

      try {
        await handler(mockEvent);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.statusCode).toBe(500);
        expect(error.statusMessage).toBe('Failed to process quote request');
      }

      // Verify database was attempted
      expect(mockSupabaseOperations.createLead).toHaveBeenCalled();

      // Verify no emails were sent due to database failure
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should handle email failure after successful database save', async () => {
      const validQuoteData = {
        firstName: 'Email',
        lastName: 'Error',
        email: 'email.error@example.com',
        phone: '555-EMAIL-ERR',
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
      };

      // Database succeeds
      mockSupabaseOperations.createLead.mockResolvedValue({
        id: 'lead-67890',
        created_at: new Date().toISOString(),
      });

      // Email fails
      mockSendMail.mockRejectedValue(new Error('SMTP connection failed'));

      readBody.mockResolvedValue(validQuoteData);
      const mockEvent = { node: { req: {}, res: {} } };

      try {
        await handler(mockEvent);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.statusCode).toBe(500);
        expect(error.statusMessage).toBe('Failed to process quote request');
      }

      // Verify database operation succeeded
      expect(mockSupabaseOperations.createLead).toHaveBeenCalled();

      // Verify email was attempted
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should reject invalid input data', async () => {
      const invalidDataScenarios = [
        {
          name: 'missing firstName',
          data: {
            lastName: 'Doe',
            email: 'test@example.com',
            phone: '555-1234',
            dateOfBirth: '1985-01-01',
            coverageType: 'term-life',
          },
        },
        {
          name: 'invalid email format',
          data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'invalid-email',
            phone: '555-1234',
            dateOfBirth: '1985-01-01',
            coverageType: 'term-life',
          },
        },
        {
          name: 'missing coverageType',
          data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            phone: '555-1234',
            dateOfBirth: '1985-01-01',
          },
        },
      ];

      for (const scenario of invalidDataScenarios) {
        vi.clearAllMocks();

        readBody.mockResolvedValue(scenario.data);
        const mockEvent = { node: { req: {}, res: {} } };

        try {
          await handler(mockEvent);
          expect.fail(`Should have thrown an error for ${scenario.name}`);
        } catch (error: any) {
          expect(error.statusCode).toBe(400);
          expect(error.statusMessage).toContain('Missing required fields');
        }

        // Verify no database or email operations occurred
        expect(mockSupabaseOperations.createLead).not.toHaveBeenCalled();
        expect(mockSendMail).not.toHaveBeenCalled();
      }
    });
  });

  describe('Data Flow Integrity', () => {
    it('should maintain data consistency across database and email', async () => {
      const testQuoteData = {
        firstName: 'Consistency',
        lastName: 'Test',
        email: 'consistency@test.com',
        phone: '555-CONSIST',
        dateOfBirth: '1987-07-07',
        coverageType: 'universal-life',
        healthConditions: 'Excellent health',
        medications: 'None',
        message: 'Testing data consistency',
      };

      readBody.mockResolvedValue(testQuoteData);
      const mockEvent = { node: { req: {}, res: {} } };

      await handler(mockEvent);

      // Extract data sent to database
      const dbData = mockSupabaseOperations.createLead.mock.calls[0][0];

      // Extract data from agency email
      const agencyEmailHtml = mockSendMail.mock.calls[0][0].html;

      // Extract data from customer email
      const customerEmailHtml = mockSendMail.mock.calls[1][0].html;
      const customerEmailTo = mockSendMail.mock.calls[1][0].to;

      // Verify consistency across all systems
      expect(dbData.first_name).toBe('Consistency');
      expect(dbData.last_name).toBe('Test');
      expect(dbData.email).toBe('consistency@test.com');
      expect(dbData.phone).toBe('555-CONSIST');
      expect(dbData.date_of_birth).toBe('1987-07-07');
      expect(dbData.coverage_type).toBe('universal-life');

      expect(agencyEmailHtml).toContain('Consistency Test');
      expect(agencyEmailHtml).toContain('consistency@test.com');
      expect(agencyEmailHtml).toContain('555-CONSIST');
      expect(agencyEmailHtml).toContain('1987-07-07');
      expect(agencyEmailHtml).toContain('universal-life');

      expect(customerEmailTo).toBe('consistency@test.com');
      expect(customerEmailHtml).toContain('Hi Consistency,');
    });

    it('should handle data transformation correctly (camelCase to snake_case)', async () => {
      const quoteData = {
        firstName: 'Transform',
        lastName: 'Test',
        email: 'transform@test.com',
        phone: '555-TRANSFORM',
        dateOfBirth: '1985-01-01',
        coverageType: 'whole-life',
        healthConditions: 'Transform health',
        medications: 'Transform meds',
      };

      readBody.mockResolvedValue(quoteData);
      const mockEvent = { node: { req: {}, res: {} } };

      await handler(mockEvent);

      const dbData = mockSupabaseOperations.createLead.mock.calls[0][0];

      // Verify field name transformations
      expect(dbData).toHaveProperty('first_name', 'Transform');
      expect(dbData).toHaveProperty('last_name', 'Test');
      expect(dbData).toHaveProperty('date_of_birth', '1985-01-01');
      expect(dbData).toHaveProperty('coverage_type', 'whole-life');
      expect(dbData).toHaveProperty('health_conditions', 'Transform health');
      expect(dbData).toHaveProperty('current_medications', 'Transform meds');
      expect(dbData).toHaveProperty('lead_type', 'insurance_quote');
      expect(dbData).toHaveProperty('lead_source', 'quote_form');

      // Verify calculated fields
      expect(dbData.name).toBe('Transform Test');
      expect(dbData.status).toBe('new');
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle multiple concurrent quote requests', async () => {
      const quoteRequests = Array.from({ length: 5 }, (_, i) => ({
        firstName: `User${i}`,
        lastName: `Test${i}`,
        email: `user${i}@test.com`,
        phone: `555-000-000${i}`,
        dateOfBirth: '1985-01-01',
        coverageType: 'term-life',
      }));

      // Process all requests concurrently
      const promises = quoteRequests.map(async (data, index) => {
        vi.clearAllMocks();

        mockSupabaseOperations.createLead.mockResolvedValue({
          id: `lead-${index}`,
          created_at: new Date().toISOString(),
        });

        readBody.mockResolvedValue(data);
        const mockEvent = { node: { req: {}, res: {} } };

        return handler(mockEvent);
      });

      const results = await Promise.all(promises);

      // Verify all requests succeeded
      results.forEach((result: any, index: number) => {
        expect(result.success).toBe(true);
        expect(result.leadId).toBe(`lead-${index}`);
      });
    });
  });
});
