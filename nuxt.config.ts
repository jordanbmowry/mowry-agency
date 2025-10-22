// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxt/ui',
    [
      '@nuxtjs/supabase',
      {
        redirect: false,
        redirectOptions: {
          login: '/admin/login',
          callback: '/confirm',
          include: ['/admin(/.*)'],
          exclude: [],
        },
        cookieOptions: {
          maxAge: 60 * 60 * 8, // 8 hours
          sameSite: 'lax',
          secure: true,
        },
        clientOptions: {
          auth: {
            flowType: 'pkce',
            autoRefreshToken: true,
            detectSessionInUrl: true,
            persistSession: true,
          },
        },
      },
    ],
    '@netlify/nuxt',
    '@vee-validate/nuxt',
    '@formkit/auto-animate/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '',
    preference: 'system', // Default to system preference
    fallback: 'light', // Fallback to light mode
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    storageKey: 'nuxt-color-mode',
    dataValue: 'theme', // This helps with SSR consistency
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
    agencyAddress:
      process.env.AGENCY_ADDRESS ||
      '1284 W Rangeview Cir, Bloomington, IN 47403',
    agencyWebsite: process.env.AGENCY_WEBSITE || 'https://mowryagency.com',
    agencyNpn: process.env.AGENCY_NPN || '16357772',
    // Supabase server-side config (updated for new project)
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    // Public keys exposed to client-side
    public: {
      siteUrl: process.env.NUXT_SITE_URL || 'https://mowryagency.com',
      agencyEmail: process.env.AGENCY_EMAIL || 'mowryagency@gmail.com',
      agencyPhone: process.env.AGENCY_PHONE || '(930) 322-1962',
      agencyAddress:
        process.env.AGENCY_ADDRESS ||
        '1284 W Rangeview Cir, Bloomington, IN 47403',
      agencyWebsite: process.env.AGENCY_WEBSITE || 'https://mowryagency.com',
      agencyNpn: process.env.AGENCY_NPN || '16357772',
    },
  },
  experimental: {
    payloadExtraction: false, // Disable payload extraction for better performance
    componentIslands: false, // Disable component islands to avoid test component issues
  },
  nitro: {
    prerender: {
      routes: [], // Let crawler find routes
    },
    rollupConfig: {
      plugins: [vue()],
      external: ['nuxt/dist/app/components/test-component-wrapper'],
    },
  },
  vite: {
    build: {
      rollupOptions: {
        external: [
          '/Users/jordanmowry/Desktop/spotlight-nuxt/node_modules/nuxt/dist/app/components/test-component-wrapper',
          'nuxt/dist/app/components/test-component-wrapper',
        ],
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
