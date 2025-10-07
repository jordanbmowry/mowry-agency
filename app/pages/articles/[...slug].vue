<template>
  <Container class="mt-16 lg:mt-32">
    <div class="xl:relative">
      <div class="mx-auto max-w-2xl">
        <button
          type="button"
          @click="$router.back()"
          aria-label="Go back to articles"
          class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20"
        >
          <Icon
            name="heroicons:arrow-left"
            class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400"
          />
        </button>

        <div v-if="pending" class="text-center py-8">
          <p class="text-zinc-600 dark:text-zinc-400">Loading article...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <p class="text-zinc-600 dark:text-zinc-400">
            Error loading article: {{ error }}
          </p>
          <button
            @click="refresh()"
            class="mt-4 text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Try again
          </button>
        </div>

        <article v-else-if="article">
          <header class="flex flex-col">
            <h1
              class="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100"
            >
              {{ article.title }}
            </h1>
            <time
              :dateTime="article.meta?.date"
              class="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
            >
              <span
                class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"
              />
              <span class="ml-3">{{
                formatDate(article.meta?.date as string)
              }}</span>
            </time>
          </header>
          <Prose class="mt-8" data-mdx-content>
            <ContentRenderer :value="article" />
          </Prose>
        </article>

        <div v-else class="text-center py-8">
          <h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Article not found
          </h1>
          <p class="mt-4 text-zinc-600 dark:text-zinc-400">
            The article you're looking for doesn't exist.
          </p>
          <NuxtLink
            to="/articles"
            class="mt-4 inline-block text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
          >
            ← Back to articles
          </NuxtLink>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '~/components/Container.vue';
import Prose from '~/components/Prose.vue';
import { formatDate } from '~/lib/formatDate';

// Get the route
const route = useRoute();

// Fetch the article content using the route path directly
const {
  data: article,
  pending,
  error,
  refresh,
} = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first();
});

// Set page metadata
if (article.value) {
  useSeoMeta({
    title: `${article.value.title} - Spencer Sharp`,
    description: article.value.description,
    ogTitle: article.value.title,
    ogDescription: article.value.description,
    ogType: 'article',
    ogUrl: `https://spotlightjs.com${route.path}`,
    twitterTitle: article.value.title,
    twitterDescription: article.value.description,
    twitterCard: 'summary_large_image',
  })

  // Add article structured data
  useSchemaOrg([
    {
      '@type': 'Article',
      headline: article.value.title,
      description: article.value.description,
      author: {
        '@type': 'Person',
        name: 'Spencer Sharp',
      },
      publisher: {
        '@type': 'Person',
        name: 'Spencer Sharp',
      },
      datePublished: article.value.meta?.date,
      dateModified: article.value.meta?.date,
      url: `https://spotlightjs.com${route.path}`,
    },
  ])
}
</script>
