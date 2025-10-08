<template>
  <footer class="mt-32 flex-none">
    <Container>
      <div class="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
        <div
          class="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <div
            class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            <NuxtLink
              href="/about"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >About</NuxtLink
            >
            <NuxtLink
              href="/carriers"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >Carriers</NuxtLink
            >
            <NuxtLink
              href="/quote"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >Get Quote</NuxtLink
            >
            <NuxtLink
              href="/join-us"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >Join Us</NuxtLink
            >
          </div>
          <p class="text-sm text-zinc-400 dark:text-zinc-500">
            Mowry Agency is owned by Mowry Digital Enterprise.
          </p>
        </div>
      </div>
    </Container>
  </footer>
</template>

<script setup lang="ts">
import Container from '~/components/Container.vue';
</script>
