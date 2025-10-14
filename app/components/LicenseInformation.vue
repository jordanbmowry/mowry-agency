<template>
  <div :class="containerClasses">
    <!-- Business Name and Ownership -->
    <p :class="textClasses">
      {{ BUSINESS_INFO.businessName }} is owned and operated by
      {{ BUSINESS_INFO.ownerEntity }}.
    </p>

    <!-- Licensed States -->
    <div
      class="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700/50"
    >
      <button
        @click="showStates = !showStates"
        :class="[
          textClasses,
          'w-full inline-flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer font-medium',
        ]"
      >
        We are licensed to sell life insurance in the following states:
        <Icon
          :name="showStates ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
          class="h-3 w-3 flex-shrink-0 text-zinc-400 dark:text-zinc-500"
        />
      </button>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-40"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 max-h-40"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="showStates" class="overflow-hidden">
          <div class="border-t border-zinc-200 dark:border-zinc-600 mt-3 pt-3">
            <p
              :class="[
                textClasses,
                'font-mono text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 text-center',
              ]"
            >
              {{ formatLicenseDisplay(displayFormat) }}
            </p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- NPN Information -->
    <p :class="textClasses">National Producer Number (NPN): {{ agencyNpn }}</p>

    <!-- Compliance Disclaimer -->
    <p :class="textClasses">
      {{ COMPLIANCE_DISCLAIMERS.quote }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  BUSINESS_INFO,
  COMPLIANCE_DISCLAIMERS,
  formatLicenseDisplay,
} from '~/constants/licenses';

interface Props {
  displayFormat?: 'short' | 'full';
  variant?: 'email' | 'website' | 'footer';
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  displayFormat: 'short',
  variant: 'website',
  compact: false,
});

// Get runtime config for agency NPN
const { $config } = useNuxtApp();
const agencyNpn = computed(() => $config.public.agencyNpn);

// Collapsible states functionality
const showStates = ref(false);

// Dynamic classes based on variant and context
const containerClasses = computed(() => {
  const base = 'space-y-3';

  switch (props.variant) {
    case 'email':
      return `${base} text-zinc-600`;
    case 'footer':
      return `${base} text-zinc-500 dark:text-zinc-400`;
    case 'website':
    default:
      return `${base} text-zinc-600 dark:text-zinc-300`;
  }
});

const textClasses = computed(() => {
  const base = 'leading-relaxed';

  if (props.compact) {
    return `${base} text-xs`;
  }

  switch (props.variant) {
    case 'email':
      return `${base} text-sm`;
    case 'footer':
      return `${base} text-xs`;
    case 'website':
    default:
      return `${base} text-sm`;
  }
});
</script>
