<template>
  <div class="space-y-2">
    <label
      :for="id"
      :class="[
        'block text-sm font-medium',
        error
          ? 'text-red-600 dark:text-red-400'
          : 'text-zinc-700 dark:text-zinc-300',
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Use UInput for all input types including date -->
    <UInput
      :id="id"
      :type="type"
      v-model="inputValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="step"
      :autocomplete="autocomplete"
      :color="error ? 'error' : 'neutral'"
      :class="[inputClass, type === 'date' ? 'date-input-mobile' : '']"
      :ui="{
        base: type === 'date' ? 'min-h-[44px] text-base' : '',
      }"
      @blur="handleBlur"
    />

    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="helpText" class="text-sm text-zinc-500 dark:text-zinc-400">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	id: string;
	label: string;
	modelValue: string | number;
	type?:
		| 'text'
		| 'email'
		| 'password'
		| 'number'
		| 'tel'
		| 'url'
		| 'search'
		| 'date'
		| 'time'
		| 'datetime-local';
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	error?: string;
	helpText?: string;
	min?: string | number;
	max?: string | number;
	step?: string | number;
	autocomplete?: string;
	inputClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text',
	placeholder: '',
	required: false,
	disabled: false,
	readonly: false,
	error: '',
	helpText: '',
	inputClass: '',
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number): void;
	(e: 'blur'): void;
}>();

const inputValue = computed({
	get: () => props.modelValue,
	set: (value: string | number) => emit('update:modelValue', value),
});

const handleBlur = () => {
	emit('blur');
};
</script>

<style scoped>
/* Improve date input appearance on mobile */
:deep(input[type='date']) {
  min-height: 44px;
  font-size: 16px; /* Prevents zoom on iOS */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* Ensure calendar icon is visible and clickable */
:deep(input[type='date']::-webkit-calendar-picker-indicator) {
  cursor: pointer;
  font-size: 18px;
  opacity: 1;
  padding: 8px;
  margin-left: 4px;
}

/* Firefox date input styling */
:deep(input[type='date']::-moz-calendar-picker-indicator) {
  cursor: pointer;
  font-size: 18px;
  opacity: 1;
}

/* Improve touch target size on mobile */
@media (max-width: 768px) {
  :deep(input[type='date']) {
    padding: 12px 14px;
    min-height: 48px;
  }

  :deep(input[type='date']::-webkit-calendar-picker-indicator) {
    min-width: 32px;
    min-height: 32px;
  }
}
</style>
