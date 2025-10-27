<template>
  <div :class="containerClasses">
    <!-- Business Name and Ownership -->
    <p :class="textClasses">
      {{ BUSINESS_INFO.businessName }} is owned and operated by
      {{ BUSINESS_INFO.ownerEntity }}.
    </p>

    <!-- Licensed States Accordion -->
    <div
      class="my-4 accordion-centered bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4"
    >
      <UAccordion :items="accordionItems" />
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
import { useAutoAnimate } from '@formkit/auto-animate/vue';
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

// Auto-animate refs
const [licenseParent] = useAutoAnimate();
const [statesContentParent] = useAutoAnimate();

// Get runtime config for agency NPN
const { $config } = useNuxtApp();
const agencyNpn = computed(() => $config.public.agencyNpn);

// Collapsible states functionality
const showStates = ref(false);

// Enhanced toggle function with animations
const toggleStates = () => {
  showStates.value = !showStates.value;
};

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

// Accordion items
const accordionItems = computed(() => [
  {
    key: 'licensed-states',
    label: 'We are licensed to sell life insurance in the following states:',
    content: formatLicenseDisplay(props.displayFormat),
  },
]);
</script>

<style scoped>
.accordion-centered {
  text-align: center !important;
}

.accordion-centered :deep(*) {
  text-align: center !important;
}

/* Target the specific button classes that UAccordion uses */
.accordion-centered :deep(.text-start) {
  text-align: center !important;
}

.accordion-centered :deep(.break-words) {
  text-align: center !important;
}

/* Force center all UAccordion content */
.accordion-centered :deep(.divide-y) {
  text-align: center !important;
}

.accordion-centered :deep(.divide-y > div) {
  text-align: center !important;
}

.accordion-centered :deep(.divide-y > div > div) {
  text-align: center !important;
}

.accordion-centered :deep(button) {
  justify-content: space-between !important; /* Space between text and arrow */
  text-align: center !important;
  width: 100% !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  padding: 0.75rem 1rem !important; /* Add padding for better touch target */
  cursor: pointer !important; /* Show pointer cursor */
  transition: background-color 0.2s ease !important; /* Smooth hover transition */
}

/* Add hover effect to make it obvious it's clickable */
.accordion-centered :deep(button:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.accordion-centered :deep(.dark button:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.accordion-centered :deep(button span) {
  text-align: center !important;
  display: block !important;
}

/* Center the text */
.accordion-centered :deep(button span:first-child) {
  flex: 1 !important;
  text-align: center !important;
  padding-right: 2rem !important; /* Add padding to prevent overlap with arrow */
}

/* Keep the chevron on the right with proper spacing */
.accordion-centered :deep(button span:last-child) {
  flex-shrink: 0 !important; /* Prevent arrow from shrinking */
  margin-left: 1rem !important; /* Add spacing from text */
  display: flex !important;
  align-items: center !important;
}

/* Ensure the icon is visible and properly sized */
.accordion-centered :deep(button svg) {
  width: 1.25rem !important;
  height: 1.25rem !important;
  flex-shrink: 0 !important;
}

.accordion-centered :deep([role='region']) {
  text-align: center !important;
}

.accordion-centered :deep([role='region'] > div) {
  text-align: center !important;
}

.accordion-centered :deep(p) {
  text-align: center !important;
}

/* Specific targeting for the accordion button content */
.accordion-centered :deep(.flex-1) {
  justify-content: center !important;
  text-align: center !important;
}

.accordion-centered :deep(.items-center) {
  justify-content: center !important;
}
</style>
