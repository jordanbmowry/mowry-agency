<template>
  <Container class="mt-16 lg:mt-32">
    <div class="xl:relative">
      <div class="mx-auto max-w-2xl">
        <button
          type="button"
          @click="$router.back()"
          aria-label="Go back"
          class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 cursor-pointer"
        >
          <Icon
            name="heroicons:arrow-left"
            class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400"
          />
        </button>

        <div v-if="pending" class="text-center py-8">
          <p class="text-zinc-600 dark:text-zinc-400">Loading terms...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <p class="text-zinc-600 dark:text-zinc-400">
            Error loading terms: {{ error }}
          </p>
        </div>

        <article v-else-if="data">
          <header class="flex flex-col">
            <h1
              class="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100"
            >
              Terms of Service
            </h1>
            <time
              class="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
            >
              <span
                class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"
              />
              <span class="ml-3">Legal document for using our services</span>
            </time>
          </header>

          <div class="mt-8">
            <ContentRenderer :value="data" />
          </div>
        </article>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Terms of Service - Mowry Agency',
  description: 'Terms and conditions for using our website and services.',
});

useSeoMeta({
  title: 'Terms of Service - Mowry Agency',
  description: 'Terms and conditions for using our website and services.',
  ogTitle: 'Terms of Service - Mowry Agency',
  ogDescription: 'Terms and conditions for using our website and services.',
  ogType: 'website',
});

const { data, pending, error } = await useAsyncData('terms-of-service', () =>
  queryCollection('content').path('/terms-of-service').first()
);
</script>
