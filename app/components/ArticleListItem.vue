<template>
  <article class="md:grid md:grid-cols-4 md:items-baseline">
    <Card class="md:col-span-3">
      <CardTitle :href="`/articles/${article.path?.split('/').pop()}`">
        {{ article.title }}
      </CardTitle>
      <CardEyebrow
        as="time"
        :dateTime="article.date"
        class="md:hidden"
        decorate
      >
        {{ formatDate(article.date) }}
      </CardEyebrow>
      <CardDescription>{{ article.description }}</CardDescription>
      <CardCta>Read article</CardCta>
    </Card>
    <CardEyebrow as="time" :dateTime="article.date" class="mt-1 max-md:hidden">
      {{ formatDate(article.date) }}
    </CardEyebrow>
  </article>
</template>

<script setup lang="ts">
import { formatDate } from '~/lib/formatDate';
import Card from './Card.vue';
import CardCta from './CardCta.vue';
import CardDescription from './CardDescription.vue';
import CardEyebrow from './CardEyebrow.vue';
import CardTitle from './CardTitle.vue';

interface ArticleListItemProps {
  article: {
    path?: string;
    title: string;
    description: string;
    date: string;
    author?: string;
  };
}

defineProps<ArticleListItemProps>();
</script>
