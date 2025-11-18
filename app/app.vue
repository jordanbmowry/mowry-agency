<template>
  <UApp>
    <div class="flex w-full">
      <NuxtLayout>
        <NuxtPage :key="$route.fullPath" />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup>
// Set default page metadata using @nuxtjs/seo
useSeoMeta({
  title: 'Mowry Agency - Life Insurance Solutions',
  titleTemplate: '%s | Mowry Agency',
  description:
    'Protecting What Matters Most to Your Family. Professional life insurance solutions from licensed agents with competitive rates from A-rated carriers.',
  keywords:
    'life insurance, term life insurance, whole life insurance, universal life insurance, family protection, financial planning',
  author: 'Mowry Agency',
  ogTitle: 'Mowry Agency - Life Insurance Solutions',
  ogDescription:
    'Protecting What Matters Most to Your Family. Professional life insurance solutions from licensed agents.',
  ogType: 'website',
  ogUrl: 'https://mowryagency.com',
  ogImage: 'https://mowryagency.com/images/mowry-agency-og-image.jpg',
  ogSiteName: 'Mowry Agency',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Mowry Agency - Life Insurance Solutions',
  twitterDescription:
    'Protecting What Matters Most to Your Family. Professional life insurance solutions from licensed agents.',
  twitterImage: 'https://mowryagency.com/images/mowry-agency-og-image.jpg',
  twitterSite: '@mowryagency',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#f2d544',
});

// Set structured data for organization
useSchemaOrg([
  {
    '@type': 'Organization',
    name: 'Mowry Agency',
    url: 'https://mowryagency.com',
    logo: 'https://mowryagency.com/images/logo.png',
    description: 'Professional life insurance solutions and family financial protection services.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    sameAs: [
      // Add social media URLs when available
      // 'https://facebook.com/mowryagency',
      // 'https://linkedin.com/company/mowryagency',
    ],
  },
]);

// Get runtime config for Google Tag ID
const config = useRuntimeConfig();
const googleTagId = config.public.googleTagId;

// Set favicon and other head elements
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [{ charset: 'utf-8' }, { name: 'format-detection', content: 'telephone=no' }],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/images/Mowry_Agency_Logo.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/images/Mowry_Agency_Logo.png',
    },
    {
      rel: 'canonical',
      href: 'https://mowryagency.com',
    },
  ],
  // Add Google tag (gtag.js) scripts during SSR so they're in the initial HTML
  // This makes them detectable by the tracking detection tool
  script: googleTagId
    ? [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${googleTagId}`,
          async: true,
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleTagId}');
          `,
        },
      ]
    : [],
});
</script>

<style>
/* Page transition animations */
.page-enter-active {
  transition: all 0.4s ease-out;
}

.page-leave-active {
  transition: all 0.3s ease-in;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.2s ease;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
</style>
