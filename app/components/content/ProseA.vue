<template>
  <a 
    :href="href" 
    class="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 underline decoration-teal-500/30 hover:decoration-teal-500/50 underline-offset-2"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
interface Props {
  href?: string;
}

defineProps<Props>();
</script>