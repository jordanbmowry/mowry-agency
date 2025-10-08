import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import QuoteForm from '../../app/components/QuoteForm.vue';

describe('QuoteForm Basic Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();

    wrapper = mount(QuoteForm, {
      global: {
        stubs: {
          Button: {
            template:
              '<button :type="type" :disabled="disabled" :class="class"><slot /></button>',
            props: ['type', 'disabled', 'class'],
          },
          MailIcon: {
            template: '<div data-testid="mail-icon">📧</div>',
          },
        },
        mocks: {
          $fetch: vi.fn().mockResolvedValue({ success: true }),
        },
      },
    });
  });

  it('renders the form correctly', () => {
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.text()).toContain('Get Your Free Life Insurance Quote');
  });

  it('has all required form fields', () => {
    const requiredFields = [
      '#firstName',
      '#lastName',
      '#email',
      '#phone',
      '#dateOfBirth',
      '#healthConditions',
      '#medications',
      '#coverageType',
    ];

    requiredFields.forEach((field) => {
      expect(wrapper.find(field).exists()).toBe(true);
    });
  });

  it('shows required field indicators', () => {
    expect(wrapper.text()).toContain('First Name *');
    expect(wrapper.text()).toContain('Last Name *');
    expect(wrapper.text()).toContain('Email Address *');
    expect(wrapper.text()).toContain('Date of Birth *');
  });

  it('has coverage type options', () => {
    const select = wrapper.find('#coverageType');
    expect(select.exists()).toBe(true);

    const options = select.findAll('option');
    expect(options.length).toBeGreaterThan(1);
    expect(select.html()).toContain('Term Life Insurance');
    expect(select.html()).toContain('Whole Life Insurance');
  });

  it('displays section headers', () => {
    expect(wrapper.text()).toContain('Personal Information');
    expect(wrapper.text()).toContain('Health Information');
    expect(wrapper.text()).toContain('Coverage Information');
  });

  it('has form validation functions available', () => {
    expect(typeof wrapper.vm.validateEmail).toBe('function');
    expect(typeof wrapper.vm.validatePhone).toBe('function');
    expect(typeof wrapper.vm.validateName).toBe('function');
    expect(typeof wrapper.vm.validateDateOfBirth).toBe('function');
  });

  it('validates email format correctly', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';

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

  it('calculates max date correctly', () => {
    const today = new Date();
    const expectedMaxDate = today.toISOString().split('T')[0];
    expect(wrapper.vm.maxDate).toBe(expectedMaxDate);
  });

  it('tracks form data correctly', () => {
    expect(wrapper.vm.isFormValid).toBe(false);

    // Fill all required fields
    wrapper.vm.form.firstName = 'John';
    wrapper.vm.form.lastName = 'Doe';
    wrapper.vm.form.email = 'john@example.com';
    wrapper.vm.form.phone = '555-123-4567';
    wrapper.vm.form.dateOfBirth = '1985-01-01';
    wrapper.vm.form.healthConditions = 'None';
    wrapper.vm.form.medications = 'None';
    wrapper.vm.form.coverageType = 'term-life';

    // Verify data is set correctly
    expect(wrapper.vm.form.firstName).toBe('John');
    expect(wrapper.vm.form.email).toBe('john@example.com');
    expect(wrapper.vm.form.coverageType).toBe('term-life');
  });
});
