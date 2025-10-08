<template>
  <div class="flex w-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Set default page metadata
useSeoMeta({
  title: 'Mowry Agency - Life Insurance Solutions',
  description:
    'Protecting What Matters Most to Your Family. Professional life insurance solutions from licensed agents with competitive rates from A-rated carriers.',
  ogTitle: 'Mowry Agency - Life Insurance Solutions',
  ogDescription:
    'Protecting What Matters Most to Your Family. Professional life insurance solutions from licensed agents.',
});

// Set favicon and other head elements
useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/images/Mowry_Agency_Logo.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/images/Mowry_Agency_Logo.png',
    },
  ],
});
</script>
