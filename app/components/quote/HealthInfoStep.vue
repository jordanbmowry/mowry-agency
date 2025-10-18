<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormInput
        id="height"
        label="Height (inches)"
        type="number"
        v-model="form.height"
        :error="errors.height"
        :required="true"
        min="36"
        max="96"
        step="1"
        placeholder="e.g., 68"
        help-text="36-96 inches"
        @blur="emit('validate', 'height')"
      />

      <FormInput
        id="weight"
        label="Weight (lbs)"
        type="number"
        v-model="form.weight"
        :error="errors.weight"
        :required="true"
        min="50"
        max="500"
        step="1"
        placeholder="e.g., 150"
        help-text="50-500 pounds"
        @blur="emit('validate', 'weight')"
      />
    </div>

    <FormTextarea
      id="healthConditions"
      label="Health Conditions"
      v-model="form.healthConditions"
      :error="errors.healthConditions"
      :required="true"
      :rows="4"
      :maxlength="500"
      placeholder="Please describe any existing health conditions (e.g., diabetes, high blood pressure, etc.) or write 'None' if you have no known health conditions"
      help-text="Be as specific as possible for accurate quotes"
      @blur="emit('validate', 'healthConditions')"
    />

    <FormTextarea
      id="medications"
      label="Current Medications"
      v-model="form.medications"
      :error="errors.medications"
      :required="true"
      :rows="4"
      :maxlength="500"
      placeholder="List all current medications with dosages, or write 'None' if not taking any medications"
      help-text="Include prescription and over-the-counter medications"
      @blur="emit('validate', 'medications')"
    />

    <div
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
    >
      <div class="flex items-start gap-3">
        <Icon
          name="heroicons:information-circle"
          class="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
        />
        <div class="text-sm text-blue-800 dark:text-blue-200">
          <p class="font-semibold mb-1">Why do we need this information?</p>
          <p>
            Your health information helps us provide accurate life insurance
            quotes. All information is kept confidential and used only for quote
            purposes.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  QuoteFormData,
  QuoteFormErrors,
} from '~/composables/useQuoteForm';
import FormInput from '~/components/form/FormInput.vue';
import FormTextarea from '~/components/form/FormTextarea.vue';

interface Props {
  form: QuoteFormData;
  errors: QuoteFormErrors;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'validate', field: keyof QuoteFormErrors): void;
}>();
</script>
