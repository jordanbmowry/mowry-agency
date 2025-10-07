<template>
  <NuxtLink class="group -m-1 p-1" :to="href" :aria-label="ariaLabel">
    <component
      :is="icon"
      class="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
interface SocialLinkProps {
  href: string;
  ariaLabel: string;
  icon: any;
}

defineProps<SocialLinkProps>();
</script>
