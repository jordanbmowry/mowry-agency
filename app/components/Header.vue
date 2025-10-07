<template>
  <div>
    <header
      class="pointer-events-none relative z-50 flex flex-none flex-col"
      :style="headerStyle"
    >
      <!-- Avatar reference div (invisible, just for positioning) -->
      <div
        v-if="isHomePage"
        ref="avatarRef"
        class="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
      />

      <!-- Avatar section (only on home page) -->
      <Container
        v-if="isHomePage"
        class="top-0 order-last -mb-3 pt-3"
        :style="navStyle"
      >
        <div
          class="top-[var(--avatar-top,theme(spacing.3))] w-full"
          :style="innerStyle"
        >
          <div class="relative">
            <!-- Avatar border (transforms based on scroll) -->
            <div
              class="absolute top-3 left-0 origin-left transition-opacity h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10"
              :style="{
                opacity: 'var(--avatar-border-opacity, 0)',
                transform: 'var(--avatar-border-transform)',
              }"
            />
            <!-- Avatar image -->
            <NuxtLink
              href="/"
              aria-label="Home"
              class="block h-16 w-16 origin-left pointer-events-auto"
              :style="{
                transform: 'var(--avatar-image-transform)',
              }"
            >
              <NuxtImg
                src="/images/avatar.jpg"
                alt="Avatar"
                width="64"
                height="64"
                class="rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 h-16 w-16"
              />
            </NuxtLink>
          </div>
        </div>
      </Container>

      <!-- Navigation section -->
      <div ref="headerRef" class="top-0 z-10 h-16 pt-6" :style="navStyle">
        <Container
          class="top-[var(--header-top,theme(spacing.6))] w-full"
          :style="innerStyle"
        >
          <div class="relative flex gap-4">
            <!-- Left column - Avatar for non-home pages -->
            <div class="flex flex-1">
              <div
                v-if="!isHomePage"
                class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 pointer-events-auto"
              >
                <NuxtLink href="/" aria-label="Home">
                  <NuxtImg
                    src="/images/avatar.jpg"
                    alt="Avatar"
                    width="32"
                    height="32"
                    class="rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 h-8 w-8"
                  />
                </NuxtLink>
              </div>
            </div>

            <!-- Center column - Navigation -->
            <div class="flex flex-1 justify-end md:justify-center items-center">
              <!-- Mobile Navigation -->
              <div class="pointer-events-auto md:hidden">
                <button
                  @click="showMobileMenu = !showMobileMenu"
                  class="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20"
                  type="button"
                >
                  Menu
                  <Icon
                    name="heroicons:chevron-down"
                    class="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400"
                  />
                </button>
              </div>

              <!-- Desktop Navigation -->
              <nav class="pointer-events-auto hidden md:block">
                <ul
                  class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
                >
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
                      href="/projects"
                      class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                      >Projects</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink
                      href="/speaking"
                      class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                      >Speaking</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink
                      href="/uses"
                      class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                      >Uses</NuxtLink
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
              href="/projects"
              class="block py-2"
              >Projects</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              @click="showMobileMenu = false"
              href="/speaking"
              class="block py-2"
              >Speaking</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              @click="showMobileMenu = false"
              href="/uses"
              class="block py-2"
              >Uses</NuxtLink
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
