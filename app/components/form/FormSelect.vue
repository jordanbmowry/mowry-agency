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
    <USelect
      :id="id"
      v-model="selectValue"
      :items="options"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :color="error ? 'error' : 'neutral'"
      size="lg"
      :class="['w-full', selectClass]"
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

const selectValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});

const handleBlur = () => {
  emit('blur');
};
</script>
