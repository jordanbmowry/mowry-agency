<template>
  <component :is="as" :class="cardClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '~/lib/utils';

interface CardProps {
  as?: string;
  class?: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  as: 'div',
});

const cardClasses = computed(() => {
  return cn(
    props.class,
    'group relative flex flex-col items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
  );
});
</script>
