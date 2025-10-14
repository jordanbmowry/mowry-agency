<template>
  <button
    type="button"
    :aria-label="'Toggle theme'"
    class="group rounded-full bg-white/90 p-3 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20 flex items-center justify-center cursor-pointer"
    @click="toggleTheme"
  >
    <ColorScheme placeholder="..." tag="span">
      <!-- Show correct icon when we know the theme -->
      <template v-if="!$colorMode.unknown">
        <!-- Sun icon - show in dark mode -->
        <Icon
          v-if="$colorMode.value === 'dark'"
          name="heroicons:sun"
          class="h-5 w-5 text-zinc-400 transition group-hover:text-zinc-300"
        />
        <!-- Moon icon - show in light mode -->
        <Icon
          v-else
          name="heroicons:moon"
          class="h-5 w-5 text-zinc-600 transition group-hover:text-zinc-700"
        />
      </template>

      <!-- Placeholder for SSR and unknown state -->
      <template #placeholder>
        <Icon name="heroicons:sun" class="h-5 w-5 text-zinc-500 opacity-70" />
      </template>
    </ColorScheme>
  </button>
</template>

<script setup lang="ts">
const { $colorMode } = useNuxtApp();

function toggleTheme() {
  // Toggle between light and dark mode only
  $colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>
