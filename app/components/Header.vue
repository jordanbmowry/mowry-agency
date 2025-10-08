<template>
  <header
    class="bg-white/95 backdrop-blur-sm border-b border-zinc-200/40 dark:bg-zinc-900/95 dark:border-zinc-700/40 sticky top-0 z-50"
  >
    <Container>
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink href="/" class="flex items-center space-x-3">
            <NuxtImg
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
        <div class="flex items-center space-x-6">
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
            class="md:hidden p-3 rounded-md text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
        class="md:hidden border-t border-zinc-200 dark:border-zinc-700 py-4"
      >
        <nav class="flex flex-col space-y-3">
          <NuxtLink
            @click="showMobileMenu = false"
            href="/"
            class="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Home
          </NuxtLink>
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

<script setup lang="ts">
import { ref } from 'vue';

// Mobile menu state
const showMobileMenu = ref(false);
</script>
