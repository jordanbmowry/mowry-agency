<template>
  <div class="space-y-2">
    <label
      :for="id"
      class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

    <!-- Text Input -->
    <input
      v-if="
        type === 'text' || type === 'email' || type === 'tel' || type === 'date'
      "
      :id="id"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :class="inputClasses"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />

    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows || 3"
      :class="inputClasses"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
    />

    <!-- Select -->
    <select
      v-else-if="type === 'select'"
      :id="id"
      :name="name"
      :value="modelValue"
      :class="inputClasses"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
    >
      <option value="">{{ placeholder || 'Select an option' }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <p v-if="helpText" class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select';
  modelValue: string;
  placeholder?: string;
  autocomplete?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
}

interface FormFieldEmits {
  'update:modelValue': [value: string];
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  required: false,
  rows: 3,
});

defineEmits<FormFieldEmits>();

// Shared input classes following design system
const baseInputClasses = [
  'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2',
  'shadow-md shadow-zinc-800/5 outline outline-zinc-900/10',
  'placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10',
  'focus:outline-blue-500 sm:text-sm transition-colors',
  'dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700',
  'dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10',
  'dark:focus:outline-blue-400',
];

const errorClasses = [
  'outline-red-500 focus:outline-red-500',
  'focus:ring-red-500/10 dark:focus:ring-red-400/10',
];

const inputClasses = computed(() =>
  [...baseInputClasses, ...(props.error ? errorClasses : [])].join(' ')
);
</script>
