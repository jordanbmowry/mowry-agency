<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :maxlength="maxlength"
      @input="handleInput"
      @blur="handleBlur"
      :class="[
        'mt-1 block w-full rounded-md shadow-sm sm:text-sm',
        'transition-all duration-200',
        'dark:bg-zinc-700 dark:text-zinc-100',
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600'
          : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600',
        disabled
          ? 'bg-zinc-100 cursor-not-allowed dark:bg-zinc-800'
          : 'bg-white',
        textareaClass,
      ]"
    />
    <div v-if="maxlength" class="mt-1 flex justify-between items-center">
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
      <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p
        v-else-if="helpText"
        class="mt-1 text-sm text-zinc-500 dark:text-zinc-400"
      >
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

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

const handleBlur = () => {
  emit('blur');
};
</script>
