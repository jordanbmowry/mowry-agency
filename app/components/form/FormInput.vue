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
      :class="inputClass"
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
