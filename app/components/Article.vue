<template>
  <Card as="article">
    <CardTitle :href="`/articles/${article.slug}`">
      {{ article.title }}
    </CardTitle>
    <CardEyebrow as="time" :dateTime="article.date" :decorate="true">
      {{ formatDate(article.date) }}
    </CardEyebrow>
    <CardDescription>{{ article.description }}</CardDescription>
    <CardCta>Read article</CardCta>
  </Card>
</template>

<script setup lang="ts">
import { formatDate } from '~/lib/formatDate';
import Card from './Card.vue';
import CardCta from './CardCta.vue';
import CardDescription from './CardDescription.vue';
import CardEyebrow from './CardEyebrow.vue';
import CardTitle from './CardTitle.vue';

interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  author?: string;
}

interface Props {
  article: Article;
}

defineProps<Props>();
</script>
