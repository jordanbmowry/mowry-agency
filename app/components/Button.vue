<template>
  <component
    :is="componentType"
    :class="buttonClasses"
    v-bind="componentProps"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import clsx from 'clsx'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  href?: string
  type?: 'button' | 'submit' | 'reset'
  class?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  type: 'button',
})

const variantStyles = {
  primary:
    'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70',
  secondary:
    'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70',
}

const componentType = computed(() => {
  return props.href ? resolveComponent('NuxtLink') : 'button'
})

const componentProps = computed(() => {
  if (props.href) {
    return { to: props.href }
  }
  return { type: props.type }
})

const buttonClasses = computed(() => {
  return clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
    variantStyles[props.variant],
    props.class,
  )
})
</script>
