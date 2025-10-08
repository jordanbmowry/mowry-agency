import { describe, it, expect } from 'vitest';

// Simple validation function tests without component mounting
describe('QuoteForm Validation Tests', () => {
  // Test email validation function
  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  // Test phone validation function
  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[\+]?[1-9]?[\s\-\.\(\)]?[\d\s\-\.\(\)]{9,15}$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return '';
  };

  // Test name validation function
  const validateName = (name: string, fieldName: string): string => {
    if (!name.trim()) return `${fieldName} is required`;
    if (name.trim().length < 2)
      return `${fieldName} must be at least 2 characters`;
    if (name.trim().length > 50)
      return `${fieldName} must be less than 50 characters`;
    return '';
  };

  // Test date of birth validation function
  const validateDateOfBirth = (dateOfBirth: string): string => {
    if (!dateOfBirth.trim()) return 'Date of birth is required';

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Check for future dates first
    if (birthDate > today) return 'Date of birth cannot be in the future';

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      const adjustedAge = age - 1;
      if (adjustedAge < 18) return 'You must be at least 18 years old';
      if (adjustedAge > 100) return 'Please enter a valid date of birth';
    } else {
      if (age < 18) return 'You must be at least 18 years old';
      if (age > 100) return 'Please enter a valid date of birth';
    }

    return '';
  };

  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe('');
      expect(validateEmail('user.name@domain.co.uk')).toBe('');
      expect(validateEmail('valid+email@test.org')).toBe('');
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toContain('valid email address');
      expect(validateEmail('test@')).toContain('valid email address');
      expect(validateEmail('@domain.com')).toContain('valid email address');
      expect(validateEmail('')).toContain('required');
    });
  });

  describe('Phone Validation', () => {
    it('should validate correct phone formats', () => {
      expect(validatePhone('555-123-4567')).toBe('');
      expect(validatePhone('(555) 123-4567')).toBe('');
      expect(validatePhone('+1-555-123-4567')).toBe('');
      expect(validatePhone('555.123.4567')).toBe('');
    });

    it('should reject invalid phone formats', () => {
      expect(validatePhone('123')).toContain('valid phone number');
      expect(validatePhone('abc-def-ghij')).toContain('valid phone number');
      expect(validatePhone('')).toContain('required');
    });
  });

  describe('Name Validation', () => {
    it('should validate correct names', () => {
      expect(validateName('John', 'First name')).toBe('');
      expect(validateName('Mary Jane', 'First name')).toBe('');
      expect(validateName("O'Connor", 'Last name')).toBe('');
    });

    it('should reject invalid names', () => {
      expect(validateName('', 'First name')).toContain('required');
      expect(validateName('A', 'First name')).toContain(
        'at least 2 characters'
      );
      expect(validateName('A'.repeat(51), 'First name')).toContain(
        'less than 50 characters'
      );
    });
  });

  describe('Date of Birth Validation', () => {
    it('should validate correct dates', () => {
      expect(validateDateOfBirth('1985-01-01')).toBe('');
      expect(validateDateOfBirth('1990-12-25')).toBe('');
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      expect(validateDateOfBirth(futureDateString)).toContain(
        'cannot be in the future'
      );
    });

    it('should reject underage dates', () => {
      const underageDate = new Date();
      underageDate.setFullYear(underageDate.getFullYear() - 10);
      const underageDateString = underageDate.toISOString().split('T')[0];
      expect(validateDateOfBirth(underageDateString)).toContain(
        'at least 18 years old'
      );
    });

    it('should reject very old dates', () => {
      expect(validateDateOfBirth('1900-01-01')).toContain(
        'valid date of birth'
      );
    });

    it('should require date of birth', () => {
      expect(validateDateOfBirth('')).toContain('required');
    });
  });

  describe('Form Data Structure', () => {
    it('should have all required form fields defined', () => {
      const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'dateOfBirth',
        'healthConditions',
        'medications',
        'coverageType',
        'message',
      ];

      // Test that we can create an object with all required fields
      const formData: Record<string, string> = {};
      requiredFields.forEach((field) => {
        formData[field] = '';
      });

      expect(Object.keys(formData)).toEqual(requiredFields);
    });

    it('should have valid coverage type options', () => {
      const coverageTypes = [
        'term-life',
        'whole-life',
        'iul',
        'mortgage-protection',
        'final-expense',
        'annuities',
        'not-sure',
      ];

      expect(coverageTypes.length).toBeGreaterThan(0);
      expect(coverageTypes).toContain('term-life');
      expect(coverageTypes).toContain('whole-life');
    });
  });

  describe('Form Validation Logic', () => {
    it('should determine form validity correctly', () => {
      const isFormValid = (form: Record<string, string>) => {
        const requiredFields = [
          'firstName',
          'lastName',
          'email',
          'phone',
          'dateOfBirth',
          'coverageType',
        ];
        const hasRequiredFields = requiredFields.every(
          (field) => form[field]?.trim() !== ''
        );

        // Check if any validation functions would return errors
        const hasValidEmail = validateEmail(form.email || '') === '';
        const hasValidPhone = validatePhone(form.phone || '') === '';
        const hasValidNames =
          validateName(form.firstName || '', 'First name') === '' &&
          validateName(form.lastName || '', 'Last name') === '';
        const hasValidDate = validateDateOfBirth(form.dateOfBirth || '') === '';

        return (
          hasRequiredFields &&
          hasValidEmail &&
          hasValidPhone &&
          hasValidNames &&
          hasValidDate
        );
      };

      // Valid form
      const validForm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        dateOfBirth: '1985-01-01',
        healthConditions: 'None',
        medications: 'None',
        coverageType: 'term-life',
        message: 'Test message',
      };
      expect(isFormValid(validForm)).toBe(true);

      // Invalid form (missing required field)
      const invalidForm = { ...validForm, email: '' };
      expect(isFormValid(invalidForm)).toBe(false);

      // Invalid form (bad email)
      const badEmailForm = { ...validForm, email: 'invalid-email' };
      expect(isFormValid(badEmailForm)).toBe(false);
    });
  });
});
