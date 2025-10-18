<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormInput
        id="firstName"
        label="First Name"
        v-model="form.firstName"
        :error="errors.firstName"
        :required="true"
        autocomplete="given-name"
        @blur="emit('validate', 'firstName')"
      />

      <FormInput
        id="lastName"
        label="Last Name"
        v-model="form.lastName"
        :error="errors.lastName"
        :required="true"
        autocomplete="family-name"
        @blur="emit('validate', 'lastName')"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormInput
        id="email"
        label="Email Address"
        type="email"
        v-model="form.email"
        :error="errors.email"
        :required="true"
        autocomplete="email"
        help-text="We'll send your quote details here"
        @blur="emit('validate', 'email')"
      />

      <FormInput
        id="phone"
        label="Phone Number"
        type="tel"
        v-model="form.phone"
        :error="errors.phone"
        :required="true"
        autocomplete="tel"
        placeholder="(555) 123-4567"
        help-text="We'll call you to discuss your quote"
        @blur="emit('validate', 'phone')"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormInput
        id="dateOfBirth"
        label="Date of Birth"
        type="date"
        v-model="form.dateOfBirth"
        :error="errors.dateOfBirth"
        :required="true"
        :max="maxDate"
        autocomplete="bday"
        help-text="Must be 18 years or older"
        @blur="emit('validate', 'dateOfBirth')"
      />

      <FormSelect
        id="sex"
        label="Sex"
        v-model="form.sex"
        :options="sexOptions"
        :error="errors.sex"
        :required="true"
        placeholder="Select sex"
        help-text="Required for accurate quotes"
        @blur="emit('validate', 'sex')"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormInput
        id="city"
        label="City"
        v-model="form.city"
        :error="errors.city"
        :required="true"
        autocomplete="address-level2"
        @blur="emit('validate', 'city')"
      />

      <FormInput
        id="state"
        label="State"
        v-model="form.state"
        :error="errors.state"
        :required="true"
        autocomplete="address-level1"
        placeholder="e.g., CA, TX, NY"
        @blur="emit('validate', 'state')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  QuoteFormData,
  QuoteFormErrors,
} from '~/composables/useQuoteForm';
import FormInput from '~/components/form/FormInput.vue';
import FormSelect from '~/components/form/FormSelect.vue';

interface Props {
  form: QuoteFormData;
  errors: QuoteFormErrors;
  maxDate: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'validate', field: keyof QuoteFormErrors): void;
}>();

const sexOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
</script>
