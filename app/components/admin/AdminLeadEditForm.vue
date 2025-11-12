<template>
  <div class="space-y-8">
    <!-- Form Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Edit Lead Information
        </h3>
        <p
          class="mt-1 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2"
        >
          Update the lead's personal and insurance information.
          <span
            v-if="isValidating"
            class="inline-flex items-center text-xs text-blue-600 dark:text-blue-400"
          >
            <svg
              class="animate-spin -ml-1 mr-1 h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Validating...
          </span>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <UButton
          v-if="isDirty"
          variant="outline"
          size="sm"
          @click="resetForm"
          :disabled="isSubmitting"
        >
          Reset Changes
        </UButton>
        <UButton
          variant="soft"
          size="sm"
          @click="$emit('cancel')"
          :disabled="isSubmitting"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          size="sm"
          @click="handleSubmit"
          :loading="isSubmitting"
          :disabled="!isDirty || !isFormValid"
        >
          Save Changes
        </UButton>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="submitStatus === 'success'" class="mb-6">
      <div class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
        <div class="flex">
          <div class="shrink-0">
            <svg
              class="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">
              Lead information updated successfully!
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="submitStatus === 'error'" class="mb-6">
      <div class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800 dark:text-red-200">
              {{
                submitError ||
                'Failed to update lead information. Please try again.'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Fields -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Personal Information Section -->
      <div>
        <h4 class="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-4">
          Personal Information
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            id="first_name"
            label="First Name"
            v-model="form.first_name"
            :error="errors.first_name"
            :required="true"
            @blur="validateField('first_name')"
          />

          <FormInput
            id="last_name"
            label="Last Name"
            v-model="form.last_name"
            :error="errors.last_name"
            :required="true"
            @blur="validateField('last_name')"
          />

          <FormInput
            id="email"
            label="Email Address"
            type="email"
            v-model="form.email"
            :error="errors.email"
            :required="true"
            autocomplete="email"
            @blur="validateField('email')"
          />

          <FormInput
            id="phone"
            label="Phone Number"
            type="tel"
            v-model="form.phone"
            :error="errors.phone"
            :required="true"
            placeholder="555-123-4567"
            autocomplete="tel"
            @blur="validateField('phone')"
          />

          <FormInput
            id="date_of_birth"
            label="Date of Birth"
            type="date"
            v-model="form.date_of_birth"
            :error="errors.date_of_birth"
            :required="true"
            :max="maxDate"
            @blur="validateField('date_of_birth')"
          />

          <FormSelect
            id="sex"
            label="Sex"
            v-model="form.sex"
            :options="sexOptions"
            :error="errors.sex"
            :required="true"
            @blur="validateField('sex')"
          />
        </div>
      </div>

      <!-- Location Information -->
      <div>
        <h4 class="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-4">
          Location Information
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            id="city"
            label="City"
            v-model="form.city"
            :error="errors.city"
            :required="true"
            @blur="validateField('city')"
          />

          <FormSelect
            id="state"
            label="State"
            v-model="form.state"
            :options="stateOptions"
            :error="errors.state"
            :required="true"
            @blur="validateField('state')"
          />
        </div>
      </div>

      <!-- Physical Information -->
      <div>
        <h4 class="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-4">
          Physical Information
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            id="height"
            label="Height (feet.inches)"
            type="number"
            v-model="form.height"
            :error="errors.height"
            :required="true"
            step="0.1"
            min="3.0"
            max="8.0"
            placeholder="5.8"
            help-text="e.g., 5.8 for 5'8&quot;"
            @blur="validateField('height')"
          />

          <FormInput
            id="weight"
            label="Weight (lbs)"
            type="number"
            v-model="form.weight"
            :error="errors.weight"
            :required="true"
            :min="50"
            :max="500"
            placeholder="180"
            @blur="validateField('weight')"
          />
        </div>
      </div>

      <!-- Insurance Information -->
      <div>
        <h4 class="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-4">
          Insurance Information
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            id="coverage_type"
            label="Coverage Type"
            v-model="form.coverage_type"
            :options="coverageTypeOptions"
            :error="errors.coverage_type"
            :required="true"
            @blur="validateField('coverage_type')"
          />

          <FormInput
            id="loan_amount"
            label="Loan Amount"
            type="number"
            :model-value="form.loan_amount === null ? '' : form.loan_amount"
            @update:model-value="
              (value: string | number) =>
                (form.loan_amount = !value ? null : parseFloat(String(value)))
            "
            :error="errors.loan_amount"
            :min="0"
            step="1000"
            placeholder="100000"
            @blur="validateField('loan_amount')"
          />

          <FormSelect
            id="status"
            label="Lead Status"
            v-model="form.status"
            :options="statusOptions"
            :error="errors.status"
            :required="true"
            @blur="validateField('status')"
          />
        </div>
      </div>

      <!-- Health Information -->
      <div>
        <h4 class="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-4">
          Health Information
        </h4>
        <div class="space-y-6">
          <FormTextarea
            id="health_conditions"
            label="Health Conditions"
            v-model="form.health_conditions"
            :error="errors.health_conditions"
            :rows="3"
            :maxlength="500"
            help-text="List any current health conditions or concerns"
            @blur="validateField('health_conditions')"
          />

          <FormTextarea
            id="current_medications"
            label="Current Medications"
            v-model="form.current_medications"
            :error="errors.current_medications"
            :rows="3"
            :maxlength="500"
            help-text="List any medications currently being taken"
            @blur="validateField('current_medications')"
          />
        </div>
      </div>

      <!-- Hidden submit button for form validation -->
      <button type="submit" class="hidden" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn, watchDebounced } from '@vueuse/core';
import { useStatesData } from '~/composables/useCitiesData';
import { useLeadEditValidation } from '~/composables/useJoiValidation';
import type { Database } from '~/types/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];

interface Props {
  lead: Lead;
}

interface Emits {
  (e: 'success', updatedLead: Lead): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Initialize Joi validation
const joiValidation = useLeadEditValidation();

// Form state - create explicit interface for form data
interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  sex: string;
  city: string;
  state: string;
  height: string;
  weight: string;
  coverage_type: string;
  loan_amount: string | number | null;
  status: string;
  health_conditions: string;
  current_medications: string;
}

const form = ref<FormData>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  sex: '',
  city: '',
  state: '',
  height: '',
  weight: '',
  coverage_type: '',
  loan_amount: null,
  status: 'new',
  health_conditions: '',
  current_medications: '',
});

const originalData = ref<FormData>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  sex: '',
  city: '',
  state: '',
  height: '',
  weight: '',
  coverage_type: '',
  loan_amount: null,
  status: 'new',
  health_conditions: '',
  current_medications: '',
});

// Use Joi validation errors
const errors = computed(() => joiValidation.errors.value);
const isSubmitting = ref(false);
const submitStatus = ref<'idle' | 'success' | 'error'>('idle');
const submitError = ref<string | null>(null);
const isValidating = ref(false);

// Height conversion utility - converts feet.decimal (e.g., 5.8) to total inches
const feetDecimalToInches = (feetDecimal: string): number => {
  if (!feetDecimal) return 0;
  const num = parseFloat(feetDecimal);
  if (Number.isNaN(num)) return 0;

  const feet = Math.floor(num);
  const inches = Math.round((num - feet) * 10); // Get decimal part as inches (0.8 = 8 inches)
  return feet * 12 + inches;
};

// Initialize form with lead data

// Initialize form with lead data
const initializeForm = () => {
  const leadData: FormData = {
    first_name: props.lead.first_name || '',
    last_name: props.lead.last_name || '',
    email: props.lead.email || '',
    phone: props.lead.phone || '',
    date_of_birth: props.lead.date_of_birth || '',
    sex: props.lead.sex || '',
    city: props.lead.city || '',
    state: props.lead.state || '',
    height: props.lead.height ? String(props.lead.height) : '',
    weight: String(props.lead.weight || ''),
    coverage_type: props.lead.coverage_type || '',
    loan_amount: props.lead.loan_amount || null,
    status: props.lead.status || 'new',
    health_conditions: props.lead.health_conditions || '',
    current_medications: props.lead.current_medications || '',
  };

  form.value = { ...leadData };
  originalData.value = { ...leadData };
};

// Initialize form when component mounts
onMounted(() => {
  initializeForm();
});

// Watch for prop changes
watch(
  () => props.lead,
  () => {
    initializeForm();
  },
  { deep: true },
);

// Debounced validation for all form fields
// This watches the entire form object and validates changed fields
watchDebounced(
  form,
  (newForm, oldForm) => {
    if (!oldForm) return; // Skip initial load

    // Check which fields have changed and validate them
    const changedFields: string[] = [];

    Object.keys(newForm).forEach((key) => {
      if (newForm[key as keyof FormData] !== oldForm[key as keyof FormData]) {
        changedFields.push(key);
      }
    });

    // Validate only the changed fields
    changedFields.forEach((fieldName) => {
      validateFieldDebounced(fieldName);
    });
  },
  { debounce: 300, maxWait: 1000, deep: true },
);

// Computed properties
const isDirty = computed(() => {
  return Object.keys(form.value).some((key) => {
    const formValue = form.value[key as keyof typeof form.value];
    const originalValue = originalData.value[key as keyof typeof originalData.value];
    return formValue !== originalValue;
  });
});

const isFormValid = computed(() => {
  return Object.values(errors.value).every((error) => !error);
});

// Form options
const sexOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const statusOptions = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Converted', value: 'converted' },
  { label: 'Lost', value: 'lost' },
  { label: 'Closed', value: 'closed' },
  { label: 'Not Interested', value: 'not_interested' },
];

const coverageTypeOptions = [
  { label: 'Term Life Insurance', value: 'term-life' },
  { label: 'Whole Life Insurance', value: 'whole-life' },
  { label: 'Indexed Universal Life (IUL)', value: 'iul' },
  { label: 'Mortgage Protection', value: 'mortgage-protection' },
  { label: 'Final Expense Insurance', value: 'final-expense' },
  { label: 'Not Sure', value: 'not-sure' },
];

// Use the states data composable for state options
const { states } = useStatesData();
const stateOptions = computed(() =>
  states.map((state) => ({ label: state.displayName, value: state.code })),
);

// Date constraints
const today = new Date();
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  .toISOString()
  .split('T')[0];

// Immediate validation function using Joi (for blur events)
const validateFieldImmediate = (fieldName: string) => {
  isValidating.value = true;

  const value = form.value[fieldName as keyof typeof form.value];

  // Prepare data for Joi validation (convert to proper types)
  let dataToValidate: string | number | null = value;

  if (fieldName === 'height' || fieldName === 'weight') {
    // Convert string to number for Joi validation
    dataToValidate = value ? parseFloat(value as string) : null;
  }

  // Validate using Joi
  joiValidation.validateField(fieldName, dataToValidate);

  setTimeout(() => {
    isValidating.value = false;
  }, 50);
};

// Debounced validation function (300ms delay) with loading state
const validateFieldDebounced = useDebounceFn((fieldName: string) => {
  isValidating.value = true;
  validateFieldImmediate(fieldName);
  // Clear validation state after a short delay
  setTimeout(() => {
    isValidating.value = false;
  }, 50);
}, 300);

// Main validation function that uses immediate validation
const validateField = validateFieldImmediate;

// Validate all fields
const validateAllFields = () => {
  const fieldsToValidate = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'date_of_birth',
    'sex',
    'city',
    'state',
    'height',
    'weight',
    'coverage_type',
    'status',
  ];

  fieldsToValidate.forEach((field) => {
    validateField(field);
  });

  // Also validate loan_amount if it has a value
  if (form.value.loan_amount !== null && form.value.loan_amount !== undefined) {
    validateField('loan_amount');
  }
};

// Reset form to original values
const resetForm = () => {
  form.value = { ...originalData.value };
  joiValidation.clearErrors(); // Clear Joi validation errors
  submitStatus.value = 'idle';
  submitError.value = null;
};

// Handle form submission
const handleSubmit = async () => {
  if (isSubmitting.value || !isDirty.value) return;

  // Validate all fields before submission
  validateAllFields();

  if (!isFormValid.value) {
    submitStatus.value = 'error';
    submitError.value = 'Please fix the validation errors before submitting.';
    return;
  }

  try {
    isSubmitting.value = true;
    submitStatus.value = 'idle';
    submitError.value = null;

    // Prepare the update data - convert form data to database format
    interface UpdateData {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      date_of_birth: string;
      sex: string;
      city: string;
      state: string;
      height: number | null;
      weight: number | null;
      coverage_type: string;
      health_conditions: string;
      current_medications: string;
      status: string;
      loan_amount: number | null;
    }

    const updateData: UpdateData = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      phone: form.value.phone,
      date_of_birth: form.value.date_of_birth,
      sex: form.value.sex?.toLowerCase(), // Convert to lowercase for validation
      city: form.value.city,
      state: form.value.state,
      height: form.value.height ? parseFloat(form.value.height) : null,
      weight: form.value.weight ? parseFloat(form.value.weight) : null,
      coverage_type: form.value.coverage_type,
      health_conditions: form.value.health_conditions,
      current_medications: form.value.current_medications,
      status: form.value.status,
      loan_amount: form.value.loan_amount ? parseFloat(String(form.value.loan_amount)) : null,
    };

    const response = await fetch(`/api/leads/${props.lead.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const result = (await response.json()) as {
      success: boolean;
      data: Lead;
      message?: string;
    };

    if (result.success) {
      submitStatus.value = 'success';
      originalData.value = { ...form.value };

      // Emit success event with updated lead data
      emit('success', result.data);

      // Clear success message after 3 seconds
      setTimeout(() => {
        if (submitStatus.value === 'success') {
          submitStatus.value = 'idle';
        }
      }, 3000);
    } else {
      throw new Error(result.message || 'Failed to update lead');
    }
  } catch (error) {
    console.error('Error updating lead:', error);
    submitStatus.value = 'error';
    submitError.value =
      error instanceof Error ? error.message : 'Failed to update lead information';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
