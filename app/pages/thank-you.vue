<template>
  <SimpleLayout
    title="Thank you for your interest!"
    intro="We've received your information and will contact you within 24 hours with a personalized insurance quote. One of our licensed agents will reach out to discuss your family's protection needs and answer any questions you may have."
  >
    <Container class="mt-16 sm:mt-20">
      <div class="mx-auto max-w-2xl text-center">
        <div class="space-y-8">
          <div class="flex justify-center">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
            >
              <svg
                class="h-8 w-8 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div class="space-y-4">
            <h2
              class="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl dark:text-zinc-100"
            >
              What happens next?
            </h2>

            <div class="grid gap-6 sm:grid-cols-3">
              <div class="flex flex-col items-center text-center">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-3"
                >
                  <span
                    class="text-lg font-semibold text-blue-600 dark:text-blue-400"
                    >1</span
                  >
                </div>
                <h3 class="font-semibold text-zinc-900 dark:text-zinc-100">
                  Review
                </h3>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">
                  We'll review your information and prepare personalized options
                </p>
              </div>

              <div class="flex flex-col items-center text-center">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-3"
                >
                  <span
                    class="text-lg font-semibold text-blue-600 dark:text-blue-400"
                    >2</span
                  >
                </div>
                <h3 class="font-semibold text-zinc-900 dark:text-zinc-100">
                  Contact
                </h3>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">
                  A licensed agent will call you within 24 hours
                </p>
              </div>

              <div class="flex flex-col items-center text-center">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-3"
                >
                  <span
                    class="text-lg font-semibold text-blue-600 dark:text-blue-400"
                    >3</span
                  >
                </div>
                <h3 class="font-semibold text-zinc-900 dark:text-zinc-100">
                  Protect
                </h3>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">
                  Get the right coverage to protect your family's future
                </p>
              </div>
            </div>
          </div>

          <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6">
            <h3 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Need immediate assistance?
            </h3>
            <p class="text-zinc-600 dark:text-zinc-400 mb-4">
              Don't want to wait? Call us now and speak with a licensed agent
              immediately.
            </p>
            <Button
              href="tel:+19303221962"
              variant="primary"
              class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Call (930) 322-1962
            </Button>
          </div>
        </div>
      </div>
    </Container>
  </SimpleLayout>
</template>

<script setup>
import SimpleLayout from '~/components/SimpleLayout.vue';
import Container from '~/components/Container.vue';
import Button from '~/components/Button.vue';

// Set page meta
useSeoMeta({
  title: 'Thank You - Mowry Agency',
  description:
    "Thank you for your interest in life insurance. We'll contact you within 24 hours with a personalized quote.",
});
</script>
