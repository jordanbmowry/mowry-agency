<template>
  <li>
    <NuxtLink :to="href" :class="linkClasses">
      <slot />
      <span
        v-if="isActive"
        class="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0"
      />
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import clsx from 'clsx';

interface Props {
  href: string;
}

const props = defineProps<Props>();
const route = useRoute();

const isActive = computed(() => route.path === props.href);

const linkClasses = computed(() =>
  clsx(
    'relative block px-3 py-2 transition',
    isActive.value
      ? 'text-teal-500 dark:text-teal-400'
      : 'hover:text-teal-500 dark:hover:text-teal-400'
  )
);
</script>
