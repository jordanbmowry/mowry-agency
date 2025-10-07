<template>
  <div
    aria-hidden="true"
    class="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
  >
    <slot />
    <ChevronRightIcon class="ml-1 h-4 w-4 stroke-current" />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

// ChevronRightIcon component
function ChevronRightIcon(props: any) {
  return h(
    'svg',
    {
      viewBox: '0 0 16 16',
      fill: 'none',
      'aria-hidden': 'true',
      ...props,
    },
    h('path', {
      d: 'M6.75 5.75 9.25 8l-2.5 2.25',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  )
}
</script>
