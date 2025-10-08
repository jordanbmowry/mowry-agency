<template>
  <header class="bg-white/95 backdrop-blur-sm border-b border-zinc-200/40 dark:bg-zinc-900/95 dark:border-zinc-700/40 sticky top-0 z-50">
    <Container>
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink href="/" class="flex items-center space-x-3">
            <NuxtImg
              src="/images/agency/Mowry_Agency_Logo.png"
              alt="Mowry Agency Logo"
              width="40"
              height="40"
              class="h-10 w-10 rounded-lg object-contain"
            />
            <div class="hidden sm:block">
              <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Mowry Agency
              </h1>
              <p class="text-xs text-zinc-600 dark:text-zinc-400">
                Life Insurance Solutions
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink
            href="/about"
            class="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
          >
            About
          </NuxtLink>
          <NuxtLink
            href="/articles"
            class="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
          >
            Articles
          </NuxtLink>
          <NuxtLink
            href="/carriers"
            class="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
          >
            Carriers
          </NuxtLink>
          <NuxtLink
            href="/quote"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Get Quote
          </NuxtLink>
          <NuxtLink
            href="/join-us"
            class="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
          >
            Join Us
          </NuxtLink>
        </nav>

        <!-- CTA and Mobile Menu -->
        <div class="flex items-center space-x-4">
          <!-- Phone Number (Desktop) -->
          <a
            href="tel:+19303221962"
            class="hidden lg:flex items-center space-x-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            <Icon name="heroicons:phone" class="h-4 w-4" />
            <span>(930) 322-1962</span>
          </a>

          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- Mobile Menu Button -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-md text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Icon 
              :name="showMobileMenu ? 'heroicons:x-mark' : 'heroicons:bars-3'" 
              class="h-5 w-5" 
            />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div
        v-if="showMobileMenu"
        class="md:hidden border-t border-zinc-200 dark:border-zinc-700 py-4"
      >
        <nav class="flex flex-col space-y-3">
          <NuxtLink
            @click="showMobileMenu = false"
            href="/about"
            class="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            About
          </NuxtLink>
          <NuxtLink
            @click="showMobileMenu = false"
            href="/articles"
            class="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Articles
          </NuxtLink>
          <NuxtLink
            @click="showMobileMenu = false"
            href="/carriers"
            class="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Carriers
          </NuxtLink>
          <NuxtLink
            @click="showMobileMenu = false"
            href="/quote"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors text-center"
          >
            Get Quote
          </NuxtLink>
          <NuxtLink
            @click="showMobileMenu = false"
            href="/join-us"
            class="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Join Us
          </NuxtLink>
          <a
            href="tel:+19303221962"
            class="flex items-center space-x-2 text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Icon name="heroicons:phone" class="h-4 w-4" />
            <span>(930) 322-1962</span>
          </a>
        </nav>
      </div>
    </Container>
  </header>
</template>
                  <li>
                    <NuxtLink
                      href="/about"
                      class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                      >About</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink
                      href="/articles"
                      class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                      >Articles</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink
                      href="/carriers"
                      class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                      >Carriers</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink
                      href="/quote"
                      class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                      >Get Quote</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink
                      href="/join-us"
                      class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                      >Join Us</NuxtLink
                    >
                  </li>
                </ul>
              </nav>
            </div>

            <!-- Right column - Theme toggle -->
            <div class="flex justify-end md:flex-1 items-center">
              <div class="pointer-events-auto">
                <button
                  @click="toggleColorMode"
                  type="button"
                  :aria-label="
                    $colorMode.value === 'dark'
                      ? 'Switch to light theme'
                      : 'Switch to dark theme'
                  "
                  class="group rounded-full bg-white/90 px-3 py-2 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    class="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-teal-50 [@media(prefers-color-scheme:dark)]:stroke-teal-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-teal-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-teal-600"
                  >
                    <path
                      d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z"
                    />
                    <path
                      d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061"
                      fill="none"
                    />
                  </svg>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition not-[@media_(prefers-color-scheme:dark)]:fill-teal-400/10 not-[@media_(prefers-color-scheme:dark)]:stroke-teal-500 dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400"
                  >
                    <path
                      d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>

    <!-- Content offset for home page -->
    <div
      v-if="isHomePage"
      class="flex-none"
      style="height: var(--content-offset)"
    />

    <!-- Mobile Menu Backdrop -->
    <div
      v-if="showMobileMenu"
      @click="showMobileMenu = false"
      class="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur duration-150 dark:bg-black/80"
    />

    <!-- Mobile Menu Panel -->
    <div
      v-if="showMobileMenu"
      class="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 duration-150 dark:bg-zinc-900 dark:ring-zinc-800"
    >
      <div class="flex flex-row-reverse items-center justify-between">
        <button
          @click="showMobileMenu = false"
          aria-label="Close menu"
          class="-m-1 p-1"
        >
          <Icon
            name="heroicons:x-mark"
            class="h-6 w-6 text-zinc-500 dark:text-zinc-400"
          />
        </button>
        <h2 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Navigation
        </h2>
      </div>
      <nav class="mt-6">
        <ul
          class="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300"
        >
          <li>
            <NuxtLink
              @click="showMobileMenu = false"
              href="/about"
              class="block py-2"
              >About</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              @click="showMobileMenu = false"
              href="/articles"
              class="block py-2"
              >Articles</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              @click="showMobileMenu = false"
              href="/carriers"
              class="block py-2"
              >Carriers</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              @click="showMobileMenu = false"
              href="/quote"
              class="block py-2"
              >Get Quote</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              @click="showMobileMenu = false"
              href="/join-us"
              class="block py-2"
              >Join Us</NuxtLink
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import Container from './Container.vue';

const showMobileMenu = ref(false);
const { $colorMode } = useNuxtApp();
const route = useRoute();

// Check if we're on the home page
const isHomePage = computed(() => route.path === '/');

// Define computed styles for TypeScript compatibility
const headerStyle = computed(() => ({
  height: 'var(--header-height)',
  marginBottom: 'var(--header-mb)',
}));

const navStyle = computed(() => ({
  position: 'var(--header-position)' as any,
}));

const innerStyle = computed(() => ({
  position: 'var(--header-inner-position)' as any,
}));

// Toggle color mode function
const toggleColorMode = () => {
  $colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark';
};

// Initialize CSS variables
onMounted(() => {
  document.documentElement.style.setProperty('--header-position', 'relative');
  document.documentElement.style.setProperty('--header-height', 'auto');
  document.documentElement.style.setProperty('--header-mb', '0px');
  document.documentElement.style.setProperty('--header-top', '0px');
  document.documentElement.style.setProperty(
    '--header-inner-position',
    'relative'
  );
  document.documentElement.style.setProperty('--avatar-top', '12px'); // theme(spacing.3)

  // Avatar transform variables (these would be updated by scroll handlers)
  document.documentElement.style.setProperty('--avatar-border-opacity', '0');
  document.documentElement.style.setProperty(
    '--avatar-border-transform',
    'scale(1)'
  );
  document.documentElement.style.setProperty(
    '--avatar-image-transform',
    'scale(1)'
  );
});
</script>
