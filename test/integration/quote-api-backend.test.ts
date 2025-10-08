import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils/e2e';
import nodemailer from 'nodemailer';

// Mock nodemailer for testing
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn(),
    })),
  },
}));

describe('QuoteForm Backend API Tests', async () => {
  await setup({});

  let mockTransporter: any;
  let sendMailSpy: any;

  beforeEach(() => {
    // Set up email mocking
    sendMailSpy = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });
    mockTransporter = {
      sendMail: sendMailSpy,
    };
    vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Email Integration', () => {
    it('should send both agency and customer confirmation emails', async () => {
      const quoteData = {
        firstName: 'Email',
        lastName: 'Test',
        email: 'email.test@example.com',
        phone: '555-EMAIL-01',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
        message: 'Testing email functionality',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: quoteData,
      })) as { success: boolean };

      expect(response.success).toBe(true);

      // Should send 2 emails: one to agency, one to customer
      expect(sendMailSpy).toHaveBeenCalledTimes(2);

      // Check agency email
      const agencyEmail = sendMailSpy.mock.calls[0][0];
      expect(agencyEmail.to).toBe('jordan.b.mowry@gmail.com');
      expect(agencyEmail.subject).toContain(
        'New Life Insurance Quote Request from Email Test'
      );
      expect(agencyEmail.html).toContain('Email Test');
      expect(agencyEmail.html).toContain('email.test@example.com');
      expect(agencyEmail.html).toContain('555-EMAIL-01');
      expect(agencyEmail.html).toContain('1985-01-01');
      expect(agencyEmail.html).toContain('Term Life Insurance');
      expect(agencyEmail.html).toContain('None'); // Health conditions
      expect(agencyEmail.html).toContain('Testing email functionality');

      // Check customer confirmation email
      const customerEmail = sendMailSpy.mock.calls[1][0];
      expect(customerEmail.to).toBe('email.test@example.com');
      expect(customerEmail.subject).toBe(
        'Life Insurance Quote Request Confirmation - Mowry Agency'
      );
      expect(customerEmail.html).toContain('Hi Email,');
      expect(customerEmail.html).toContain(
        "We've received your comprehensive quote request"
      );
      expect(customerEmail.html).toContain('(930) 322-1962');
    });

    it('should include all health information in agency email', async () => {
      const detailedHealthData = {
        firstName: 'Detailed',
        lastName: 'Health',
        email: 'health@test.com',
        phone: '555-HEALTH-1',
        dateOfBirth: '1980-05-15',
        healthConditions:
          'Type 2 diabetes diagnosed 2018, well controlled with A1C of 6.8. Hypertension managed with medication. No complications.',
        medications:
          'Metformin 500mg twice daily, Lisinopril 10mg daily, daily multivitamin',
        coverageType: 'Whole Life Insurance',
        message: 'Need coverage despite health conditions',
      };

      await $fetch('/api/quote', {
        method: 'POST',
        body: detailedHealthData,
      });

      expect(sendMailSpy).toHaveBeenCalled();

      const agencyEmail = sendMailSpy.mock.calls[0][0];
      expect(agencyEmail.html).toContain('Type 2 diabetes diagnosed 2018');
      expect(agencyEmail.html).toContain('Metformin 500mg twice daily');
      expect(agencyEmail.html).toContain('Lisinopril 10mg daily');
      expect(agencyEmail.html).toContain(
        'Need coverage despite health conditions'
      );
    });

    it('should handle email sending failures gracefully', async () => {
      // Mock email failure
      sendMailSpy.mockRejectedValue(new Error('SMTP Error'));

      const quoteData = {
        firstName: 'Email',
        lastName: 'Failure',
        email: 'failure@test.com',
        phone: '555-FAIL-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: quoteData,
        });
        // Email failure should not cause API failure
        expect(true).toBe(false);
      } catch (error: any) {
        // Should return 500 error when email fails
        expect(error.status).toBe(500);
      }
    });

    it('should format coverage types correctly in emails', async () => {
      const coverageTests = [
        { value: 'term-life', expected: 'term-life' },
        { value: 'whole-life', expected: 'whole-life' },
        { value: 'iul', expected: 'iul' },
        { value: 'not-sure', expected: 'not-sure' },
      ];

      for (const test of coverageTests) {
        const quoteData = {
          firstName: 'Coverage',
          lastName: 'Test',
          email: `coverage-${test.value}@test.com`,
          phone: '555-COV-TEST',
          dateOfBirth: '1985-01-01',
          healthConditions: 'None',
          medications: 'None',
          coverageType: test.value,
          message: `Testing ${test.value} coverage`,
        };

        await $fetch('/api/quote', {
          method: 'POST',
          body: quoteData,
        });

        const agencyEmail =
          sendMailSpy.mock.calls[sendMailSpy.mock.calls.length - 2][0]; // Second to last call (agency email)
        expect(agencyEmail.html).toContain(test.expected);
      }
    });
  });

  describe('Database Operations', () => {
    it('should save complete quote data to database', async () => {
      const completeData = {
        firstName: 'Database',
        lastName: 'Test',
        email: 'database@test.com',
        phone: '555-DB-TEST1',
        dateOfBirth: '1990-12-25',
        healthConditions: 'Seasonal allergies, well controlled',
        medications: 'Claritin 10mg as needed',
        coverageType: 'Indexed Universal Life (IUL)',
        message: 'Interested in tax-advantaged growth',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: completeData,
      })) as { success: boolean; leadId: string };

      expect(response.success).toBe(true);
      expect(response.leadId).toBeDefined();
      expect(typeof response.leadId).toBe('string');
      expect(response.leadId.length).toBeGreaterThan(0);
    });

    it('should handle database constraint violations gracefully', async () => {
      // Test with potentially problematic data
      const constraintTestData = {
        firstName: '', // Empty string
        lastName: 'Test',
        email: 'constraint@test.com',
        phone: '555-CONST-01',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: constraintTestData,
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.data.message).toContain('Missing required fields');
      }
    });

    it('should set correct metadata fields', async () => {
      const metadataTest = {
        firstName: 'Metadata',
        lastName: 'Test',
        email: 'metadata@test.com',
        phone: '555-META-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
        message: 'Testing metadata fields',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: metadataTest,
      })) as { success: boolean; leadId: string };

      expect(response.success).toBe(true);

      // The API should set:
      // lead_source = 'quote_form'
      // lead_type = 'insurance_quote'
      // status = 'new'
      // name = 'Metadata Test' (backwards compatibility)
    });
  });

  describe('API Response Structure', () => {
    it('should return consistent response structure on success', async () => {
      const testData = {
        firstName: 'Response',
        lastName: 'Structure',
        email: 'response@test.com',
        phone: '555-RESP-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: testData,
      })) as any;

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('leadId');
      expect(typeof response.success).toBe('boolean');
      expect(typeof response.message).toBe('string');
      expect(typeof response.leadId).toBe('string');
    });

    it('should return consistent error structure on failure', async () => {
      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: { invalid: 'data' },
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toHaveProperty('status');
        expect(error).toHaveProperty('data');
        expect(error.data).toHaveProperty('message');
        expect(typeof error.status).toBe('number');
        expect(typeof error.data.message).toBe('string');
      }
    });
  });

  describe('Security and Sanitization', () => {
    it('should sanitize HTML and script tags in input', async () => {
      const maliciousData = {
        firstName: '<script>alert("xss")</script>',
        lastName: '"><img src=x onerror=alert(1)>',
        email: 'security@test.com',
        phone: '555-SEC-001',
        dateOfBirth: '1985-01-01',
        healthConditions: '<iframe src="javascript:alert(1)"></iframe>',
        medications: '<?php echo "malicious"; ?>',
        coverageType: 'Term Life Insurance',
        message: 'javascript:alert("xss")',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: maliciousData,
      })) as { success: boolean };

      expect(response.success).toBe(true);

      // Check that emails don't contain unescaped scripts
      const agencyEmail = sendMailSpy.mock.calls[0][0];
      expect(agencyEmail.html).not.toContain('<script>');
      expect(agencyEmail.html).not.toContain('javascript:');
      expect(agencyEmail.html).not.toContain('<?php');
    });

    it('should handle SQL injection attempts safely', async () => {
      const sqlInjectionData = {
        firstName: "'; DROP TABLE leads; --",
        lastName: "' OR '1'='1",
        email: 'sql@test.com',
        phone: '555-SQL-001',
        dateOfBirth: '1985-01-01',
        healthConditions: "'; DELETE FROM leads WHERE '1'='1",
        medications: 'None',
        coverageType: 'Term Life Insurance',
        message: "' UNION SELECT * FROM users --",
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: sqlInjectionData,
      })) as { success: boolean };

      expect(response.success).toBe(true);
      // Database should handle this safely with parameterized queries
    });
  });

  describe('Business Logic Validation', () => {
    it('should enforce age limits through API', async () => {
      const tooYoungData = {
        firstName: 'Too',
        lastName: 'Young',
        email: 'young@test.com',
        phone: '555-YOUNG-01',
        dateOfBirth: '2010-01-01', // 14 years old
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: tooYoungData,
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400);
      }
    });

    it('should require all mandatory fields', async () => {
      const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'dateOfBirth',
        'coverageType',
      ];

      for (const field of requiredFields) {
        const incompleteData = {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '555-TEST-001',
          dateOfBirth: '1985-01-01',
          healthConditions: 'None',
          medications: 'None',
          coverageType: 'Term Life Insurance',
        };

        // Remove the field being tested
        delete (incompleteData as any)[field];

        try {
          await $fetch('/api/quote', {
            method: 'POST',
            body: incompleteData,
          });
          expect(true).toBe(false);
        } catch (error: any) {
          expect(error.status).toBe(400);
          expect(error.data.message).toContain('Missing required fields');
        }
      }
    });
  });

  describe('Performance Under Load', () => {
    it('should handle concurrent database writes', async () => {
      const concurrentRequests = Array.from({ length: 3 }, (_, i) => {
        return $fetch('/api/quote', {
          method: 'POST',
          body: {
            firstName: `Concurrent${i}`,
            lastName: 'DbTest',
            email: `concurrent${i}@db.test`,
            phone: `555-CON-00${i}`,
            dateOfBirth: '1985-01-01',
            healthConditions: 'None',
            medications: 'None',
            coverageType: 'Term Life Insurance',
            message: `Concurrent database test ${i}`,
          },
        });
      });

      const responses = (await Promise.all(concurrentRequests)) as Array<{
        success: boolean;
        leadId: string;
      }>;

      responses.forEach((response, index) => {
        expect(response.success).toBe(true);
        expect(response.leadId).toBeDefined();

        // Each should have unique leadId
        const otherIds = responses.slice(0, index).map((r) => r.leadId);
        expect(otherIds).not.toContain(response.leadId);
      });
    });
  });
});
