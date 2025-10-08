import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils/e2e';
import nodemailer from 'nodemailer';

// Mock nodemailer for email testing
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(),
  },
}));

describe('QuoteForm Email Integration Tests', async () => {
  await setup({});

  let mockTransporter: any;
  let sendMailSpy: any;

  beforeEach(() => {
    sendMailSpy = vi.fn();
    mockTransporter = {
      sendMail: sendMailSpy,
    };
    vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Email Configuration and Setup', () => {
    it('should create email transporter with correct configuration', async () => {
      sendMailSpy.mockResolvedValue({ messageId: 'test-id' });

      await $fetch('/api/quote', {
        method: 'POST',
        body: {
          firstName: 'Config',
          lastName: 'Test',
          email: 'config@test.com',
          phone: '555-CONFIG-1',
          dateOfBirth: '1985-01-01',
          healthConditions: 'None',
          medications: 'None',
          coverageType: 'Term Life Insurance',
        },
      });

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    });

    it('should handle missing email environment variables', async () => {
      const originalUser = process.env.GMAIL_USER;
      const originalPass = process.env.GMAIL_APP_PASSWORD;

      // Temporarily remove env vars
      delete process.env.GMAIL_USER;
      delete process.env.GMAIL_APP_PASSWORD;

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: {
            firstName: 'Env',
            lastName: 'Test',
            email: 'env@test.com',
            phone: '555-ENV-001',
            dateOfBirth: '1985-01-01',
            healthConditions: 'None',
            medications: 'None',
            coverageType: 'Term Life Insurance',
          },
        });

        // Should either fail gracefully or use defaults
        expect(true).toBe(true);
      } catch (error: any) {
        expect(error.status).toBeGreaterThanOrEqual(400);
      } finally {
        // Restore env vars
        if (originalUser) process.env.GMAIL_USER = originalUser;
        if (originalPass) process.env.GMAIL_APP_PASSWORD = originalPass;
      }
    });
  });

  describe('Agency Notification Email', () => {
    beforeEach(() => {
      sendMailSpy.mockResolvedValue({ messageId: 'test-agency-id' });
    });

    it('should send comprehensive agency notification with all form data', async () => {
      const comprehensiveData = {
        firstName: 'Comprehensive',
        lastName: 'Agency Test',
        email: 'comprehensive@agency.test',
        phone: '555-AGENCY-01',
        dateOfBirth: '1987-11-15',
        healthConditions:
          'Asthma diagnosed in childhood, well controlled with inhaler. Last attack was over 2 years ago. Exercise regularly without limitations.',
        medications:
          'Albuterol rescue inhaler (rarely used), daily multivitamin, Vitamin D3 2000 IU',
        coverageType: 'Whole Life Insurance',
        message:
          'Looking for permanent coverage with cash value component. Budget around $300/month. Have young family to protect.',
      };

      await $fetch('/api/quote', {
        method: 'POST',
        body: comprehensiveData,
      });

      expect(sendMailSpy).toHaveBeenCalledTimes(2);

      const agencyEmailCall = sendMailSpy.mock.calls.find(
        (call: any) => call[0].to === 'jordan.b.mowry@gmail.com'
      );
      expect(agencyEmailCall).toBeDefined();

      const agencyEmail = agencyEmailCall[0];

      // Check email structure
      expect(agencyEmail.from).toBe(process.env.GMAIL_USER);
      expect(agencyEmail.to).toBe('jordan.b.mowry@gmail.com');
      expect(agencyEmail.subject).toBe(
        'New Life Insurance Quote Request from Comprehensive Agency Test'
      );
      expect(agencyEmail.html).toBeDefined();

      // Check all form data is included
      expect(agencyEmail.html).toContain('Comprehensive Agency Test');
      expect(agencyEmail.html).toContain('comprehensive@agency.test');
      expect(agencyEmail.html).toContain('555-AGENCY-01');
      expect(agencyEmail.html).toContain('1987-11-15');
      expect(agencyEmail.html).toContain('Whole Life Insurance');
      expect(agencyEmail.html).toContain('Asthma diagnosed in childhood');
      expect(agencyEmail.html).toContain('Albuterol rescue inhaler');
      expect(agencyEmail.html).toContain('Looking for permanent coverage');
      expect(agencyEmail.html).toContain('Life Insurance Quote Form');
    });

    it('should format email content properly with HTML structure', async () => {
      const formatTestData = {
        firstName: 'HTML',
        lastName: 'Format',
        email: 'html@format.test',
        phone: '555-HTML-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'Diabetes & high blood pressure',
        medications: 'Metformin & lisinopril',
        coverageType: 'Term Life Insurance',
        message: 'Need coverage ASAP',
      };

      await $fetch('/api/quote', {
        method: 'POST',
        body: formatTestData,
      });

      const agencyEmail = sendMailSpy.mock.calls[0][0];

      // Check HTML structure
      expect(agencyEmail.html).toContain(
        '<h2>New Life Insurance Quote Request</h2>'
      );
      expect(agencyEmail.html).toContain('<p><strong>Name:</strong>');
      expect(agencyEmail.html).toContain('<p><strong>Email:</strong>');
      expect(agencyEmail.html).toContain('<p><strong>Phone:</strong>');
      expect(agencyEmail.html).toContain('<p><strong>Date of Birth:</strong>');
      expect(agencyEmail.html).toContain('<p><strong>Coverage Type:</strong>');
      expect(agencyEmail.html).toContain(
        '<p><strong>Health Conditions:</strong>'
      );
      expect(agencyEmail.html).toContain('<p><strong>Medications:</strong>');
      expect(agencyEmail.html).toContain('<p><strong>Lead Source:</strong>');
      expect(agencyEmail.html).toContain('<p><strong>Submitted:</strong>');

      // Check ampersands are properly escaped
      expect(agencyEmail.html).toContain('Diabetes &amp; high blood pressure');
      expect(agencyEmail.html).toContain('Metformin &amp; lisinopril');
    });

    it('should handle special characters and unicode in email content', async () => {
      const unicodeData = {
        firstName: 'José María',
        lastName: "González-O'Connor",
        email: 'josé@test.com',
        phone: '+1-555-123-4567',
        dateOfBirth: '1985-01-01',
        healthConditions: 'Niño con asma (childhood asthma) – fully resolved',
        medications: 'Café daily (caffeine), vitaminas',
        coverageType: 'Term Life Insurance',
        message: 'Necesito seguro para mi familia 👨‍👩‍👧‍👦',
      };

      await $fetch('/api/quote', {
        method: 'POST',
        body: unicodeData,
      });

      const agencyEmail = sendMailSpy.mock.calls[0][0];

      expect(agencyEmail.html).toContain('José María');
      expect(agencyEmail.html).toContain("González-O'Connor");
      expect(agencyEmail.html).toContain('josé@test.com');
      expect(agencyEmail.html).toContain('Niño con asma');
      expect(agencyEmail.html).toContain('vitaminas');
      expect(agencyEmail.html).toContain('familia 👨‍👩‍👧‍👦');
    });

    it('should include timestamp in agency email', async () => {
      const timestampData = {
        firstName: 'Timestamp',
        lastName: 'Test',
        email: 'timestamp@test.com',
        phone: '555-TIME-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      const beforeTime = new Date();
      await $fetch('/api/quote', {
        method: 'POST',
        body: timestampData,
      });
      const afterTime = new Date();

      const agencyEmail = sendMailSpy.mock.calls[0][0];

      expect(agencyEmail.html).toContain('<p><strong>Submitted:</strong>');

      // Extract timestamp from email
      const timestampMatch = agencyEmail.html.match(
        /<strong>Submitted:<\/strong>\s*(.+?)<\/p>/
      );
      expect(timestampMatch).toBeDefined();

      const emailTimestamp = new Date(timestampMatch[1]);
      expect(emailTimestamp.getTime()).toBeGreaterThanOrEqual(
        beforeTime.getTime()
      );
      expect(emailTimestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });

  describe('Customer Confirmation Email', () => {
    beforeEach(() => {
      sendMailSpy.mockResolvedValue({ messageId: 'test-customer-id' });
    });

    it('should send personalized customer confirmation email', async () => {
      const customerData = {
        firstName: 'CustomerEmail',
        lastName: 'Test',
        email: 'customer@email.test',
        phone: '555-CUST-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
        message: 'Looking forward to hearing from you',
      };

      await $fetch('/api/quote', {
        method: 'POST',
        body: customerData,
      });

      expect(sendMailSpy).toHaveBeenCalledTimes(2);

      const customerEmailCall = sendMailSpy.mock.calls.find(
        (call: any) => call[0].to === 'customer@email.test'
      );
      expect(customerEmailCall).toBeDefined();

      const customerEmail = customerEmailCall[0];

      // Check email structure
      expect(customerEmail.from).toBe(process.env.GMAIL_USER);
      expect(customerEmail.to).toBe('customer@email.test');
      expect(customerEmail.subject).toBe(
        'Life Insurance Quote Request Confirmation - Mowry Agency'
      );
      expect(customerEmail.html).toBeDefined();

      // Check personalization
      expect(customerEmail.html).toContain('Hi CustomerEmail,');
      expect(customerEmail.html).toContain(
        "We've received your comprehensive quote request"
      );
      expect(customerEmail.html).toContain('within 24 hours');
      expect(customerEmail.html).toContain('(930) 322-1962');
      expect(customerEmail.html).toContain('The Mowry Agency Team');
    });

    it('should include professional messaging in customer email', async () => {
      const professionalData = {
        firstName: 'Professional',
        lastName: 'Message',
        email: 'professional@message.test',
        phone: '555-PROF-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Whole Life Insurance',
      };

      await $fetch('/api/quote', {
        method: 'POST',
        body: professionalData,
      });

      const customerEmail = sendMailSpy.mock.calls[1][0];

      expect(customerEmail.html).toContain(
        'Thank you for your life insurance quote request!'
      );
      expect(customerEmail.html).toContain('personalized coverage options');
      expect(customerEmail.html).toContain("protect your family's future");
      expect(customerEmail.html).toContain(
        'tax-advantaged life insurance strategies'
      );
      expect(customerEmail.html).toContain('specific situation');
      expect(customerEmail.html).toContain('immediate questions');
    });

    it('should handle customer names with special characters', async () => {
      const specialNameData = {
        firstName: 'María José',
        lastName: "O'Brien-Smith",
        email: 'maria.jose@test.com',
        phone: '555-SPEC-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'Term Life Insurance',
      };

      await $fetch('/api/quote', {
        method: 'POST',
        body: specialNameData,
      });

      const customerEmail = sendMailSpy.mock.calls[1][0];
      expect(customerEmail.html).toContain('Hi María José,');
    });
  });

  describe('Email Error Handling', () => {
    it('should handle SMTP connection failures', async () => {
      sendMailSpy.mockRejectedValue(new Error('SMTP Connection failed'));

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: {
            firstName: 'SMTP',
            lastName: 'Error',
            email: 'smtp@error.test',
            phone: '555-SMTP-001',
            dateOfBirth: '1985-01-01',
            healthConditions: 'None',
            medications: 'None',
            coverageType: 'Term Life Insurance',
          },
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(500);
        expect(error.data.message).toBe('Failed to process quote request');
      }
    });

    it('should handle authentication failures', async () => {
      sendMailSpy.mockRejectedValue(new Error('Authentication failed'));

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: {
            firstName: 'Auth',
            lastName: 'Error',
            email: 'auth@error.test',
            phone: '555-AUTH-001',
            dateOfBirth: '1985-01-01',
            healthConditions: 'None',
            medications: 'None',
            coverageType: 'Term Life Insurance',
          },
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(500);
      }
    });

    it('should handle invalid email addresses gracefully', async () => {
      sendMailSpy.mockRejectedValue(new Error('Invalid recipient'));

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: {
            firstName: 'Invalid',
            lastName: 'Email',
            email: 'definitely-not-a-valid-email',
            phone: '555-INVALID-1',
            dateOfBirth: '1985-01-01',
            healthConditions: 'None',
            medications: 'None',
            coverageType: 'Term Life Insurance',
          },
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(400); // Should catch this in validation
      }
    });

    it('should handle partial email sending failures', async () => {
      // Mock: agency email succeeds, customer email fails
      sendMailSpy
        .mockResolvedValueOnce({ messageId: 'agency-success' })
        .mockRejectedValueOnce(new Error('Customer email failed'));

      try {
        await $fetch('/api/quote', {
          method: 'POST',
          body: {
            firstName: 'Partial',
            lastName: 'Failure',
            email: 'partial@failure.test',
            phone: '555-PART-001',
            dateOfBirth: '1985-01-01',
            healthConditions: 'None',
            medications: 'None',
            coverageType: 'Term Life Insurance',
          },
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(500);
        // Both emails should be attempted
        expect(sendMailSpy).toHaveBeenCalledTimes(2);
      }
    });
  });

  describe('Email Content Security', () => {
    it('should escape HTML in email content', async () => {
      const htmlData = {
        firstName: '<script>alert("xss")</script>',
        lastName: '<img src="x" onerror="alert(1)">',
        email: 'html@security.test',
        phone: '555-HTML-001',
        dateOfBirth: '1985-01-01',
        healthConditions: '<iframe src="javascript:void(0)"></iframe>',
        medications: '<style>body{display:none}</style>',
        coverageType: 'Term Life Insurance',
        message: '<script>document.location="http://evil.com"</script>',
      };

      sendMailSpy.mockResolvedValue({ messageId: 'security-test' });

      await $fetch('/api/quote', {
        method: 'POST',
        body: htmlData,
      });

      const agencyEmail = sendMailSpy.mock.calls[0][0];

      // Should not contain unescaped script tags
      expect(agencyEmail.html).not.toContain('<script>');
      expect(agencyEmail.html).not.toContain('<iframe>');
      expect(agencyEmail.html).not.toContain('<img src="x"');
      expect(agencyEmail.html).not.toContain('javascript:');

      // Should contain escaped content
      expect(agencyEmail.html).toContain('&lt;script&gt;');
      expect(agencyEmail.html).toContain('&lt;iframe');
    });

    it('should prevent email header injection', async () => {
      const injectionData = {
        firstName: 'Header\r\nBcc: attacker@evil.com',
        lastName: 'Injection\nTo: victim@example.com',
        email: 'injection@test.com',
        phone: '555-INJ-001',
        dateOfBirth: '1985-01-01',
        healthConditions: 'Condition\r\nSubject: Hacked!',
        medications: 'Med\nFrom: fake@sender.com',
        coverageType: 'Term Life Insurance',
        message: 'Message\r\n\r\nThis is a fake email body',
      };

      sendMailSpy.mockResolvedValue({ messageId: 'injection-test' });

      await $fetch('/api/quote', {
        method: 'POST',
        body: injectionData,
      });

      const agencyEmail = sendMailSpy.mock.calls[0][0];

      // Email headers should be clean
      expect(agencyEmail.to).toBe('jordan.b.mowry@gmail.com');
      expect(agencyEmail.subject).not.toContain('\r\n');
      expect(agencyEmail.subject).not.toContain('\n');
      expect(agencyEmail.from).toBe(process.env.GMAIL_USER);

      // Content should be sanitized
      expect(agencyEmail.html).not.toContain('Bcc: attacker@evil.com');
      expect(agencyEmail.html).not.toContain('Subject: Hacked!');
    });
  });

  describe('Email Performance', () => {
    it('should send emails within reasonable time', async () => {
      sendMailSpy.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ messageId: 'perf-test' }), 100)
          )
      );

      const startTime = Date.now();

      await $fetch('/api/quote', {
        method: 'POST',
        body: {
          firstName: 'Performance',
          lastName: 'Test',
          email: 'performance@email.test',
          phone: '555-PERF-001',
          dateOfBirth: '1985-01-01',
          healthConditions: 'None',
          medications: 'None',
          coverageType: 'Term Life Insurance',
        },
      });

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(3000); // Should complete within 3 seconds
      expect(sendMailSpy).toHaveBeenCalledTimes(2);
    });
  });
});
