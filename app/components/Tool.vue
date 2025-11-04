<template>
  <Card as="li">
    <CardTitle as="h3" :href="href">
      {{ title }}
    </CardTitle>
    <CardDescription>
      <slot />
    </CardDescription>
  </Card>
</template>

<script setup lang="ts">
import Card from './Card.vue';
import CardDescription from './CardDescription.vue';
import CardTitle from './CardTitle.vue';

interface ToolProps {
  title: string;
  href?: string;
}

defineProps<ToolProps>();
</script>
