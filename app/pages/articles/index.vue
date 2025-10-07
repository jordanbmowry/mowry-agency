<template>
  <SimpleLayout
    title="Writing on software design, company building, and the aerospace industry."
    intro="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
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
          <p class="text-zinc-600 dark:text-zinc-400">
            No articles found.
          </p>
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
  title: 'Articles - Spencer Sharp',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
});

// Fetch articles using Nuxt Content v3 with correct collection name
const {
  data: articles,
  pending,
  error,
} = await useAsyncData('articles', async () => {
  try {
    // Query the articles collection directly
    const result = await queryCollection('articles')
      .order('date', 'DESC')
      .all();

    return result || [];
  } catch (err) {
    throw err;
  }
});
</script>
