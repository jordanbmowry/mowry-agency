<template>
  <Container class="mt-12 sm:mt-9">
    <div class="max-w-2xl">
      <h1
        class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100 leading-9 sm:leading-none"
      >
        Software designer, founder, and amateur astronaut.
      </h1>
      <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-7">
        I'm Spencer, a software designer and entrepreneur based in New York
        City. I'm the founder and CEO of Planetaria, where we develop
        technologies that empower regular people to explore space on their own
        terms.
      </p>
      <div class="mt-6 flex gap-6">
        <SocialLink href="#" :ariaLabel="'Follow on X'" :icon="XIcon" />
        <SocialLink
          href="#"
          :ariaLabel="'Follow on Instagram'"
          :icon="InstagramIcon"
        />
        <SocialLink
          href="#"
          :ariaLabel="'Follow on GitHub'"
          :icon="GitHubIcon"
        />
        <SocialLink
          href="#"
          :ariaLabel="'Follow on LinkedIn'"
          :icon="LinkedInIcon"
        />
      </div>
    </div>
  </Container>

  <!-- Photos section -->
  <Photos />

  <!-- Articles and newsletter section -->
  <Container class="mt-24 md:mt-28">
    <div
      class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2"
    >
      <div class="flex flex-col gap-16">
        <Article
          v-for="article in articles"
          :key="article.path"
          :article="{
            slug: article.path?.replace('/articles/', '') || '',
            title: article.title,
            date: article.date,
            description: article.description,
            author: article.author,
          }"
        />
      </div>
      <div class="space-y-10 lg:pl-16 xl:pl-24">
        <Newsletter />
        <Resume />
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '~/components/Container.vue';
import Photos from '~/components/Photos.vue';
import SocialLink from '~/components/SocialLink.vue';
import Article from '~/components/Article.vue';
import Newsletter from '~/components/Newsletter.vue';
import Resume from '~/components/Resume.vue';
import XIcon from '~/components/icons/XIcon.vue';
import InstagramIcon from '~/components/icons/InstagramIcon.vue';
import GitHubIcon from '~/components/icons/GitHubIcon.vue';
import LinkedInIcon from '~/components/icons/LinkedInIcon.vue';

// Get latest articles from Nuxt Content
const { data: articles } = await useAsyncData('home-articles', async () => {
  try {
    const result = await queryCollection('articles')
      .order('date', 'DESC')
      .limit(4)
      .all();

    return result || [];
  } catch (err) {
    return [];
  }
});

// Set page metadata
useSeoMeta({
  title: 'Spencer Sharp - Software designer, founder, and amateur astronaut',
  description:
    "I'm Spencer, a software designer and entrepreneur based in New York City. I'm the founder and CEO of Planetaria, where we develop technologies that empower regular people to explore space on their own terms.",
  ogTitle: 'Spencer Sharp - Software designer, founder, and amateur astronaut',
  ogDescription:
    "I'm Spencer, a software designer and entrepreneur based in New York City. I'm the founder and CEO of Planetaria, where we develop technologies that empower regular people to explore space on their own terms.",
  ogImage: '/images/avatar.jpg',
  ogUrl: 'https://spotlightjs.com',
  twitterTitle: 'Spencer Sharp - Software designer, founder, and amateur astronaut',
  twitterDescription:
    "I'm Spencer, a software designer and entrepreneur based in New York City. I'm the founder and CEO of Planetaria, where we develop technologies that empower regular people to explore space on their own terms.",
  twitterImage: '/images/avatar.jpg',
  twitterCard: 'summary_large_image',
})

// Add structured data for person and website
useSchemaOrg([
  {
    '@type': 'Person',
    name: 'Spencer Sharp',
    jobTitle: 'Software Designer & Founder',
    url: 'https://spotlightjs.com',
    sameAs: ['https://twitter.com/spencer', 'https://github.com/spencer'],
  },
  {
    '@type': 'WebSite',
    name: 'Spencer Sharp',
    url: 'https://spotlightjs.com',
  },
])
</script>
