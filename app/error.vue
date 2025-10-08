<template>
  <div
    class="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900"
  >
    <div class="text-center">
      <h1 class="text-9xl font-bold text-zinc-300 dark:text-zinc-700">
        {{ error?.statusCode || 500 }}
      </h1>
      <h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-4">
        {{ error?.statusMessage || 'Something went wrong' }}
      </h2>
      <p class="text-zinc-600 dark:text-zinc-400 mt-2 max-w-md mx-auto">
        {{ errorMessage }}
      </p>
      <NuxtLink
        to="/"
        class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go back home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
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
  return "Don't worry, it happens to the best of us. Try refreshing the page or going back home.";
});
</script>
