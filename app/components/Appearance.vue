<template>
  <Card as="article">
    <CardTitle as="h3" :href="href">{{ title }}</CardTitle>
    <CardEyebrow :decorate="true">{{ event }}</CardEyebrow>
    <CardDescription>{{ description }}</CardDescription>
    <CardCta>{{ cta }}</CardCta>
  </Card>
</template>

<script setup>
import Card from '~/components/Card.vue';
import CardTitle from '~/components/CardTitle.vue';
import CardEyebrow from '~/components/CardEyebrow.vue';
import CardDescription from '~/components/CardDescription.vue';
import CardCta from '~/components/CardCta.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  cta: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
});
</script>
