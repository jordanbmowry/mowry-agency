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
    '@nuxtjs/supabase',
    '@netlify/nuxt',
    '@vee-validate/nuxt',
    '@vue-email/nuxt',
  ],
  css: ['~/assets/css/main.css', '@vuepic/vue-datepicker/dist/main.css'],
  colorMode: {
    classSuffix: '',
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'dark-plus',
        },
      },
    },
  },
  supabase: {
    // Disable authentication redirects for public website
    redirect: false,
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
  runtimeConfig: {
    // Server-side environment variables
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    agencyEmail: process.env.AGENCY_EMAIL || 'mowryagency@gmail.com',
    agencyPhone: process.env.AGENCY_PHONE || '(930) 322-1962',
    // Supabase server-side config (updated for new project)
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    // Public keys exposed to client-side
    public: {
      siteUrl: process.env.NUXT_SITE_URL || 'https://mowryagency.com',
      agencyEmail: process.env.AGENCY_EMAIL || 'mowryagency@gmail.com',
      agencyPhone: process.env.AGENCY_PHONE || '(930) 322-1962',
    },
  },
  experimental: {
    payloadExtraction: false, // Disable payload extraction for better performance
  },
  nitro: {
    prerender: {
      routes: [], // Let crawler find routes
    },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
          },
        },
      },
    },
  },
  site: {
    url: process.env.NUXT_SITE_URL || 'https://mowryagency.com',
    name: 'Mowry Agency',
    description:
      'Protecting What Matters Most to Your Family - Professional Life Insurance Solutions from Licensed Agents',
    defaultLocale: 'en',
  },
  seo: {
    fallbackTitle: false,
    redirectToCanonicalSiteUrl: false, // Disable redirects for Netlify deployment
  },
});
