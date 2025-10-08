<template>
  <SimpleLayout
    title="Insurance Education Articles"
    intro="Expert guidance on life insurance, financial protection, and securing your family's future. Educational articles to help you make informed decisions about your insurance needs."
  >
    <div
      class="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40"
    >
      <div class="flex max-w-3xl flex-col space-y-16">
        <div v-if="pending" class="text-center">
          <p class="text-zinc-600 dark:text-zinc-400">Loading articles...</p>
        </div>
        <div v-else-if="error" class="text-center">
          <p class="text-zinc-600 dark:text-zinc-400">
            Error loading articles: {{ error }}
          </p>
        </div>
        <div v-else-if="!articles || articles.length === 0" class="text-center">
          <p class="text-zinc-600 dark:text-zinc-400">No articles found.</p>
        </div>
        <ArticleListItem
          v-for="(article, index) in articles"
          :key="
            (article as any)?.path ||
            (article as any)?._path ||
            `article-${index}`
          "
          :article="article"
        />
      </div>
    </div>
  </SimpleLayout>
</template>

<script setup lang="ts">
import SimpleLayout from '~/components/SimpleLayout.vue';
import ArticleListItem from '~/components/ArticleListItem.vue';

// Set page metadata
useSeoMeta({
  title: 'Insurance Education Articles - Mowry Agency',
  description:
    "Expert guidance on life insurance, financial protection, and securing your family's future. Educational articles to help you make informed insurance decisions.",
});

// Fetch articles using Nuxt Content
const {
  data: articles,
  pending,
  error,
} = await useAsyncData('articles', () =>
  queryCollection('articles').order('date', 'DESC').all()
);
</script>
