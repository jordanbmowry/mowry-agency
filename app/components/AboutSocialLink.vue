<template>
  <li :class="['flex', className]">
    <NuxtLink
      :to="href"
      class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
    >
      <component
        :is="icon"
        class="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500"
      />
      <span class="ml-4">
        <slot />
      </span>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
interface AboutSocialLinkProps {
  href: string;
  icon: any;
  className?: string;
}

defineProps<AboutSocialLinkProps>();
</script>
