<template>
  <Section :title="title">
    <div class="space-y-16">
      <slot />
    </div>
  </Section>
</template>

<script setup>
import Section from '~/components/Section.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
