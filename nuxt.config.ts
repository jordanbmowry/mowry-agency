// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',
  modules: [
    '@nuxt/fonts',
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
    '@formkit/auto-animate/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  fonts: {
    families: [
      // Professional fonts for a modern agency look
      {
        name: 'Inter',
        provider: 'google',
        weights: ['400', '500', '600', '700'],
        subsets: ['latin'],
        display: 'swap',
        preload: true,
        fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      },
      {
        name: 'JetBrains Mono',
        provider: 'google',
        weights: ['400', '500', '600'],
        subsets: ['latin'],
        display: 'swap',
        preload: false, // Only preload primary font
        fallbacks: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    ],
    defaults: {
      weights: ['400', '500', '600', '700'],
      subsets: ['latin'],
      fallbacks: {
        'sans-serif': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        monospace: [
          'JetBrains Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
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
    renderer: {
      anchorLinks: {
        h2: true,
        h3: true,
        h4: true,
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
      link: [
        // Performance optimization: Resource hints for external resources
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        // Favicons
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/favicon/favicon-96x96.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicon/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
  },
  image: {
    // Enable optimized image loading
    provider: 'netlifyImageCdn',
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
    experimental: {
      openAPI: true,
    },
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    minify: true,
  },
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS per component for better caching
      rollupOptions: {
        external: [
          '/Users/jordanmowry/Desktop/spotlight-nuxt/node_modules/nuxt/dist/app/components/test-component-wrapper',
          'nuxt/dist/app/components/test-component-wrapper',
        ],
        output: {
          manualChunks: (id) => {
            // Create optimized chunks for better caching
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('vue-router')) {
                return 'vue-vendor';
              }
              if (id.includes('@nuxt/ui') || id.includes('@headlessui')) {
                return 'ui-vendor';
              }
              if (id.includes('@vueuse')) {
                return 'vueuse-vendor';
              }
              return 'vendor';
            }
          },
        },
      },
      // Optimize minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
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
