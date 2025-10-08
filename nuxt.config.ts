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
    '@netlify/nuxt',
    '@vee-validate/nuxt',
    '@vue-email/nuxt',
  ],
  css: ['~/assets/css/main.css'],
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
    // Supabase server-side config
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    // Public keys exposed to client-side
    public: {
      // Add any public config here if needed
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
    url: 'https://mowryagency.com',
    name: 'Mowry Agency',
    description:
      'Protecting What Matters Most to Your Family - Professional Life Insurance Solutions from Licensed Agents',
    defaultLocale: 'en',
  },
  seo: {
    fallbackTitle: false,
    redirectToCanonicalSiteUrl: true,
  },
});
