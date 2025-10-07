<template>
  <component
    :is="as"
    :class="eyebrowClasses"
    v-bind="$attrs"
  >
    <span
      v-if="decorate"
      class="absolute inset-y-0 left-0 flex items-center"
      aria-hidden="true"
    >
      <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
    </span>
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import clsx from 'clsx'

interface CardEyebrowProps {
  as?: string
  decorate?: boolean
  class?: string
}

const props = withDefaults(defineProps<CardEyebrowProps>(), {
  as: 'p',
  decorate: false,
})

const eyebrowClasses = computed(() => {
  return clsx(
    props.class,
    'relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500',
    props.decorate && 'pl-3.5',
  )
})
</script>
