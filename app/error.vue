<template>
  <div class="h-[100vh] w-full bg-white dark:bg-zinc-900">
    <main
      class="relative isolate h-full w-full flex items-center justify-center"
    >
      <!-- Background image with overlay -->
      <div class="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
          alt=""
          class="absolute inset-0 h-full w-full object-cover object-center dark:hidden"
        />
        <img
          src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=-20&con=-15&sat=-75"
          alt=""
          class="absolute inset-0 hidden h-full w-full object-cover object-center dark:block"
        />
        <div class="absolute inset-0 bg-white/75 dark:bg-zinc-900/75" />
      </div>
      <div
        class="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 text-center"
      >
        <p
          class="text-base font-semibold leading-8 text-zinc-900 dark:text-white"
        >
          {{ error?.statusCode || '404' }}
        </p>
        <h1
          class="mt-4 text-5xl font-semibold tracking-tight text-balance text-zinc-900 dark:text-white sm:text-7xl"
        >
          {{ error?.statusMessage || 'Page not found' }}
        </h1>
        <p
          class="mt-6 text-lg font-medium text-pretty text-zinc-600 dark:text-zinc-400 sm:text-xl max-w-lg mx-auto"
        >
          {{ errorMessage }}
        </p>
        <div class="mt-10 flex justify-center">
          <NuxtLink
            to="/"
            class="group text-sm font-semibold leading-7 text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            @click="handleError"
          >
            <span
              aria-hidden="true"
              class="mr-2 transition-transform group-hover:-translate-x-1"
              >&larr;</span
            >
            <span class="relative">
              Back to home
              <span
                class="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all group-hover:w-full"
              />
            </span>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { clearError } from '#app';

const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return "Sorry, we couldn't find the page you're looking for.";
  }
  return 'An unexpected error occurred. Please try refreshing the page.';
});

// Reset error state when navigating home
const handleError = () => {
  clearError();
};
</script>
