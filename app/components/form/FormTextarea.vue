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
    <textarea
      :id="id"
      v-model="textareaValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :maxlength="maxlength"
      :class="textareaClasses"
      @blur="handleBlur"
    />
    <div v-if="maxlength" class="flex justify-between items-center">
      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p v-else-if="helpText" class="text-sm text-zinc-500 dark:text-zinc-400">
        {{ helpText }}
      </p>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
        {{ characterCount }} / {{ maxlength }}
      </p>
    </div>
    <template v-else>
      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p v-else-if="helpText" class="text-sm text-zinc-500 dark:text-zinc-400">
        {{ helpText }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id: string;
  label: string;
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
  maxlength?: number;
  textareaClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
  disabled: false,
  readonly: false,
  error: '',
  helpText: '',
  rows: 3,
  textareaClass: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();

const characterCount = computed(() => props.modelValue.length);

const textareaValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});

const textareaClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-md border-0 py-1.5 px-3',
    'text-zinc-900 dark:text-white',
    'shadow-sm ring-1 ring-inset',
    'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
    'focus:ring-2 focus:ring-inset',
    'sm:text-sm sm:leading-6',
    'resize-none',
    // Background - matching Nuxt UI darker blue
    'bg-white dark:bg-slate-900',
    // Disabled state
    'disabled:bg-zinc-50 dark:disabled:bg-slate-800',
    'disabled:text-zinc-500 dark:disabled:text-zinc-400',
    'disabled:cursor-not-allowed',
    // Border and focus colors - matching Nuxt UI neutral
    props.error
      ? 'ring-red-300 dark:ring-red-700 focus:ring-red-500 dark:focus:ring-red-400'
      : 'ring-zinc-300 dark:ring-slate-700 focus:ring-zinc-500 dark:focus:ring-zinc-400',
  ];

  if (props.textareaClass) {
    baseClasses.push(props.textareaClass);
  }

  return baseClasses.join(' ');
});

const handleBlur = () => {
  emit('blur');
};
</script>
