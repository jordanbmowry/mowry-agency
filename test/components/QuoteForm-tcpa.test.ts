import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createApp } from 'vue';
import { mount } from '@vue/test-utils';
import QuoteForm from '../../app/components/QuoteForm.vue';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock Nuxt composables
vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      agencyPhone: '(930) 322-1962',
      agencyEmail: 'test@example.com',
    },
  }),
  $fetch: vi.fn(),
  useNuxtApp: () => ({
    $fetch: vi.fn(),
  }),
}));

describe('QuoteForm TCPA Compliance', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(QuoteForm, {
      global: {
        stubs: {
          Icon: true,
          Button: true,
          NuxtLink: true,
        },
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.resetAllMocks();
  });

  describe('TCPA Consent Display', () => {
    it('displays standardized TCPA consent text', () => {
      const tcpaLabel = wrapper.find('label[for="tcpaConsent"]');
      expect(tcpaLabel.exists()).toBe(true);

      const expectedText =
        'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency and our licensed agents at the contact information provided. This consent is not required as a condition of purchase. Standard message and data rates may apply. You can unsubscribe at any time.';
      expect(tcpaLabel.text()).toContain(expectedText);
    });

    it('includes licensing disclosure section', () => {
      const licensingSection = wrapper.find('.bg-zinc-50');
      expect(licensingSection.exists()).toBe(true);
      expect(licensingSection.text()).toContain('Licensing Information');
      expect(licensingSection.text()).toContain('Mowry Digital Enterprise LLC');
    });

    it('shows email marketing consent checkbox', () => {
      const emailMarketingCheckbox = wrapper.find('#emailMarketing');
      expect(emailMarketingCheckbox.exists()).toBe(true);
      expect(emailMarketingCheckbox.attributes('type')).toBe('checkbox');
    });
  });

  describe('Form Data Structure', () => {
    it('includes enhanced TCPA compliance fields in form data', async () => {
      const formData = wrapper.vm.form;

      expect(formData).toHaveProperty('tcpaConsent');
      expect(formData).toHaveProperty('emailMarketingConsent');
      expect(formData).toHaveProperty('formVersion');
      expect(formData.formVersion).toBe('v1.1');
    });

    it('initializes consent fields to false', () => {
      const formData = wrapper.vm.form;

      expect(formData.tcpaConsent).toBe(false);
      expect(formData.emailMarketingConsent).toBe(false);
    });
  });

  describe('Form Submission with TCPA Data', () => {
    it('includes TCPA compliance data in submission', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        success: true,
        message: 'Quote submitted successfully',
      });
      wrapper.vm.$fetch = mockFetch;

      // Fill out required form fields
      await wrapper.find('#firstName').setValue('John');
      await wrapper.find('#lastName').setValue('Doe');
      await wrapper.find('#email').setValue('john@example.com');
      await wrapper.find('#phone').setValue('1234567890');
      await wrapper.find('#dateOfBirth').setValue('1990-01-01');
      await wrapper.find('#city').setValue('Test City');
      await wrapper.find('#state').setValue('TX');
      await wrapper.find('#coverageType').setValue('term_life');
      await wrapper.find('#tcpaConsent').setChecked(true);
      await wrapper.find('#emailMarketing').setChecked(true);

      // Submit form
      await wrapper.find('form').trigger('submit.prevent');

      expect(mockFetch).toHaveBeenCalledWith('/api/quote', {
        method: 'POST',
        body: expect.objectContaining({
          tcpaConsent: true,
          tcpaText: expect.stringContaining('By submitting this form'),
          emailMarketingConsent: true,
          formVersion: 'v1.1',
        }),
      });
    });

    it('prevents submission without TCPA consent', async () => {
      const mockFetch = vi.fn();
      wrapper.vm.$fetch = mockFetch;

      // Fill out required fields but leave TCPA unchecked
      await wrapper.find('#firstName').setValue('John');
      await wrapper.find('#lastName').setValue('Doe');
      await wrapper.find('#email').setValue('john@example.com');
      await wrapper.find('#phone').setValue('1234567890');
      await wrapper.find('#dateOfBirth').setValue('1990-01-01');
      await wrapper.find('#city').setValue('Test City');
      await wrapper.find('#state').setValue('TX');
      await wrapper.find('#coverageType').setValue('term_life');
      // tcpaConsent left false

      // Try to submit form
      await wrapper.find('form').trigger('submit.prevent');

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset After Submission', () => {
    it('resets consent fields correctly after successful submission', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        success: true,
        message: 'Quote submitted successfully',
      });
      wrapper.vm.$fetch = mockFetch;

      // Set consent fields to true
      wrapper.vm.form.tcpaConsent = true;
      wrapper.vm.form.emailMarketingConsent = true;

      // Trigger successful submission
      await wrapper.vm.handleSubmit();

      // Check that consent fields are reset to false
      expect(wrapper.vm.form.tcpaConsent).toBe(false);
      expect(wrapper.vm.form.emailMarketingConsent).toBe(false);
      // Form version should remain the same
      expect(wrapper.vm.form.formVersion).toBe('v1.1');
    });
  });
});
