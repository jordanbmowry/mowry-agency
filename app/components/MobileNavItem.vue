<template>
  <li>
    <PopoverButton as="template">
      <NuxtLink :to="href" class="block py-2">
        <slot />
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
