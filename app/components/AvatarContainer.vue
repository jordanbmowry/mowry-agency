<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import clsx from 'clsx';

interface Props {
  className?: string;
}

const props = defineProps<Props>();

const containerClasses = computed(() =>
  clsx(
    props.className,
    'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10'
  )
);
</script>
