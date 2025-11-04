<template>
  <header
    class="bg-white/95 backdrop-blur-sm border-b border-zinc-200/40 dark:bg-zinc-900/95 dark:border-zinc-700/40 sticky top-0 z-50"
  >
    <Container>
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink href="/" class="flex items-center space-x-3 cursor-pointer">
            <ColorScheme placeholder="..." tag="span">
              <NuxtImg
                v-if="!$colorMode.unknown"
                :src="
                  $colorMode.value === 'dark'
                    ? '/images/mowry_agency_logo_darkmode.png'
                    : '/images/agency/Mowry_Agency_Logo.png'
                "
                alt="Mowry Agency Logo"
                width="40"
                height="40"
                class="h-10 w-10 rounded-lg object-contain"
              />

              <!-- Placeholder for SSR and unknown state -->
              <template #placeholder>
                <NuxtImg
                  src="/images/agency/Mowry_Agency_Logo.png"
                  alt="Mowry Agency Logo"
                  width="40"
                  height="40"
                  class="h-10 w-10 rounded-lg object-contain"
                />
              </template>
            </ColorScheme>
            <div class="hidden sm:block lg:hidden xl:block">
              <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Mowry Agency
              </h1>
              <p
                class="text-xs text-zinc-600 dark:text-zinc-400 hidden xl:block"
              >
                Life Insurance Solutions
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav
          v-auto-animate
          class="hidden md:flex items-center space-x-4 lg:space-x-8"
        >
          <template v-for="item in desktopNavItems" :key="item.href">
            <NuxtLink
              v-if="!item.isButton"
              :href="item.href"
              :class="getDesktopNavClasses(item)"
            >
              <span>{{ item.name }}</span>
              <Icon
                name="heroicons:arrow-right"
                class="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              />
            </NuxtLink>
            <NuxtLink
              v-else
              :href="item.href"
              :class="getDesktopNavClasses(item)"
            >
              {{ item.name }}
            </NuxtLink>
          </template>
        </nav>

        <!-- CTA and Mobile Menu -->
        <div class="flex items-center space-x-6">
          <!-- Phone Number (Desktop) -->
          <a
            :href="`tel:+1${cleanPhone}`"
            class="hidden xl:flex items-center space-x-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer"
          >
            <Icon name="heroicons:phone" class="h-4 w-4" />
            <span>{{ agencyPhone }}</span>
          </a>

          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- Mobile Menu Button -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-3 rounded-md text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Icon
              :name="showMobileMenu ? 'heroicons:x-mark' : 'heroicons:bars-3'"
              class="h-6 w-6"
            />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div
        v-if="showMobileMenu"
        v-auto-animate
        class="md:hidden border-t border-zinc-200 dark:border-zinc-700 py-4"
      >
        <nav v-auto-animate class="flex flex-col space-y-3">
          <NuxtLink
            v-for="item in mobileNavItems"
            :key="item.href"
            @click="showMobileMenu = false"
            :href="item.href"
            :class="getMobileNavClasses(item)"
          >
            <span>{{ item.name }}</span>
            <Icon
              v-if="!item.isButton"
              name="heroicons:arrow-right"
              class="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            />
          </NuxtLink>
          <a
            :href="`tel:+1${cleanPhone}`"
            class="flex items-center space-x-2 text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Icon name="heroicons:phone" class="h-4 w-4" />
            <span>{{ agencyPhone }}</span>
          </a>
        </nav>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Mobile menu state
const showMobileMenu = ref(false);

// Get current route
const route = useRoute();

// Get runtime config for agency contact info
const config = useRuntimeConfig();
const agencyPhone = config.public.agencyPhone as string;
const cleanPhone = agencyPhone.replace(/[^\d]/g, '');

// Navigation items
const navigationItems = [
  { name: 'Home', href: '/', exact: true },
  { name: 'About', href: '/about' },
  { name: 'Articles', href: '/articles' },
  { name: 'Carriers', href: '/carriers' },
  { name: 'Get Quote', href: '/quote', isButton: true },
  { name: 'Join Us', href: '/join-us' },
];

// Helper function to check if route is active
const isActiveRoute = (item: { href: string; exact?: boolean }) => {
  if (item.exact) {
    return route.path === item.href;
  }
  return route.path.startsWith(item.href);
};

// Desktop navigation items (with active styling)
const desktopNavItems = computed(() =>
  navigationItems.map((item) => ({
    ...item,
    isActive: isActiveRoute(item),
  })),
);

// Mobile navigation items (excluding current page)
const mobileNavItems = computed(() => navigationItems.filter((item) => !isActiveRoute(item)));

// Get CSS classes for desktop navigation
const getDesktopNavClasses = (item: { isButton?: boolean; isActive?: boolean }) => {
  if (item.isButton) {
    return 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer';
  }

  const baseClasses =
    'text-sm font-medium transition-all duration-200 relative group flex items-center gap-1 cursor-pointer';
  const colorClasses =
    'text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100';
  const activeClasses = item.isActive
    ? 'after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-full'
    : '';

  return `${baseClasses} ${colorClasses} ${activeClasses}`.trim();
};

// Get CSS classes for mobile navigation
const getMobileNavClasses = (item: { isButton?: boolean }) => {
  if (item.isButton) {
    return 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors text-center cursor-pointer';
  }
  return 'text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 group flex items-center gap-2 cursor-pointer';
};
</script>
