import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Supabase
const mockSupabaseInsert = vi.fn();
const mockSupabaseSelect = vi.fn();
const mockSupabaseFrom = vi.fn().mockReturnValue({
  insert: mockSupabaseInsert.mockReturnValue({
    select: mockSupabaseSelect.mockReturnValue({
      single: vi.fn(),
    }),
  }),
});

vi.mock('#supabase/server', () => ({
  serverSupabaseServiceRole: () => ({
    from: mockSupabaseFrom,
  }),
}));

// Mock email service
const mockSendQuoteEmails = vi.fn();
vi.mock('../../server/utils/email-service-vue', () => ({
  sendQuoteEmails: mockSendQuoteEmails,
}));

// Mock readBody function
const mockReadBody = vi.fn();

// Mock runtime config and utils
vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'test@example.com',
    smtpPass: 'password',
    agencyEmail: 'agency@example.com',
    agencyPhone: '(930) 322-1962',
    agencyAddress: '123 Test St',
    agencyWebsite: 'https://example.com',
    agencyNpn: '12345678',
  }),
  defineEventHandler: (handler: any) => handler,
  readBody: mockReadBody,
  createError: (config: any) => new Error(config.statusMessage),
  getHeaders: () => ({
    'x-forwarded-for': '192.168.1.100',
    'user-agent': 'Mozilla/5.0 Test Browser',
  }),
  getHeader: (event: any, header: string) => {
    const headers: Record<string, string> = {
      'user-agent': 'Mozilla/5.0 Test Browser',
    };
    return headers[header];
  },
}));

// Import the API handler
import handler from '../../server/api/quote.post';

describe('Quote API TCPA Compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default successful database response
    mockSupabaseInsert.mockReturnValue({
      select: mockSupabaseSelect.mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-lead-id',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            tcpa_text: 'Test TCPA consent text',
          },
          error: null,
        }),
      }),
    });

    // Default successful email response
    mockSendQuoteEmails.mockResolvedValue({
      customerResult: { success: true },
      agencyResult: { success: true },
    });
  });

  describe('TCPA Data Capture', () => {
    it('captures and stores enhanced TCPA compliance data', async () => {
      const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        city: 'Test City',
        state: 'TX',
        coverageType: 'term_life',
        tcpaConsent: true,
        tcpaText: 'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency and our licensed agents at the contact information provided.',
        emailMarketingConsent: true,
        formVersion: 'v1.1',
      };

      const mockEvent = {
        node: {
          req: {
            headers: {
              'x-forwarded-for': '192.168.1.100',
              'user-agent': 'Mozilla/5.0 Test Browser',
            },
          },
        },
      };

      mockReadBody.mockResolvedValue(testData);

      const response = await handler(mockEvent as any);

      // Verify the database insert was called with enhanced TCPA data
      expect(mockSupabaseInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          tcpa_consent: true,
          tcpa_text: expect.stringContaining('By submitting this form'),
          email_marketing_consent: true,
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 Test Browser',
          form_version: 'v1.1',
          compliance_review_status: 'pending',
        }),
      ]);

      expect(response.success).toBe(true);
    });

    it('captures IP address and user agent for audit trail', async () => {
      const testData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        dateOfBirth: '1985-05-15',
        city: 'Another City',
        state: 'CA',
        coverageType: 'whole_life',
        tcpaConsent: true,
        tcpaText: 'Standard TCPA consent text',
        emailMarketingConsent: false,
        formVersion: 'v1.1',
      };

      const mockEvent = {
        node: {
          req: {
            headers: {
              'x-forwarded-for': '203.0.113.42',
              'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            },
          },
        },
      };

      mockReadBody.mockResolvedValue(testData);

      await handler(mockEvent as any);

      expect(mockSupabaseInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          ip_address: '203.0.113.42',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        }),
      ]);
    });

    it('sets default form version when not provided', async () => {
      const testData = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '5555555555',
        dateOfBirth: '1980-12-25',
        city: 'Default City',
        state: 'FL',
        coverageType: 'term_life',
        tcpaConsent: true,
        // No formVersion provided
      };

      const mockEvent = {
        node: { req: { headers: {} } },
      };

      mockReadBody.mockResolvedValue(testData);

      await handler(mockEvent as any);

      expect(mockSupabaseInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          form_version: 'v1.0', // Should default to v1.0
          compliance_review_status: 'pending',
        }),
      ]);
    });
  });

  describe('TCPA Validation', () => {
    it('requires TCPA consent for form submission', async () => {
      const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        city: 'Test City',
        state: 'TX',
        coverageType: 'term_life',
        tcpaConsent: false, // Missing TCPA consent
      };

      const mockEvent = { node: { req: { headers: {} } } };
      mockReadBody.mockResolvedValue(testData);

      await expect(handler(mockEvent as any)).rejects.toThrow(
        'Missing required fields: firstName, lastName, email, phone, dateOfBirth, city, state, coverageType, and tcpaConsent are required'
      );

      expect(mockSupabaseInsert).not.toHaveBeenCalled();
    });

    it('handles missing TCPA consent gracefully', async () => {
      const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        city: 'Test City',
        state: 'TX',
        coverageType: 'term_life',
        // tcpaConsent field completely missing
      };

      const mockEvent = { node: { req: { headers: {} } } };
      mockReadBody.mockResolvedValue(testData);

      await expect(handler(mockEvent as any)).rejects.toThrow();
      expect(mockSupabaseInsert).not.toHaveBeenCalled();
    });
  });

  describe('Email Notifications with TCPA Data', () => {
    it('includes TCPA data in email notifications', async () => {
      const testData = {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice@example.com',
        phone: '1111111111',
        dateOfBirth: '1992-08-10',
        city: 'Email City',
        state: 'NY',
        coverageType: 'iul',
        tcpaConsent: true,
        tcpaText: 'Custom TCPA consent text for testing',
        emailMarketingConsent: true,
        formVersion: 'v1.1',
      };

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Supabase
const mockSupabaseInsert = vi.fn();
const mockSupabaseSelect = vi.fn();
const mockSupabaseFrom = vi.fn().mockReturnValue({
  insert: mockSupabaseInsert.mockReturnValue({
    select: mockSupabaseSelect.mockReturnValue({
      single: vi.fn(),
    }),
  }),
});

vi.mock('#supabase/server', () => ({
  serverSupabaseServiceRole: () => ({
    from: mockSupabaseFrom,
  }),
}));

// Mock email service
const mockSendQuoteEmails = vi.fn();
vi.mock('../../server/utils/email-service-vue', () => ({
  sendQuoteEmails: mockSendQuoteEmails,
}));

// Mock readBody function
const mockReadBody = vi.fn();

// Mock runtime config and utils
vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'test@example.com',
    smtpPass: 'password',
    agencyEmail: 'agency@example.com',
    agencyPhone: '(930) 322-1962',
    agencyAddress: '123 Test St',
    agencyWebsite: 'https://example.com',
    agencyNpn: '12345678',
  }),
  defineEventHandler: (handler: any) => handler,
  readBody: mockReadBody,
  createError: (config: any) => new Error(config.statusMessage),
  getHeaders: () => ({
    'x-forwarded-for': '192.168.1.100',
    'user-agent': 'Mozilla/5.0 Test Browser',
  }),
  getHeader: (event: any, header: string) => {
    const headers: Record<string, string> = {
      'user-agent': 'Mozilla/5.0 Test Browser',
    };
    return headers[header];
  },
}));

// Import the API handler
import handler from '../../server/api/quote.post';

describe('Quote API TCPA Compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default successful database response
    mockSupabaseInsert.mockReturnValue({
      select: mockSupabaseSelect.mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-lead-id',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            tcpa_text: 'Test TCPA consent text',
          },
          error: null,
        }),
      }),
    });

    // Default successful email response
    mockSendQuoteEmails.mockResolvedValue({
      customerResult: { success: true },
      agencyResult: { success: true },
    });
  });

  describe('TCPA Data Capture', () => {
    it('captures and stores enhanced TCPA compliance data', async () => {
      const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        city: 'Test City',
        state: 'TX',
        coverageType: 'term_life',
        tcpaConsent: true,
        tcpaText: 'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency and our licensed agents at the contact information provided.',
        emailMarketingConsent: true,
        formVersion: 'v1.1',
      };

      const mockEvent = {
        node: {
          req: {
            headers: {
              'x-forwarded-for': '192.168.1.100',
              'user-agent': 'Mozilla/5.0 Test Browser',
            },
          },
        },
      };

      mockReadBody.mockResolvedValue(testData);

      const response = await handler(mockEvent as any);

      // Verify the database insert was called with enhanced TCPA data
      expect(mockSupabaseInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          tcpa_consent: true,
          tcpa_text: expect.stringContaining('By submitting this form'),
          email_marketing_consent: true,
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 Test Browser',
          form_version: 'v1.1',
          compliance_review_status: 'pending',
        }),
      ]);

      expect(response.success).toBe(true);
    });

    it('captures IP address and user agent for audit trail', async () => {
      const testData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        dateOfBirth: '1985-05-15',
        city: 'Another City',
        state: 'CA',
        coverageType: 'whole_life',
        tcpaConsent: true,
        tcpaText: 'Standard TCPA consent text',
        emailMarketingConsent: false,
        formVersion: 'v1.1',
      };

      const mockEvent = {
        node: {
          req: {
            headers: {
              'x-forwarded-for': '203.0.113.42',
              'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            },
          },
        },
      };

      mockReadBody.mockResolvedValue(testData);

      await handler(mockEvent as any);

      expect(mockSupabaseInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          ip_address: '203.0.113.42',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        }),
      ]);
    });

    it('sets default form version when not provided', async () => {
      const testData = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '5555555555',
        dateOfBirth: '1980-12-25',
        city: 'Default City',
        state: 'FL',
        coverageType: 'term_life',
        tcpaConsent: true,
        // No formVersion provided
      };

      const mockEvent = {
        node: { req: { headers: {} } },
      };

      mockReadBody.mockResolvedValue(testData);

      await handler(mockEvent as any);

      expect(mockSupabaseInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          form_version: 'v1.0', // Should default to v1.0
          compliance_review_status: 'pending',
        }),
      ]);
    });
  });

  describe('TCPA Validation', () => {
    it('requires TCPA consent for form submission', async () => {
      const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        city: 'Test City',
        state: 'TX',
        coverageType: 'term_life',
        tcpaConsent: false, // Missing TCPA consent
      };

      const mockEvent = { node: { req: { headers: {} } } };
      mockReadBody.mockResolvedValue(testData);

      await expect(handler(mockEvent as any)).rejects.toThrow(
        'Missing required fields: firstName, lastName, email, phone, dateOfBirth, city, state, coverageType, and tcpaConsent are required'
      );

      expect(mockSupabaseInsert).not.toHaveBeenCalled();
    });

    it('handles missing TCPA consent gracefully', async () => {
      const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        city: 'Test City',
        state: 'TX',
        coverageType: 'term_life',
        // tcpaConsent field completely missing
      };

      const mockEvent = { node: { req: { headers: {} } } };
      mockReadBody.mockResolvedValue(testData);

      await expect(handler(mockEvent as any)).rejects.toThrow();
      expect(mockSupabaseInsert).not.toHaveBeenCalled();
    });
  });

  describe('Email Notifications with TCPA Data', () => {
    it('includes TCPA data in email notifications', async () => {
      const testData = {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice@example.com',
        phone: '1111111111',
        dateOfBirth: '1992-08-10',
        city: 'Email City',
        state: 'NY',
        coverageType: 'iul',
        tcpaConsent: true,
        tcpaText: 'Custom TCPA consent text for testing',
        emailMarketingConsent: true,
        formVersion: 'v1.1',
      };

      const mockEvent = { node: { req: { headers: {} } } };
      mockReadBody.mockResolvedValue(testData);

      await handler(mockEvent as any);

      // Verify email service was called with enhanced lead data
      expect(mockSendQuoteEmails).toHaveBeenCalledWith(
        expect.any(Object), // email config
        expect.objectContaining({
          tcpa_text: 'Custom TCPA consent text for testing',
          email_marketing_consent: true,
          ip_address: expect.any(String),
          user_agent: expect.any(String),
          form_version: 'v1.1',
        }),
        expect.any(Object) // agency info
      );
    });
  });

  describe('Error Handling', () => {
    it('handles database errors gracefully while preserving TCPA data', async () => {
      const testData = {
        firstName: 'Error',
        lastName: 'Test',
        email: 'error@example.com',
        phone: '0000000000',
        dateOfBirth: '1980-01-01',
        city: 'Error City',
        state: 'CA',
        coverageType: 'term_life',
        tcpaConsent: true,
        tcpaText: 'TCPA consent for error test',
        formVersion: 'v1.1',
      };

      // Mock database error
      mockSupabaseInsert.mockReturnValue({
        select: mockSupabaseSelect.mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error', code: '500' },
          }),
        }),
      });

      const mockEvent = { node: { req: { headers: {} } } };
      mockReadBody.mockResolvedValue(testData);

      await expect(handler(mockEvent as any)).rejects.toThrow();

      // Verify that TCPA data was still attempted to be stored
      expect(mockSupabaseInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          tcpa_consent: true,
          tcpa_text: 'TCPA consent for error test',
          form_version: 'v1.1',
        }),
      ]);
    });
  });
});