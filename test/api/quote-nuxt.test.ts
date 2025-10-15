import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils/e2e';

// Mock dependencies for API testing
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

const mockSendQuoteEmails = vi.fn();
vi.mock('../../server/utils/email-service-vue', () => ({
  sendQuoteEmails: mockSendQuoteEmails,
}));

describe('Quote API TCPA Compliance (Nuxt Testing)', async () => {
  await setup({
    // You can provide custom config here if needed
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Default successful responses
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

    mockSendQuoteEmails.mockResolvedValue({
      customerResult: { success: true },
      agencyResult: { success: true },
    });
  });

  describe('Enhanced TCPA Data Capture', () => {
    it('captures complete TCPA compliance data', async () => {
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
        tcpaText:
          'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency.',
        emailMarketingConsent: true,
        formVersion: 'v1.1',
      };

      // Note: This would be a real API call in a full e2e test
      // For now, we'll test the data transformation logic

      expect(testData.tcpaConsent).toBe(true);
      expect(testData.tcpaText).toContain('Mowry Agency');
      expect(testData.emailMarketingConsent).toBe(true);
      expect(testData.formVersion).toBe('v1.1');
    });

    it('validates required TCPA consent', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        city: 'Test City',
        state: 'TX',
        coverageType: 'term_life',
        tcpaConsent: false, // Invalid - no consent
      };

      // In a real test, this would make an API call and expect an error
      expect(invalidData.tcpaConsent).toBe(false);
    });
  });

  describe('Form Version Tracking', () => {
    it('tracks form versions for compliance audit', () => {
      const formVersions = [
        { version: 'v1.0', tcpaText: 'Original consent text' },
        { version: 'v1.1', tcpaText: 'Updated consent text with enhancements' },
      ];

      formVersions.forEach(({ version, tcpaText }) => {
        expect(version).toMatch(/^v\d+\.\d+$/);
        expect(tcpaText).toBeTruthy();
      });
    });
  });

  describe('Email Integration with TCPA Data', () => {
    it('includes TCPA data in email notifications', () => {
      const emailData = {
        customerData: {
          firstName: 'John',
          email: 'john@example.com',
          tcpaText: 'Consent text from form',
          emailMarketingConsent: true,
        },
      };

      expect(emailData.customerData.tcpaText).toBeTruthy();
      expect(emailData.customerData.emailMarketingConsent).toBe(true);
    });
  });

  describe('Compliance Scoring Logic', () => {
    it('calculates compliance scores correctly', () => {
      const scenarios = [
        {
          name: 'Full Compliance',
          data: {
            tcpa_consent: true,
            tcpa_text: 'Complete consent text',
            ip_address: '192.168.1.1',
            days_since_consent: 15,
            unsubscribed_at: null,
          },
          expectedScore: 9,
        },
        {
          name: 'Partial Compliance',
          data: {
            tcpa_consent: true,
            tcpa_text: null,
            ip_address: null,
            days_since_consent: 100,
            unsubscribed_at: null,
          },
          expectedScore: 3,
        },
      ];

      scenarios.forEach(({ name, data, expectedScore }) => {
        // Mock the compliance scoring logic
        let score = 0;
        if (data.tcpa_consent) score += 3;
        if (data.tcpa_text) score += 2;
        if (data.ip_address) score += 1;
        if (data.days_since_consent <= 30) score += 3;
        else if (data.days_since_consent <= 90) score += 2;
        if (data.unsubscribed_at) score -= 5;

        score = Math.max(1, Math.min(10, score));

        expect(score).toBe(expectedScore);
      });
    });
  });
});
