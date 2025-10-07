<template>
  <Popover v-slot="{ open, close }">
    <PopoverButton
      class="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20"
    >
      Menu
      <ChevronDownIcon
        class="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400"
      />
    </PopoverButton>

    <Transition
      enter-active-class="duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80"
        @click="close"
      />
    </Transition>

    <Transition
      enter-active-class="duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <PopoverPanel
        v-if="open"
        class="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
      >
        <div class="flex flex-row-reverse items-center justify-between">
          <PopoverButton
            aria-label="Close menu"
            class="-m-1 p-1"
            @click="close"
          >
            <CloseIcon class="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </PopoverButton>
          <h2 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Navigation
          </h2>
        </div>
        <nav class="mt-6">
          <ul
            class="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300"
          >
            <MobileNavItem href="/about">About</MobileNavItem>
            <MobileNavItem href="/articles">Articles</MobileNavItem>
            <MobileNavItem href="/projects">Projects</MobileNavItem>
            <MobileNavItem href="/speaking">Speaking</MobileNavItem>
            <MobileNavItem href="/uses">Uses</MobileNavItem>
          </ul>
        </nav>
      </PopoverPanel>
    </Transition>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import MobileNavItem from './MobileNavItem.vue';
</script>

<script lang="ts">
// Icon components
function CloseIcon(props: any) {
  return h(
    'svg',
    {
      viewBox: '0 0 24 24',
      'aria-hidden': 'true',
      ...props,
    },
    [
      h('path', {
        d: 'm17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
    ]
  );
}

function ChevronDownIcon(props: any) {
  return h(
    'svg',
    {
      viewBox: '0 0 8 6',
      'aria-hidden': 'true',
      ...props,
    },
    [
      h('path', {
        d: 'M1.75 1.75 4 4.25l2.25-2.5',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
    ]
  );
}
</script>
