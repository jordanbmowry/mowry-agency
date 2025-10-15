<template>
  <li>
    <PopoverButton as="template">
      <NuxtLink
        :to="href"
        class="block py-3 px-2 rounded-lg transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:translate-x-1 group"
      >
        <span class="flex items-center justify-between">
          <slot />
          <Icon
            name="heroicons:arrow-right"
            class="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
          />
        </span>
      </NuxtLink>
    </PopoverButton>
  </li>
</template>

<script setup lang="ts">
import { PopoverButton } from '@headlessui/vue';

interface Props {
  href: string;
}

defineProps<Props>();
</script>
