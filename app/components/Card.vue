<template>
  <component :is="as" :class="cardClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import clsx from 'clsx'

interface CardProps {
  as?: string
  class?: string
}

const props = withDefaults(defineProps<CardProps>(), {
  as: 'div',
})

const cardClasses = computed(() => {
  return clsx(props.class, 'group relative flex flex-col items-start')
})
</script>
