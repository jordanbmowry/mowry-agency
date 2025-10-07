<template>
  <Section :title="title">
    <ul role="list" class="space-y-16">
      <slot />
    </ul>
  </Section>
</template>

<script setup lang="ts">
import Section from './Section.vue';

interface ToolsSectionProps {
  title: string;
}

defineProps<ToolsSectionProps>();
</script>
