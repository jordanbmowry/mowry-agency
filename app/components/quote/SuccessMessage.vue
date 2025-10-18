<template>
  <div class="space-y-6">
    <div class="text-center space-y-4">
      <div class="flex justify-center mb-4">
        <Icon
          name="heroicons:check-circle"
          class="h-16 w-16 text-green-600 dark:text-green-400"
        />
      </div>
      <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {{ title }}
      </h2>
      <p class="text-zinc-600 dark:text-zinc-400">
        Hi <span class="font-semibold">{{ userName }}</span
        >, {{ message }}
      </p>
    </div>

    <div
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3"
    >
      <h3 class="font-semibold text-blue-900 dark:text-blue-100">
        What happens next?
      </h3>
      <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-2">
        <li class="flex items-start gap-2">
          <Icon name="heroicons:check" class="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>Our agents will review your information</span>
        </li>
        <li class="flex items-start gap-2">
          <Icon name="heroicons:check" class="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span
            >We'll contact you with personalized quotes from top carriers</span
          >
        </li>
        <li class="flex items-start gap-2">
          <Icon name="heroicons:check" class="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span
            >Compare options and choose the best coverage for your family</span
          >
        </li>
      </ul>
    </div>

    <div
      class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
    >
      <p class="text-sm text-amber-900 dark:text-amber-100">
        <strong>Need to add or change anything?</strong> Please contact us
        directly:
      </p>
      <div class="mt-3 flex flex-col sm:flex-row gap-2">
        <a
          :href="`tel:+1${cleanPhone}`"
          class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          <Icon name="heroicons:phone" class="h-4 w-4 mr-2" />
          Call Us
        </a>
        <a
          :href="`sms:+1${cleanPhone}`"
          class="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          <Icon name="heroicons:chat-bubble-left" class="h-4 w-4 mr-2" />
          Text Us
        </a>
        <a
          :href="`mailto:${email}`"
          class="inline-flex items-center justify-center px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-md text-sm font-medium transition-colors"
        >
          <Icon name="heroicons:envelope" class="h-4 w-4 mr-2" />
          Email Us
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title?: string;
  userName: string;
  message?: string;
  phone: string;
  email: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Thank You for Your Quote Request!',
  message:
    "we've received your quote request and will contact you within 24 hours with a personalized life insurance quote.",
});

const cleanPhone = computed(() => props.phone.replace(/[^\d]/g, ''));
</script>
