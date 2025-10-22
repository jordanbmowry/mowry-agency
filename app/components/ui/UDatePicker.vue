<template>
  <UInput
    :id="id"
    :model-value="modelValue"
    type="date"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :readonly="readonly"
    :min="min"
    :max="max"
    :autocomplete="autocomplete"
    :color="color"
    :class="inputClasses"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur')"
  />
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils';
import { computed } from 'vue';

interface Props {
  id?: string;
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  min?: string;
  max?: string;
  autocomplete?: string;
  color?: 'primary' | 'error' | 'success' | 'info' | 'warning' | 'neutral';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'MM/DD/YYYY',
  disabled: false,
  required: false,
  readonly: false,
  color: 'neutral',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();

const inputClasses = computed(() => cn('w-full', props.class));
</script>
