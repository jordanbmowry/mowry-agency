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
import ArticleListItem from '~/components/ArticleListItem.vue';
import SimpleLayout from '~/components/SimpleLayout.vue';

// Set page metadata
useSeoMeta({
  title: 'Insurance Education Articles - Mowry Agency',
  description:
    "Expert guidance on life insurance, financial protection, and securing your family's future. Educational articles to help you make informed insurance decisions.",
  keywords:
    'life insurance education, insurance articles, term life vs whole life, life insurance guide, family protection',
  ogTitle: 'Insurance Education Articles - Mowry Agency',
  ogDescription:
    "Expert guidance on life insurance, financial protection, and securing your family's future. Educational articles to help you make informed insurance decisions.",
  ogType: 'website',
  ogUrl: 'https://mowryagency.com/articles',
  ogImage: 'https://mowryagency.com/images/mowry-agency-og-image.jpg',
  twitterTitle: 'Insurance Education Articles - Mowry Agency',
  twitterDescription:
    "Expert guidance on life insurance, financial protection, and securing your family's future.",
  twitterCard: 'summary_large_image',
  twitterImage: 'https://mowryagency.com/images/mowry-agency-og-image.jpg',
});

// Add structured data for articles page
useSchemaOrg([
  {
    '@type': 'Blog',
    name: 'Mowry Agency Insurance Education Center',
    description: 'Educational articles about life insurance and family financial protection',
    url: 'https://mowryagency.com/articles',
    publisher: {
      '@type': 'Organization',
      name: 'Mowry Agency',
      url: 'https://mowryagency.com',
    },
  },
]);

// Fetch articles using Nuxt Content
const {
  data: articles,
  pending,
  error,
} = await useAsyncData('articles', () => queryCollection('articles').order('date', 'DESC').all());
</script>
