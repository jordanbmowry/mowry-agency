<template>
  <!-- Hero Section -->
  <Container class="mt-12 sm:mt-16 lg:mt-20">
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
      <!-- Hero Content -->
      <div
        class="relative z-10 lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6"
      >
        <h1
          class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-6xl lg:text-5xl xl:text-6xl dark:text-zinc-100"
        >
          Protecting What Matters Most to
          <span class="text-blue-600 dark:text-blue-400">Your Family</span>
        </h1>
        <p class="mt-6 text-lg text-zinc-600 dark:text-zinc-400 leading-8">
          At Mowry Agency, we specialize in providing comprehensive life
          insurance solutions tailored to your unique needs. From term life to
          whole life, mortgage protection to retirement planning - we're here to
          secure your family's financial future.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <Button
            href="tel:+19303221962"
            variant="primary"
            class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Call for a Quote
          </Button>
          <Button
            href="https://calendly.com/mowry-agency/life-insurance-appointment-phone"
            variant="secondary"
            class="ring-1 ring-zinc-200 hover:ring-zinc-300 dark:ring-zinc-700 dark:hover:ring-zinc-600"
          >
            Schedule Consultation
          </Button>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-10 flex items-center gap-x-8">
          <div class="flex items-center gap-x-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
            >
              <svg
                class="h-4 w-4 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >Licensed & Trusted</span
            >
          </div>
          <div class="flex items-center gap-x-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
            >
              <svg
                class="h-4 w-4 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >Free Consultations</span
            >
          </div>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="relative mt-10 lg:col-span-5 lg:mt-0 xl:col-span-6">
        <div
          class="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
        >
          <NuxtImg
            src="/images/agency/group_photo_1.webp"
            alt="Mowry Agency team helping families"
            class="h-full w-full object-cover"
            width="600"
            height="450"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
          />
        </div>
      </div>
    </div>
  </Container>

  <!-- Services Showcase Section -->
  <Container class="mt-24 md:mt-28">
    <div class="mx-auto max-w-2xl lg:max-w-none">
      <div class="max-w-2xl">
        <h2
          class="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100"
        >
          Comprehensive Insurance Solutions
        </h2>
        <p class="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
          We offer a full range of life insurance and financial protection
          products to meet your family's unique needs at every stage of life.
        </p>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Service Cards -->
        <div
          class="group relative rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20"
            >
              <svg
                class="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Term Life Insurance
            </h3>
          </div>
          <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Affordable protection for a specific period, perfect for young
            families and mortgage protection.
          </p>
        </div>

        <div
          class="group relative rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20"
            >
              <svg
                class="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Whole Life Insurance
            </h3>
          </div>
          <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Permanent coverage with cash value growth, providing lifelong
            protection and savings.
          </p>
        </div>

        <div
          class="group relative rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20"
            >
              <svg
                class="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Mortgage Protection
            </h3>
          </div>
          <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Ensure your family can keep the home they love, even if the
            unexpected happens.
          </p>
        </div>

        <div
          class="group relative rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20"
            >
              <svg
                class="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Retirement Planning
            </h3>
          </div>
          <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Annuities and retirement solutions to secure your golden years with
            guaranteed income.
          </p>
        </div>

        <div
          class="group relative rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 dark:bg-yellow-900/20"
            >
              <svg
                class="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Final Expense
            </h3>
          </div>
          <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Cover end-of-life costs and ease the financial burden on your loved
            ones.
          </p>
        </div>

        <div
          class="group relative rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20"
            >
              <svg
                class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Business Insurance
            </h3>
          </div>
          <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Protect your business with key person insurance and succession
            planning.
          </p>
        </div>
      </div>
    </div>
  </Container>

  <!-- Articles section -->
  <Container class="mt-24 md:mt-28">
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
  </Container>

  <!-- Quote Form section -->
  <Container class="mt-24 md:mt-28">
    <div class="max-w-2xl mx-auto">
      <QuoteForm />
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '~/components/Container.vue';
import Button from '~/components/Button.vue';
import Article from '~/components/Article.vue';
import QuoteForm from '~/components/QuoteForm.vue';

// Get latest insurance articles from Nuxt Content
const { data: articles } = await useAsyncData('home-articles', async () => {
  try {
    // Only query articles if we're not in a build environment
    if (process.server && process.env.NETLIFY) {
      return []; // Return empty array during Netlify build
    }

    // Query all articles and filter for insurance articles client-side
    const result = await queryCollection('articles')
      .order('date', 'DESC')
      .all();

    // Filter to only show articles authored by Mowry Agency (insurance content)
    const filtered =
      result?.filter((article) => article.author === 'Mowry Agency') || [];

    // Limit to 4 articles for the home page
    return filtered.slice(0, 4);
  } catch (err) {
    console.warn('Failed to load articles for homepage:', err);
    return [];
  }
});

// Set page metadata
useSeoMeta({
  title: 'Mowry Agency - Protecting What Matters Most to Your Family',
  description:
    "Mowry Agency specializes in comprehensive life insurance solutions. From term life to whole life, mortgage protection to retirement planning - we secure your family's financial future.",
  ogTitle: 'Mowry Agency - Life Insurance & Financial Protection',
  ogDescription:
    'Comprehensive life insurance solutions tailored to your unique needs. Protecting families with term life, whole life, mortgage protection, and retirement planning.',
  ogImage: '/images/agency/group_photo_1.webp',
  ogUrl: 'https://mowryagency.com',
  twitterTitle: 'Mowry Agency - Life Insurance & Financial Protection',
  twitterDescription:
    'Comprehensive life insurance solutions tailored to your unique needs. Protecting families with term life, whole life, mortgage protection, and retirement planning.',
  twitterImage: '/images/agency/group_photo_1.webp',
  twitterCard: 'summary_large_image',
});

// Add structured data for insurance agency
useSchemaOrg([
  {
    '@type': 'InsuranceAgency',
    name: 'Mowry Agency',
    url: 'https://mowryagency.com',
    description:
      'Comprehensive life insurance solutions and financial protection services',
    serviceArea: 'United States',
    insurance: [
      'Life Insurance',
      'Term Life Insurance',
      'Whole Life Insurance',
      'Mortgage Protection',
      'Final Expense Insurance',
    ],
  },
  {
    '@type': 'WebSite',
    name: 'Mowry Agency',
    url: 'https://mowryagency.com',
  },
]);
</script>
