<template>
  <div class="space-y-6">
    <FormSelect
      id="coverageType"
      label="Type of Coverage Interested In"
      v-model="form.coverageType"
      :options="coverageTypeOptions"
      :error="errors.coverageType"
      :required="true"
      placeholder="Select coverage type"
      help-text="We'll help you find the best coverage type for your needs"
      @blur="emit('validate', 'coverageType')"
    />

    <FormTextarea
      id="message"
      label="Additional Information (Optional)"
      v-model="form.message"
      :rows="4"
      :maxlength="1000"
      placeholder="Any additional questions or information you'd like to share..."
      help-text="Tell us about your specific needs or concerns"
    />

    <!-- TCPA Consent Section -->
    <div
      class="space-y-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4"
    >
      <div class="flex items-start gap-3">
        <input
          id="tcpaConsent"
          v-model="form.tcpaConsent"
          type="checkbox"
          required
          class="mt-1 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700"
        />
        <div>
          <label
            for="tcpaConsent"
            class="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Communication Consent *
          </label>
          <p class="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {{ tcpaConsentText }}
          </p>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <input
          id="emailMarketing"
          v-model="form.emailMarketingConsent"
          type="checkbox"
          class="mt-1 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700"
        />
        <div>
          <label
            for="emailMarketing"
            class="block text-sm text-zinc-700 dark:text-zinc-300"
          >
            Yes, I'd like to receive helpful tips and updates about life
            insurance (Optional)
          </label>
        </div>
      </div>
    </div>

    <!-- Licensing Disclosure -->
    <div
      class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4"
    >
      <div class="flex items-start gap-3">
        <Icon
          name="heroicons:shield-check"
          class="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
        />
        <p class="text-xs text-amber-900 dark:text-amber-100">
          {{ licensingDisclosure }}
        </p>
      </div>
    </div>

    <!-- What happens next section -->
    <div
      class="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4"
    >
      <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-3">
        What happens after you submit?
      </h3>
      <ul class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
        <li class="flex items-start gap-2">
          <Icon
            name="heroicons:check-circle"
            class="h-5 w-5 flex-shrink-0 mt-0.5"
          />
          <span>Receive instant email confirmation</span>
        </li>
        <li class="flex items-start gap-2">
          <Icon
            name="heroicons:check-circle"
            class="h-5 w-5 flex-shrink-0 mt-0.5"
          />
          <span>A licensed agent will contact you within 24 hours</span>
        </li>
        <li class="flex items-start gap-2">
          <Icon
            name="heroicons:check-circle"
            class="h-5 w-5 flex-shrink-0 mt-0.5"
          />
          <span>Review personalized quotes from top carriers</span>
        </li>
        <li class="flex items-start gap-2">
          <Icon
            name="heroicons:check-circle"
            class="h-5 w-5 flex-shrink-0 mt-0.5"
          />
          <span>Choose the best coverage for your family's needs</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  QuoteFormData,
  QuoteFormErrors,
} from '~/composables/useQuoteForm';
import FormSelect from '~/components/form/FormSelect.vue';
import FormTextarea from '~/components/form/FormTextarea.vue';

interface Props {
  form: QuoteFormData;
  errors: QuoteFormErrors;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'validate', field: keyof QuoteFormErrors): void;
}>();

const config = useRuntimeConfig();

// TCPA compliance text
const tcpaConsentText =
  'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency and our licensed agents at the contact information provided. This consent is not required as a condition of purchase. Standard message and data rates may apply. You can unsubscribe at any time.';

// Licensing disclosure
const licensingDisclosure =
  'Mowry Agency is owned by Mowry Digital Enterprise LLC. Licensed to sell life insurance products.';

const coverageTypeOptions = [
  { value: 'term-life', label: 'Term Life Insurance' },
  { value: 'whole-life', label: 'Whole Life Insurance' },
  { value: 'iul', label: 'Indexed Universal Life (IUL)' },
  { value: 'mortgage-protection', label: 'Mortgage Protection' },
  { value: 'final-expense', label: 'Final Expense Insurance' },
  { value: 'not-sure', label: 'Not Sure - Help Me Decide' },
];
</script>
