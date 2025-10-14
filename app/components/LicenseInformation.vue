<template>
  <div :class="containerClasses">
    <!-- Business Name and Ownership -->
    <p :class="textClasses">
      {{ BUSINESS_INFO.businessName }} is owned and operated by
      {{ BUSINESS_INFO.ownerEntity }}.
    </p>

    <!-- Licensed States -->
    <p :class="textClasses">
      We are licensed to sell life insurance in the following states:
    </p>

    <p :class="[textClasses, 'font-mono text-sm']">
      {{ formatLicenseDisplay(displayFormat) }}
    </p>

    <!-- NPN Information -->
    <p :class="textClasses">National Producer Number (NPN): {{ agencyNpn }}</p>

    <!-- Compliance Disclaimer -->
    <p :class="textClasses">
      {{ COMPLIANCE_DISCLAIMERS.quote }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
