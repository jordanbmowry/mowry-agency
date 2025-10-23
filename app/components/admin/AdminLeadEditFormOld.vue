<template>
  <div class="space-y-8">
    <!-- Form Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Edit Lead Information
        </h3>
        <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
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
          @click="resetFormToOriginal"
          :disabled="isSubmitting"
        >
          Reset Changes
        </UButton>
        <UButton
          variant="soft"
          size="sm"
          @click="emit('cancel')"
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
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
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
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800 dark:text-red-200">
              {{ submitError || "Failed to update lead information. Please try again." }}
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
            type="text"
            v-model="formData.first_name"
            :error="getFieldError('first_name')"
            :required="true"
            autocomplete="given-name"
            @blur="validateField('first_name')"
          />

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

          <FormInput
            id="email"
            label="Email Address"
            type="email"
            v-model="values.email"
            :error="errors.email"
            :required="true"
            placeholder="john.doe@example.com"
            autocomplete="email"
            @blur="validateField('email')"
            @update:model-value="(value) => setFieldValue('email', String(value))"
          />

          <FormInput
            id="phone"
            label="Phone Number"
            type="tel"
            v-model="values.phone"
            :error="errors.phone"
            :required="true"
            placeholder="555-123-4567"
            autocomplete="tel"
            @blur="validateField('phone')"
            @update:model-value="(value) => setFieldValue('phone', String(value))"
          />

          <FormInput
            id="date_of_birth"
            label="Date of Birth"
            type="date"
            v-model="values.date_of_birth"
            :error="errors.date_of_birth"
            :required="true"
            :max="maxDate"
            @blur="validateField('date_of_birth')"
            @update:model-value="(value) => setFieldValue('date_of_birth', String(value))"
          />

          <FormSelect
            id="sex"
            label="Sex"
            :model-value="values.sex"
            :options="sexOptions"
            :error="errors.sex"
            :required="true"
            @blur="validateField('sex')"
            @update:model-value="
              (value) => setFieldValue('sex', value as 'Male' | 'Female')
            "
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
            v-model="values.city"
            :error="errors.city"
            :required="true"
            @blur="validateField('city')"
            @update:model-value="(value) => setFieldValue('city', String(value))"
          />

          <FormSelect
            id="state"
            label="State"
            :model-value="values.state"
            :options="stateOptions"
            :error="errors.state"
            :required="true"
            @blur="validateField('state')"
            @update:model-value="(value) => setFieldValue('state', String(value))"
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
            v-model="values.height"
            :error="errors.height"
            :required="true"
            step="0.1"
            min="3.0"
            max="8.0"
            placeholder="5.8"
            help-text="e.g., 5.8 for 5'8&quot;"
            @blur="validateField('height')"
            @update:model-value="(value) => setFieldValue('height', String(value))"
          />

          <FormInput
            id="weight"
            label="Weight (lbs)"
            type="number"
            v-model="values.weight"
            :error="errors.weight"
            :required="true"
            :min="50"
            :max="500"
            placeholder="180"
            @blur="validateField('weight')"
            @update:model-value="(value) => setFieldValue('weight', String(value))"
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
            :model-value="values.coverage_type"
            :options="coverageTypeOptions"
            :error="errors.coverage_type"
            :required="true"
            @blur="validateField('coverage_type')"
            @update:model-value="(value) => setFieldValue('coverage_type', String(value))"
          />

          <FormInput
            id="loan_amount"
            label="Loan Amount"
            type="number"
            :model-value="values.loan_amount || ''"
            @update:model-value="
              (value) => setFieldValue('loan_amount', value ? Number(value) : null)
            "
            :error="errors.loan_amount"
            :min="0"
            placeholder="100000"
            @blur="validateField('loan_amount')"
          />

          <FormSelect
            id="status"
            label="Lead Status"
            :model-value="values.status"
            :options="statusOptions"
            :error="errors.status"
            :required="true"
            @blur="validateField('status')"
            @update:model-value="
              (value) =>
                setFieldValue(
                  'status',
                  value as
                    | 'new'
                    | 'contacted'
                    | 'quoted'
                    | 'closed'
                    | 'in_progress'
                )
            "
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
            v-model="values.health_conditions"
            :error="errors.health_conditions"
            :rows="3"
            :maxlength="500"
            help-text="List any current health conditions or concerns"
            @blur="validateField('health_conditions')"
            @update:model-value="
              (value) => setFieldValue('health_conditions', String(value))
            "
          />

          <FormTextarea
            id="medications"
            label="Current Medications"
            v-model="values.medications"
            :error="errors.medications"
            :rows="3"
            :maxlength="500"
            help-text="List any medications currently being taken"
            @blur="validateField('medications')"
            @update:model-value="(value) => setFieldValue('medications', String(value))"
          />
        </div>
      </div>

      <!-- Hidden submit button for form validation -->
      <button type="submit" class="hidden" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useDebounceFn, watchDebounced } from "@vueuse/core";
import { useJoiValidation, type LeadFormData } from "~/composables/useJoiValidation";
import type { Database } from "~/types/database.types";
import FormInput from "~/components/form/FormInput.vue";
import FormSelect from "~/components/form/FormSelect.vue";
import FormTextarea from "~/components/form/FormTextarea.vue";
import { useStatesData } from "~/composables/useCitiesData";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

interface Props {
  lead: Lead;
}

interface Emits {
  (e: "success", updatedLead: Lead): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Height conversion utilities
const inchesToFeetDecimal = (height: string | number | null): string => {
  // The database already stores height in feet.decimal format (e.g., 5.8 for 5'8")
  // So we just need to convert to string if it's a number
  if (height === null || height === undefined) return "";
  return String(height);
};

const feetDecimalToInches = (feetDecimal: string): number => {
  // Convert feet.decimal format (like "5.8") to the same decimal format for database
  if (!feetDecimal) return 0;
  const num = parseFloat(feetDecimal);
  if (isNaN(num) || num <= 0) return 0;
  return num; // Return as-is since database expects feet.decimal format
};

// Initialize Joi validation
const { 
  errors, 
  isValidating, 
  validateField: joiValidateField, 
  validateForm, 
  clearErrors, 
  getFieldError, 
  hasErrors 
} = useJoiValidation();

// Form state with reactive data
const formData = ref<LeadFormData>({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  sex: "Male",
  city: "",
  state: "",
  height: "",
  weight: "",
  coverage_type: "",
  status: "new",
  health_conditions: "",
  medications: "",
  loan_amount: null,
});

// Track original values for dirty checking
const originalData = ref<LeadFormData>({ ...formData.value });

// Function to sanitize lead data to ensure values match available options
const sanitizeLeadData = (lead: Lead): LeadFormData => {
  const validStatuses = statusOptions.map((opt) => opt.value);
  const validCoverageTypes = coverageTypeOptions.map((opt) => opt.value);
  const validSexOptions = sexOptions.map((opt) => opt.value);

  return {
    first_name: lead.first_name || "",
    last_name: lead.last_name || "",
    email: lead.email || "",
    phone: lead.phone || "",
    date_of_birth: lead.date_of_birth || "",
    sex: validSexOptions.includes(lead.sex as string)
      ? (lead.sex as "Male" | "Female")
      : "Male",
    city: lead.city || "",
    state: lead.state || "",
    height: inchesToFeetDecimal(lead.height),
    weight: lead.weight?.toString() || "",
    coverage_type: validCoverageTypes.includes(lead.coverage_type as string)
      ? lead.coverage_type || ""
      : "",
    loan_amount: lead.loan_amount || null,
    status: validStatuses.includes(lead.status as string)
      ? (lead.status as "new" | "in_progress" | "contacted" | "quoted" | "closed")
      : "new",
    health_conditions: lead.health_conditions || "",
    medications: lead.medications || "",
  };
};

const isSubmitting = ref(false);
const submitStatus = ref<"idle" | "success" | "error">("idle");
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
  if (fieldName !== "changed") {
    joiValidateField(fieldName, formData.value[fieldName as keyof LeadFormData]);
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
      changedFields.forEach(field => {
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

// Form options
const sexOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const statusOptions = [
  { label: "New", value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "Contacted", value: "contacted" },
  { label: "Quoted", value: "quoted" },
  { label: "Closed", value: "closed" },
];

const coverageTypeOptions = [
  { label: "Term Life Insurance", value: "term-life" },
  { label: "Whole Life Insurance", value: "whole-life" },
  { label: "Universal Life Insurance", value: "universal-life" },
  { label: "Final Expense Insurance", value: "final-expense" },
  { label: "Disability Insurance", value: "disability" },
  { label: "Not Sure", value: "not-sure" },
  { label: "Other", value: "other" },
];

// Use the states data composable for state options
const { states } = useStatesData();
const stateOptions = computed(() =>
  states.map((state) => ({ label: state.displayName, value: state.code }))
);

// Date constraints
const today = new Date();
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  .toISOString()
  .split("T")[0];

// Validation function for blur events
const validateField = async (fieldName: string) => {
  joiValidateField(fieldName, formData.value[fieldName as keyof LeadFormData]);
};

// Reset form to original values
const resetFormToOriginal = () => {
  initializeForm();
  submitStatus.value = "idle";
  submitError.value = null;
};

// Handle form submission
const handleSubmit = async () => {
  if (isSubmitting.value || !isDirty.value) return;

  // Validate all fields before submission
  const validationResult = validateForm(formData.value);

  if (!validationResult.isValid) {
    submitStatus.value = "error";
    submitError.value = "Please fix the validation errors before submitting.";
    return;
  }

  try {
    isSubmitting.value = true;
    submitStatus.value = "idle";
    submitError.value = null;

    // Prepare the update data
    const updateData = { ...formData.value };

    // Height is already in the correct feet.decimal format for the database
    if (updateData.height) {
      updateData.height = String(parseFloat(String(updateData.height))); // Ensure it's a valid number string
    }

    const response = await fetch(`/api/leads/${props.lead.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = (await response.json()) as {
      success: boolean;
      data: Lead;
      message?: string;
    };

    if (result.success) {
      submitStatus.value = "success";

      // Emit success event with updated lead data
      emit("success", result.data);

      // Clear success message after 3 seconds
      setTimeout(() => {
        if (submitStatus.value === "success") {
          submitStatus.value = "idle";
        }
      }, 3000);
    } else {
      throw new Error(result.message || "Failed to update lead");
    }
  } catch (error) {
    console.error("Error updating lead:", error);
    submitStatus.value = "error";
    submitError.value =
      error instanceof Error ? error.message : "Failed to update lead information";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
