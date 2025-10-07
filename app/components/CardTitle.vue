<template>
  <component :is="as" class="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
    <CardLink v-if="href" :href="href">
      <slot />
    </CardLink>
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
import CardLink from './CardLink.vue'

interface CardTitleProps {
  as?: string
  href?: string
}

withDefaults(defineProps<CardTitleProps>(), {
  as: 'h2',
})
</script>
