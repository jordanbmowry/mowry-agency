<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="step"
      :autocomplete="autocomplete"
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
        inputClass,
      ]"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p
      v-else-if="helpText"
      class="mt-1 text-sm text-zinc-500 dark:text-zinc-400"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  label: string;
  modelValue: string | number;
  type?: string;
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

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.type === 'number' ? Number(target.value) : target.value;
  emit('update:modelValue', value);
};

const handleBlur = () => {
  emit('blur');
};
</script>
