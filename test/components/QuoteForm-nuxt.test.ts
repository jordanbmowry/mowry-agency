import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import QuoteForm from '../../app/components/QuoteForm.vue';

// Mock Nuxt composables using the official @nuxt/test-utils
mockNuxtImport('useRuntimeConfig', () => () => ({
  public: {
    agencyPhone: '(930) 322-1962',
    agencyEmail: 'test@example.com',
  },
}));

const mockFetch = vi.fn().mockResolvedValue({ success: true });
mockNuxtImport('$fetch', () => mockFetch);

mockNuxtImport('useNuxtApp', () => () => ({
  $fetch: mockFetch,
}));

describe('QuoteForm TCPA Compliance (Nuxt Testing)', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(QuoteForm, {
      global: {
        stubs: {
          Icon: true,
          Button: true,
          NuxtLink: true,
          NuxtImg: true,
        },
      },
    });
  });

  describe('TCPA Consent Display', () => {
    it('displays standardized TCPA consent text', () => {
      const tcpaLabel = wrapper.find('label[for="tcpaConsent"]');
      expect(tcpaLabel.exists()).toBe(true);

      // Check for key parts of the TCPA consent text
      const labelText = tcpaLabel.text();
      expect(labelText).toContain('By submitting this form');
      expect(labelText).toContain('Mowry Agency');
      expect(labelText).toContain('not required as a condition of purchase');
      expect(labelText).toContain('unsubscribe at any time');
    });

    it('includes licensing disclosure information', () => {
      const pageText = wrapper.text();
      expect(pageText).toContain('Licensing Information');
      expect(pageText).toContain('Mowry Digital Enterprise LLC');
    });

    it('shows required TCPA consent checkbox', () => {
      const tcpaCheckbox = wrapper.find('#tcpaConsent');
      expect(tcpaCheckbox.exists()).toBe(true);
      expect(tcpaCheckbox.attributes('type')).toBe('checkbox');
      expect(tcpaCheckbox.attributes('required')).toBeDefined();
    });
  });

  describe('Form Data Structure', () => {
    it('includes enhanced TCPA compliance fields', () => {
      const formData = wrapper.vm.form;

      expect(formData).toHaveProperty('tcpaConsent');
      expect(formData).toHaveProperty('emailMarketingConsent');
      expect(formData).toHaveProperty('formVersion');
      expect(formData.formVersion).toBe('v1.1');
    });

    it('initializes consent fields correctly', () => {
      const formData = wrapper.vm.form;

      expect(formData.tcpaConsent).toBe(false);
      expect(formData.emailMarketingConsent).toBe(false);
    });
  });

  describe('Form Submission with Enhanced TCPA Data', () => {
    beforeEach(async () => {
      // Fill out all required form fields
      await wrapper.find('#firstName').setValue('John');
      await wrapper.find('#lastName').setValue('Doe');
      await wrapper.find('#email').setValue('john@example.com');
      await wrapper.find('#phone').setValue('1234567890');
      await wrapper.find('#dateOfBirth').setValue('1990-01-01');
      await wrapper.find('#city').setValue('Test City');
      await wrapper.find('#state').setValue('TX');
      await wrapper.find('#coverageType').setValue('term_life');
      await wrapper.find('#tcpaConsent').setChecked(true);
    });

    it('includes TCPA compliance data in API call', async () => {
      mockFetch.mockResolvedValueOnce({
        success: true,
        message: 'Quote submitted successfully',
      });

      await wrapper.find('form').trigger('submit.prevent');

      expect(mockFetch).toHaveBeenCalledWith('/api/quote', {
        method: 'POST',
        body: expect.objectContaining({
          tcpaConsent: true,
          tcpaText: expect.stringContaining('By submitting this form'),
          emailMarketingConsent: false,
          formVersion: 'v1.1',
        }),
      });
    });

    it('prevents submission without TCPA consent', async () => {
      await wrapper.find('#tcpaConsent').setChecked(false);

      await wrapper.find('form').trigger('submit.prevent');

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('resets form correctly after successful submission', async () => {
      mockFetch.mockResolvedValueOnce({
        success: true,
        message: 'Quote submitted successfully',
      });

      // Set marketing consent to true
      wrapper.vm.form.emailMarketingConsent = true;

      await wrapper.find('form').trigger('submit.prevent');
      await wrapper.vm.$nextTick();

      // Check that consent fields are reset
      expect(wrapper.vm.form.tcpaConsent).toBe(false);
      expect(wrapper.vm.form.emailMarketingConsent).toBe(false);
      // Form version should remain
      expect(wrapper.vm.form.formVersion).toBe('v1.1');
    });
  });

  describe('TCPA Text Consistency', () => {
    it('provides consistent TCPA text in component and submission', () => {
      const tcpaText = wrapper.vm.tcpaConsentText;

      expect(tcpaText).toContain(
        'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency'
      );
      expect(tcpaText).toContain(
        'This consent is not required as a condition of purchase'
      );
      expect(tcpaText).toContain('You can unsubscribe at any time');
    });
  });

  describe('Accessibility and UX', () => {
    it('has proper form labels and required field indicators', () => {
      const requiredFields = wrapper.findAll('input[required]');
      expect(requiredFields.length).toBeGreaterThan(0);

      const tcpaLabel = wrapper.find('label[for="tcpaConsent"]');
      expect(tcpaLabel.text()).toContain('*');
    });

    it('shows privacy policy and terms links', () => {
      const privacyLink = wrapper.find('a[href="/privacy-policy"]');
      const termsLink = wrapper.find('a[href="/terms-of-service"]');

      expect(privacyLink.exists()).toBe(true);
      expect(termsLink.exists()).toBe(true);
    });
  });
});
