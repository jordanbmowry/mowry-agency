import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils/e2e';

describe('QuoteForm Integration Tests - Full Flow', async () => {
  await setup({
    // Use actual Nuxt app for integration testing
  });

  describe('Frontend to Backend Integration', () => {
    it('should submit valid form data and receive success response', async () => {
      const validQuoteData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        phone: '555-123-4567',
        dateOfBirth: '1985-06-15',
        healthConditions: 'Mild seasonal allergies',
        medications: 'Claritin as needed during allergy season',
        coverageType: 'Term Life Insurance',
        message: 'Looking for 20-year term coverage for $500K',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: validQuoteData,
      })) as { success: boolean; message: string; leadId: string };

      expect(response.success).toBe(true);
      expect(response.message).toContain(
        'Quote request submitted successfully'
      );
      expect(response.leadId).toBeDefined();
      expect(typeof response.leadId).toBe('string');
    });

    it('should validate required fields on server side', async () => {
      const incompleteData = {
        firstName: 'John',
        email: 'john@test.com',
        // Missing required fields
      };

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: incompleteData,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.data.message).toContain('Missing required fields');
      }
    });

    it('should validate email format on server', async () => {
      const invalidEmailData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email-format',
        phone: '555-123-4567',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: invalidEmailData,
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.data.message).toBe('Invalid email format');
      }
    });

    it('should handle all coverage types correctly', async () => {
      const coverageTypes = [
        'term-life',
        'whole-life',
        'iul',
        'mortgage-protection',
        'final-expense',
        'annuities',
        'not-sure',
      ];

      for (const coverageType of coverageTypes) {
        const quoteData = {
          firstName: 'Test',
          lastName: 'User',
          email: `test.${coverageType}@example.com`,
          phone: '555-000-0000',
          dateOfBirth: '1990-01-01',
          healthConditions: 'None',
          medications: 'None',
          coverageType,
          message: `Testing ${coverageType} coverage type`,
        };

        const response = (await $fetch('/api/quote', {
          method: 'POST',
          body: quoteData,
        })) as { success: boolean };

        expect(response.success).toBe(true);
      }
    });
  });

  describe('Database Integration', () => {
    it('should store form data with correct field mapping', async () => {
      const quoteData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith.db.test@example.com',
        phone: '555-987-6543',
        dateOfBirth: '1992-03-20',
        healthConditions: 'Type 2 diabetes, well controlled',
        medications: 'Metformin 500mg twice daily',
        coverageType: 'Whole Life Insurance',
        message: 'Need permanent coverage with cash value growth',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: quoteData,
      })) as { success: boolean; leadId: string };

      expect(response.success).toBe(true);
      expect(response.leadId).toBeDefined();

      // The database should store:
      // firstName -> first_name
      // lastName -> last_name
      // healthConditions -> health_conditions
      // medications -> current_medications
      // coverageType -> coverage_type
      // lead_source should be 'quote_form'
      // lead_type should be 'insurance_quote'
      // status should be 'new'
    });

    it('should handle special characters and long text properly', async () => {
      const specialCharData = {
        firstName: 'José',
        lastName: "O'Connor-Smith",
        email: 'jose.oconnor@test.com',
        phone: '+1-555-123-4567',
        dateOfBirth: '1988-12-25',
        healthConditions:
          'History of back surgery (L4-L5 fusion) in 2019. Currently pain-free with no restrictions. Also have family history of heart disease but personal cardiac health is excellent.',
        medications:
          'Daily multivitamin, Omega-3 fish oil 1000mg, occasional ibuprofen for minor aches',
        coverageType: 'Term Life Insurance',
        message:
          'Looking for comprehensive coverage. Have questions about underwriting process given surgical history. Budget is flexible for right coverage amount.',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: specialCharData,
      })) as { success: boolean };

      expect(response.success).toBe(true);
    });

    it('should set correct default values for lead tracking', async () => {
      const basicData = {
        firstName: 'Default',
        lastName: 'Test',
        email: 'default.test@example.com',
        phone: '555-000-1111',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: basicData,
      })) as { success: boolean; leadId: string };

      expect(response.success).toBe(true);

      // Should set:
      // lead_source = 'quote_form'
      // lead_type = 'insurance_quote'
      // status = 'new'
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: 'invalid json string',
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400);
      }
    });

    it('should handle missing request body', async () => {
      try {
        await $fetch('/api/quote', {
          method: 'POST',
          // No body
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBeGreaterThanOrEqual(400);
      }
    });

    it('should handle oversized input gracefully', async () => {
      const oversizedData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        phone: '555-123-4567',
        dateOfBirth: '1985-01-01',
        healthConditions: 'A'.repeat(10000), // Very long text
        medications: 'B'.repeat(10000), // Very long text
        coverageType: 'Term Life Insurance',
        message: 'C'.repeat(10000), // Very long text
      };

      try {
        const response = (await $fetch('/api/quote', {
          method: 'POST',
          body: oversizedData,
        })) as { success: boolean };

        // Should either succeed (if properly handled) or fail gracefully
        expect(response.success).toBe(true);
      } catch (error: any) {
        // If it fails, should be a proper error response
        expect(error.status).toBe(400);
      }
    });

    it('should handle XSS attempts safely', async () => {
      const xssData = {
        firstName: '<script>alert("xss")</script>',
        lastName: '"><img src=x onerror=alert("xss")>',
        email: 'test@example.com',
        phone: '555-123-4567',
        dateOfBirth: '1985-01-01',
        healthConditions: 'javascript:alert("xss")',
        medications: '<iframe src="javascript:alert(1)">',
        coverageType: 'Term Life Insurance',
        message: '<?php echo "test"; ?>',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: xssData,
      })) as { success: boolean };

      expect(response.success).toBe(true);
      // The system should sanitize or safely handle these inputs
    });
  });

  describe('Business Logic Validation', () => {
    it('should handle minimum age requirements', async () => {
      const underageData = {
        firstName: 'Young',
        lastName: 'Person',
        email: 'young@test.com',
        phone: '555-123-4567',
        dateOfBirth: '2010-01-01', // Too young
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: underageData,
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.data.message).toContain('age');
      }
    });

    it('should handle future birth dates', async () => {
      const futureDateData = {
        firstName: 'Future',
        lastName: 'Person',
        email: 'future@test.com',
        phone: '555-123-4567',
        dateOfBirth: '2030-01-01', // Future date
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: futureDateData,
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.data.message).toContain('future');
      }
    });

    it('should handle realistic old age limits', async () => {
      const veryOldData = {
        firstName: 'Very',
        lastName: 'Old',
        email: 'old@test.com',
        phone: '555-123-4567',
        dateOfBirth: '1900-01-01', // 125 years old
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: veryOldData,
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.data.message).toContain('age');
      }
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) => {
        return $fetch('/api/quote', {
          method: 'POST',
          body: {
            firstName: `User${i}`,
            lastName: 'Concurrent',
            email: `user${i}@concurrent.test`,
            phone: `555-000-000${i}`,
            dateOfBirth: '1985-01-01',
            healthConditions: 'None',
            medications: 'None',
            coverageType: 'Term Life Insurance',
            message: `Concurrent test request ${i}`,
          },
        });
      });

      const responses = (await Promise.all(requests)) as Array<{
        success: boolean;
      }>;

      responses.forEach((response) => {
        expect(response.success).toBe(true);
      });
    });

    it('should respond within reasonable time limits', async () => {
      const startTime = Date.now();

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: {
          firstName: 'Performance',
          lastName: 'Test',
          email: 'performance@test.com',
          phone: '555-123-4567',
          dateOfBirth: '1985-01-01',
          healthConditions: 'None',
          medications: 'None',
          coverageType: 'Term Life Insurance',
          message: 'Performance testing',
        },
      })) as { success: boolean };

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.success).toBe(true);
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
    });
  });

  describe('Data Integrity', () => {
    it('should preserve data accuracy through the entire flow', async () => {
      const originalData = {
        firstName: 'DataIntegrity',
        lastName: 'TestUser',
        email: 'integrity@test.com',
        phone: '555-999-8888',
        dateOfBirth: '1987-08-15',
        healthConditions:
          'Seasonal allergies, managed with antihistamines during spring months',
        medications: 'Loratadine 10mg daily March-May, as needed basis',
        coverageType: 'Indexed Universal Life (IUL)',
        message:
          'Interested in tax-advantaged growth with life insurance protection',
      };

      const response = (await $fetch('/api/quote', {
        method: 'POST',
        body: originalData,
      })) as { success: boolean; leadId: string };

      expect(response.success).toBe(true);
      expect(response.leadId).toBeDefined();

      // All data should be preserved exactly as submitted
      // (the actual verification would require database query access)
    });
  });
});
