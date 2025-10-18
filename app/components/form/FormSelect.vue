<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="handleChange"
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
        selectClass,
      ]"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
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
interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  id: string;
  label: string;
  modelValue: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  selectClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
  disabled: false,
  error: '',
  helpText: '',
  selectClass: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};

const handleBlur = () => {
  emit('blur');
};
</script>
