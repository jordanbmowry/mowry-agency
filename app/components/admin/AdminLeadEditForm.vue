<template>
  <div class="space-y-8">
    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Personal Information Section -->
      <div class="space-y-6">
        <h4
          class="text-base font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Personal Information
        </h4>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- First Name -->
          <FormInput
            id="first_name"
            label="First Name"
            type="text"
            v-model="formData.first_name"
            :error="getFieldError('first_name')"
            :required="true"
            autocomplete="given-name"
            @blur="validateField('first_name')"
          />

          <!-- Last Name -->
          <FormInput
            id="last_name"
            label="Last Name"
            type="text"
            v-model="formData.last_name"
            :error="getFieldError('last_name')"
            :required="true"
            autocomplete="family-name"
            @blur="validateField('last_name')"
          />

          <!-- Email -->
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            v-model="formData.email"
            :error="getFieldError('email')"
            :required="true"
            autocomplete="email"
            @blur="validateField('email')"
          />

          <!-- Phone -->
          <FormInput
            id="phone"
            label="Phone Number"
            type="tel"
            v-model="formData.phone"
            :error="getFieldError('phone')"
            :required="true"
            autocomplete="tel"
            placeholder="(555) 123-4567"
            help-text="Enter 10-digit phone number"
            @blur="validateField('phone')"
          />

          <!-- Date of Birth -->
          <FormInput
            id="date_of_birth"
            label="Date of Birth"
            type="date"
            v-model="formData.date_of_birth"
            :error="getFieldError('date_of_birth')"
            :required="true"
            :max="maxDate"
            @blur="validateField('date_of_birth')"
          />

          <!-- Sex -->
          <FormSelect
            id="sex"
            label="Sex"
            v-model="formData.sex"
            :options="sexOptions"
            :error="getFieldError('sex')"
            :required="true"
            @blur="validateField('sex')"
          />
        </div>

        <!-- Location -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormInput
            id="city"
            label="City"
            type="text"
            v-model="formData.city"
            :error="getFieldError('city')"
            :required="true"
            @blur="validateField('city')"
          />

          <FormSelect
            id="state"
            label="State"
            v-model="formData.state"
            :options="stateOptions"
            :error="getFieldError('state')"
            :required="true"
            @blur="validateField('state')"
          />
        </div>

        <!-- Physical Information -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormInput
            id="height"
            label="Height"
            type="number"
            step="0.1"
            min="3.0"
            max="8.0"
            v-model="formData.height"
            :error="getFieldError('height')"
            :required="true"
            help-text="Enter in feet.decimal format (e.g., 5.8 for 5 feet 8 inches)"
            @blur="validateField('height')"
          />

          <FormInput
            id="weight"
            label="Weight (lbs)"
            type="number"
            min="50"
            max="500"
            v-model="formData.weight"
            :error="getFieldError('weight')"
            :required="true"
            @blur="validateField('weight')"
          />
        </div>
      </div>

      <!-- Insurance Information Section -->
      <div class="space-y-6">
        <h4
          class="text-base font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Insurance Information
        </h4>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormSelect
            id="coverage_type"
            label="Coverage Type"
            v-model="formData.coverage_type"
            :options="coverageTypeOptions"
            :error="getFieldError('coverage_type')"
            :required="true"
            @blur="validateField('coverage_type')"
          />

          <FormInput
            id="loan_amount"
            label="Loan Amount"
            type="number"
            min="0"
            step="1000"
            :model-value="formData.loan_amount || ''"
            @update:model-value="
              (value) => (formData.loan_amount = value || '')
            "
            :error="getFieldError('loan_amount')"
            help-text="Optional - existing loan amount"
            @blur="validateField('loan_amount')"
          />

          <!-- Health Information Textareas - Span Full Width -->
          <div class="lg:col-span-2 space-y-6">
            <FormTextarea
              id="health_conditions"
              label="Health Conditions"
              v-model="formData.health_conditions"
              :error="getFieldError('health_conditions')"
              :rows="6"
              size="xl"
              help-text="List any relevant health conditions"
              @blur="validateField('health_conditions')"
            />

            <FormTextarea
              id="medications"
              label="Medications"
              v-model="formData.medications"
              :error="getFieldError('medications')"
              :rows="6"
              size="xl"
              help-text="List any current medications"
              @blur="validateField('medications')"
            />

            <FormTextarea
              id="message"
              label="Message"
              v-model="formData.message"
              :error="getFieldError('message')"
              :rows="6"
              size="xl"
              help-text="Additional message from the customer"
              @blur="validateField('message')"
            />
          </div>
        </div>
      </div>

      <!-- Admin Information Section -->
      <div class="space-y-6">
        <h4
          class="text-base font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Admin Information
        </h4>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormSelect
            id="status"
            label="Status"
            v-model="formData.status"
            :options="statusOptions"
            :error="getFieldError('status')"
            :required="true"
            @blur="validateField('status')"
          />
        </div>
      </div>

      <!-- Form Actions -->
      <div
        class="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-700"
      >
        <div class="flex items-center gap-4">
          <div
            v-if="submitStatus === 'success'"
            class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Lead updated successfully!
          </div>

          <div
            v-if="submitStatus === 'error'"
            class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ submitError || 'An error occurred while updating the lead.' }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <UButton
            type="submit"
            :disabled="isSubmitting || !isDirty || hasErrors"
            :loading="isSubmitting"
            color="neutral"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </UButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useDebounceFn, watchDebounced } from '@vueuse/core';
import {
  useJoiValidation,
  type LeadFormData,
} from '~/composables/useJoiValidation';
import type { Database } from '~/types/database.types';
import FormInput from '~/components/form/FormInput.vue';
import FormSelect from '~/components/form/FormSelect.vue';
import FormTextarea from '~/components/form/FormTextarea.vue';
import { useStatesData } from '~/composables/useCitiesData';

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

// Height conversion utilities
const inchesToFeetDecimal = (height: string | number | null): string => {
  if (height === null || height === undefined) return '';
  return String(height);
};

// Initialize Joi validation
const {
  errors,
  isValidating,
  validateField: joiValidateField,
  validateForm,
  clearErrors,
  getFieldError,
  hasErrors,
} = useJoiValidation();

// Form state with reactive data
const formData = ref<LeadFormData>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  sex: 'male',
  city: '',
  state: '',
  height: '',
  weight: '',
  coverage_type: '',
  status: 'new',
  health_conditions: '',
  medications: '',
  loan_amount: '',
  message: '',
});

// Track original values for dirty checking
const originalData = ref<LeadFormData>({ ...formData.value });

// Form options
const sexOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const statusOptions = [
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Quoted', value: 'quoted' },
  { label: 'Closed', value: 'closed' },
];

const coverageTypeOptions = [
  { label: 'Term Life Insurance', value: 'term-life' },
  { label: 'Whole Life Insurance', value: 'whole-life' },
  { label: 'Universal Life Insurance', value: 'universal-life' },
  { label: 'Final Expense Insurance', value: 'final-expense' },
  { label: 'Disability Insurance', value: 'disability' },
  { label: 'Not Sure', value: 'not-sure' },
  { label: 'Other', value: 'other' },
];

// Use the states data composable for state options
const { states } = useStatesData();
const stateOptions = computed(() =>
  states.map((state) => ({ label: state.displayName, value: state.code }))
);

// Date constraints
const today = new Date();
const maxDate = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
)
  .toISOString()
  .split('T')[0];

// Function to sanitize lead data
const sanitizeLeadData = (lead: Lead): LeadFormData => {
  const validStatuses = statusOptions.map((opt) => opt.value);
  const validCoverageTypes = coverageTypeOptions.map((opt) => opt.value);
  const validSexOptions = sexOptions.map((opt) => opt.value);

  return {
    first_name: lead.first_name || '',
    last_name: lead.last_name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    date_of_birth: lead.date_of_birth || '',
    sex: validSexOptions.includes(lead.sex as string)
      ? (lead.sex as 'male' | 'female' | 'other')
      : 'male',
    city: lead.city || '',
    state: lead.state || '',
    height: inchesToFeetDecimal(lead.height),
    weight: lead.weight?.toString() || '',
    coverage_type: validCoverageTypes.includes(lead.coverage_type as string)
      ? lead.coverage_type || ''
      : '',
    loan_amount: lead.loan_amount?.toString() || '',
    status: validStatuses.includes(lead.status as string)
      ? (lead.status as
          | 'new'
          | 'in_progress'
          | 'contacted'
          | 'quoted'
          | 'closed')
      : 'new',
    health_conditions: lead.health_conditions || '',
    medications: (lead as any).current_medications || '',
    message: lead.message || '',
  };
};

const isSubmitting = ref(false);
const submitStatus = ref<'idle' | 'success' | 'error'>('idle');
const submitError = ref<string | null>(null);

// Initialize form with lead data
const initializeForm = () => {
  const sanitizedData = sanitizeLeadData(props.lead);
  formData.value = { ...sanitizedData };
  originalData.value = { ...sanitizedData };
  clearErrors();
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
  { deep: true }
);

// Debounced validation function
const validateFieldDebounced = useDebounceFn(async (fieldName: string) => {
  if (fieldName !== 'changed') {
    joiValidateField(
      fieldName,
      formData.value[fieldName as keyof LeadFormData]
    );
  }
}, 300);

// Watch form values for validation
watchDebounced(
  formData,
  async (newValues, oldValues) => {
    if (!oldValues) return; // Skip initial load

    // Check which fields have changed
    const changedFields: string[] = [];
    Object.keys(newValues).forEach((key) => {
      if (
        newValues[key as keyof typeof newValues] !==
        oldValues[key as keyof typeof oldValues]
      ) {
        changedFields.push(key);
      }
    });

    // Validate changed fields
    if (changedFields.length > 0) {
      changedFields.forEach((field) => {
        joiValidateField(field, newValues[field as keyof LeadFormData]);
      });
    }
  },
  { debounce: 300, maxWait: 1000, deep: true }
);

// Computed properties
const isDirty = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(originalData.value);
});

const isFormValid = computed(() => !hasErrors.value);

// Validation function for blur events
const validateField = async (fieldName: string) => {
  joiValidateField(fieldName, formData.value[fieldName as keyof LeadFormData]);
};

// Reset form to original values
const resetFormToOriginal = () => {
  initializeForm();
  submitStatus.value = 'idle';
  submitError.value = null;
};

// Handle form submission
const handleSubmit = async () => {
  if (isSubmitting.value || !isDirty.value) return;

  // Validate all fields before submission
  const validationResult = validateForm(formData.value);

  if (!validationResult.isValid) {
    submitStatus.value = 'error';
    submitError.value = 'Please fix the validation errors before submitting.';
    return;
  }

  try {
    isSubmitting.value = true;
    submitStatus.value = 'idle';
    submitError.value = null;

    // Prepare the update data
    const updateData = { ...formData.value };

    // Clean phone number - keep only digits for validation
    if (updateData.phone) {
      updateData.phone = updateData.phone.replace(/\D/g, '');
    }

    // Sex should already be lowercase from the form options, but ensure it's valid
    if (
      updateData.sex &&
      !['male', 'female', 'other'].includes(updateData.sex)
    ) {
      updateData.sex = 'male'; // Default fallback
    }

    // Height is already in the correct feet.decimal format for the database
    if (updateData.height) {
      updateData.height = String(parseFloat(String(updateData.height)));
    }

    // Weight should be stored as string in database
    if (updateData.weight) {
      updateData.weight = String(updateData.weight);
    }

    // Map form field names to database column names
    const dbData = {
      ...updateData,
      current_medications: updateData.medications, // Map medications to current_medications
    };

    // Remove the form field name to avoid column conflicts
    delete (dbData as any).medications;

    const response = await fetch(`/api/leads/${props.lead.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dbData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update lead');
    }

    const updatedLead = await response.json();

    submitStatus.value = 'success';

    // Update original data to reflect the saved state
    originalData.value = { ...formData.value };

    // Emit success event
    emit('success', updatedLead);

    // Clear success message after 3 seconds
    setTimeout(() => {
      if (submitStatus.value === 'success') {
        submitStatus.value = 'idle';
      }
    }, 3000);
  } catch (error) {
    console.error('Error updating lead:', error);
    submitStatus.value = 'error';
    submitError.value =
      error instanceof Error ? error.message : 'An unexpected error occurred';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
