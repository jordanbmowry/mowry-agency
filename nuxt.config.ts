// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxtjs/seo',
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '',
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'dark-plus'
        }
      }
    }
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'h-full antialiased',
        lang: 'en',
      },
      bodyAttrs: {
        class: 'flex h-full bg-zinc-50 dark:bg-black',
      },
    },
  },
  image: {
    // Enable optimized image loading
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
  experimental: {
    payloadExtraction: false, // Disable payload extraction for better performance
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            utils: ['date-fns'],
          },
        },
      },
    },
  },
  site: {
    url: 'https://spotlightjs.com',
    name: 'Spencer Sharp',
    description: 'Software designer, founder, and amateur astronaut',
    defaultLocale: 'en',
  },
  seo: {
    fallbackTitle: false,
  },
});
