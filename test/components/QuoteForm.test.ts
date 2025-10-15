import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import QuoteForm from '../../app/components/QuoteForm.vue';

// Mock the $fetch function
const mockFetch = vi.fn();

// Mock child components to avoid dependency issues
const ButtonStub = {
  name: 'Button',
  template:
    '<button :disabled="disabled" :class="class" :type="type"><slot /></button>',
  props: ['type', 'disabled', 'class'],
};

const MailIconStub = {
  name: 'MailIcon',
  template: '<svg data-testid="mail-icon"></svg>',
};

describe('QuoteForm', () => {
  let wrapper: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.stubGlobal('$fetch', mockFetch);

    wrapper = await mountSuspended(QuoteForm, {
      global: {
        stubs: {
          Button: ButtonStub,
          MailIcon: MailIconStub,
        },
      },
    });
  });

  describe('Component Rendering', () => {
    it('renders the form title correctly', () => {
      expect(wrapper.text()).toContain('Get Your Free Life Insurance Quote');
    });

    it('renders all required form fields', () => {
      // Check that all required input fields exist
      expect(wrapper.find('#firstName').exists()).toBe(true);
      expect(wrapper.find('#lastName').exists()).toBe(true);
      expect(wrapper.find('#email').exists()).toBe(true);
      expect(wrapper.find('#phone').exists()).toBe(true);
      expect(wrapper.find('#dateOfBirth').exists()).toBe(true);
      expect(wrapper.find('#healthConditions').exists()).toBe(true);
      expect(wrapper.find('#medications').exists()).toBe(true);
      expect(wrapper.find('#coverageType').exists()).toBe(true);
      expect(wrapper.find('#message').exists()).toBe(true);
    });

    it('renders coverage type options', () => {
      const select = wrapper.find('#coverageType');
      const options = select.findAll('option');

      expect(options.length).toBeGreaterThan(1);
      expect(
        options.some((option: any) => option.text() === 'Term Life Insurance')
      ).toBe(true);
      expect(
        options.some((option: any) => option.text() === 'Whole Life Insurance')
      ).toBe(true);
    });

    it('shows required field indicators', () => {
      expect(wrapper.text()).toContain('First Name *');
      expect(wrapper.text()).toContain('Last Name *');
      expect(wrapper.text()).toContain('Email Address *');
      expect(wrapper.text()).toContain('Date of Birth *');
    });
  });

  describe('Form Validation Functions', () => {
    it('validates email format correctly', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'invalid-email';

      // Access the validation function from the component
      const emailValidation1 = wrapper.vm.validateEmail(validEmail);
      const emailValidation2 = wrapper.vm.validateEmail(invalidEmail);

      expect(emailValidation1).toBe('');
      expect(emailValidation2).toContain('valid email address');
    });

    it('validates phone format correctly', () => {
      const validPhone = '555-123-4567';
      const invalidPhone = '123';

      const phoneValidation1 = wrapper.vm.validatePhone(validPhone);
      const phoneValidation2 = wrapper.vm.validatePhone(invalidPhone);

      expect(phoneValidation1).toBe('');
      expect(phoneValidation2).toContain('valid phone number');
    });

    it('validates name fields correctly', () => {
      const validName = 'John';
      const shortName = 'A';
      const emptyName = '';

      const nameValidation1 = wrapper.vm.validateName(validName, 'First name');
      const nameValidation2 = wrapper.vm.validateName(shortName, 'First name');
      const nameValidation3 = wrapper.vm.validateName(emptyName, 'First name');

      expect(nameValidation1).toBe('');
      expect(nameValidation2).toContain('at least 2 characters');
      expect(nameValidation3).toContain('is required');
    });

    it('validates date of birth correctly', () => {
      const validDate = '1990-01-01';
      const futureDate = '2030-01-01';
      const underageDate = '2010-01-01';

      const dateValidation1 = wrapper.vm.validateDateOfBirth(validDate);
      const dateValidation2 = wrapper.vm.validateDateOfBirth(futureDate);
      const dateValidation3 = wrapper.vm.validateDateOfBirth(underageDate);

      expect(dateValidation1).toBe('');
      expect(dateValidation2).toContain('cannot be in the future');
      expect(dateValidation3).toContain('at least 18 years old');
    });
  });

  describe('Form State Management', () => {
    it('initializes with empty form data', () => {
      expect(wrapper.vm.form.firstName).toBe('');
      expect(wrapper.vm.form.lastName).toBe('');
      expect(wrapper.vm.form.email).toBe('');
      expect(wrapper.vm.form.phone).toBe('');
    });

    it('tracks form validity correctly', async () => {
      expect(wrapper.vm.isFormValid).toBe(false);

      // Fill all required fields with valid data
      wrapper.vm.form.firstName = 'John';
      wrapper.vm.form.lastName = 'Doe';
      wrapper.vm.form.email = 'john@example.com';
      wrapper.vm.form.phone = '555-123-4567';
      wrapper.vm.form.dateOfBirth = '1985-01-01';
      wrapper.vm.form.healthConditions = 'None';
      wrapper.vm.form.medications = 'None';
      wrapper.vm.form.coverageType = 'term-life';

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isFormValid).toBe(true);
    });

    it('calculates max date correctly', () => {
      const today = new Date();
      const expectedMaxDate = today.toISOString().split('T')[0];

      expect(wrapper.vm.maxDate).toBe(expectedMaxDate);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Set up valid form data
      wrapper.vm.form.firstName = 'John';
      wrapper.vm.form.lastName = 'Doe';
      wrapper.vm.form.email = 'john@example.com';
      wrapper.vm.form.phone = '555-123-4567';
      wrapper.vm.form.dateOfBirth = '1985-01-01';
      wrapper.vm.form.healthConditions = 'None';
      wrapper.vm.form.medications = 'None';
      wrapper.vm.form.coverageType = 'term-life';
      wrapper.vm.form.message = 'Test message';
    });

    it('submits form with correct data structure', async () => {
      mockFetch.mockResolvedValue({ success: true });

      await wrapper.vm.handleSubmit();

      expect(mockFetch).toHaveBeenCalledWith('/api/quote', {
        method: 'POST',
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-123-4567',
          dateOfBirth: '1985-01-01',
          healthConditions: 'None',
          medications: 'None',
          coverageType: 'term-life',
          message: 'Test message',
        },
      });
    });

    it('shows loading state during submission', async () => {
      mockFetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const submitPromise = wrapper.vm.handleSubmit();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isSubmitting).toBe(true);

      await submitPromise;
      expect(wrapper.vm.isSubmitting).toBe(false);
    });

    it('shows success message on successful submission', async () => {
      mockFetch.mockResolvedValue({ success: true });

      await wrapper.vm.handleSubmit();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.submitted).toBe(true);
    });

    it('shows error message on failed submission', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      await wrapper.vm.handleSubmit();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.error).toBe(true);
    });

    it('resets form after successful submission', async () => {
      mockFetch.mockResolvedValue({ success: true });

      await wrapper.vm.handleSubmit();

      expect(wrapper.vm.form.firstName).toBe('');
      expect(wrapper.vm.form.lastName).toBe('');
      expect(wrapper.vm.form.email).toBe('');
    });
  });

  describe('User Interaction', () => {
    it('updates form fields when user types', async () => {
      await wrapper.find('#firstName').setValue('Jane');
      expect(wrapper.vm.form.firstName).toBe('Jane');

      await wrapper.find('#email').setValue('jane@example.com');
      expect(wrapper.vm.form.email).toBe('jane@example.com');
    });

    it('validates fields on blur', async () => {
      await wrapper.find('#email').setValue('invalid-email');
      await wrapper.find('#email').trigger('blur');

      expect(wrapper.vm.errors.email).toContain('valid email address');
    });

    it('clears validation errors when field becomes valid', async () => {
      // Set invalid email first
      await wrapper.find('#email').setValue('invalid');
      await wrapper.find('#email').trigger('blur');
      expect(wrapper.vm.errors.email).toBeTruthy();

      // Set valid email
      await wrapper.find('#email').setValue('valid@example.com');
      await wrapper.find('#email').trigger('blur');
      expect(wrapper.vm.errors.email).toBe('');
    });
  });
});
