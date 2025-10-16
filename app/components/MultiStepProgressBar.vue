<template>
  <nav aria-label="Progress" class="mb-8">
    <ol role="list" class="space-y-4 md:flex md:space-y-0 md:space-x-8">
      <li v-for="(step, index) in steps" :key="step.name" class="md:flex-1">
        <div
          v-if="step.status === 'complete'"
          class="group flex flex-col border-l-4 border-green-600 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0 dark:border-green-500"
        >
          <span class="text-sm font-medium text-green-600 dark:text-green-400">
            {{ step.id }}
          </span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ step.name }}
          </span>
        </div>
        <div
          v-else-if="step.status === 'current'"
          class="flex flex-col border-l-4 border-blue-600 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0 dark:border-blue-500"
          aria-current="step"
        >
          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
            {{ step.id }}
          </span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ step.name }}
          </span>
        </div>
        <div
          v-else
          class="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0 dark:border-white/10"
        >
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ step.id }}
          </span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ step.name }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Step {
  id: string;
  name: string;
  status: "complete" | "current" | "upcoming";
}

const props = defineProps<{
  currentStep: number;
  isStep1Valid?: boolean;
  isStep2Valid?: boolean;
  isStep3Valid?: boolean;
}>();

const steps = computed(() => {
  return [
    {
      id: "Step 1",
      name: "Personal Information",
      status:
        props.currentStep > 1 || (props.currentStep === 1 && props.isStep1Valid)
          ? "complete"
          : props.currentStep === 1
          ? "current"
          : "upcoming",
    },
    {
      id: "Step 2",
      name: "Health Information",
      status:
        props.currentStep > 2 || (props.currentStep === 2 && props.isStep2Valid)
          ? "complete"
          : props.currentStep === 2
          ? "current"
          : "upcoming",
    },
    {
      id: "Step 3",
      name: "Coverage Information",
      status:
        props.currentStep > 3 || (props.currentStep === 3 && props.isStep3Valid)
          ? "complete"
          : props.currentStep === 3
          ? "current"
          : "upcoming",
    },
  ] as Step[];
});
</script>
