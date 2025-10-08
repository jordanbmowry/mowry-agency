<template>
  <div class="space-y-2">
    <label :for="id" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <p v-if="error" :class="errorTextClasses">{{ error }}</p>

    <!-- Memoized input component -->
    <component
      :is="inputComponent"
      v-bind="inputProps"
      @update:modelValue="handleInput"
    />

    <p v-if="helpText" :class="helpTextClasses">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

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

const emit = defineEmits<FormFieldEmits>();

// Memoized style classes (computed only when error state changes)
const labelClasses = computed(
  () => 'block text-sm font-medium text-zinc-700 dark:text-zinc-300'
);

const errorTextClasses = computed(() => 'text-red-600 text-sm');

const helpTextClasses = computed(
  () => 'mt-1 text-xs text-zinc-500 dark:text-zinc-400'
);

// Base input classes as constants (never change)
const BASE_INPUT_CLASSES = [
  'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2',
  'shadow-md shadow-zinc-800/5 outline outline-zinc-900/10',
  'placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10',
  'focus:outline-blue-500 sm:text-sm transition-colors',
  'dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700',
  'dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10',
  'dark:focus:outline-blue-400',
].join(' ');

const ERROR_CLASSES = [
  'outline-red-500 focus:outline-red-500',
  'focus:ring-red-500/10 dark:focus:ring-red-400/10',
].join(' ');

// Memoized input classes
const inputClasses = computed(() => {
  return props.error
    ? `${BASE_INPUT_CLASSES} ${ERROR_CLASSES}`
    : BASE_INPUT_CLASSES;
});

// Lazy-loaded input components for better performance
const inputComponents = {
  text: defineAsyncComponent(() => import('./form-inputs/TextInput.vue')),
  email: defineAsyncComponent(() => import('./form-inputs/TextInput.vue')),
  tel: defineAsyncComponent(() => import('./form-inputs/TextInput.vue')),
  date: defineAsyncComponent(() => import('./form-inputs/TextInput.vue')),
  textarea: defineAsyncComponent(
    () => import('./form-inputs/TextareaInput.vue')
  ),
  select: defineAsyncComponent(() => import('./form-inputs/SelectInput.vue')),
};

// Memoized input component
const inputComponent = computed(() => {
  if (['text', 'email', 'tel', 'date'].includes(props.type)) {
    return 'input';
  }
  return props.type;
});

// Memoized input props
const inputProps = computed(() => {
  const baseProps = {
    id: props.id,
    name: props.name,
    value: props.modelValue,
    placeholder: props.placeholder,
    class: inputClasses.value,
  };

  if (props.type === 'textarea') {
    return {
      ...baseProps,
      rows: props.rows,
    };
  }

  if (props.type === 'select') {
    return {
      ...baseProps,
      options: props.options,
    };
  }

  return {
    ...baseProps,
    type: props.type,
    autocomplete: props.autocomplete,
  };
});

// Optimized input handler (debounced for better performance)
let debounceTimeout: NodeJS.Timeout | null = null;

const handleInput = (value: string) => {
  // Clear previous timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Debounce validation for 300ms
  debounceTimeout = setTimeout(() => {
    emit('update:modelValue', value);
  }, 300);
};

// Cleanup on unmount
onUnmounted(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
});
</script>
