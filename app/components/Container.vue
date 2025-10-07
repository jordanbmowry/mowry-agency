<template>
  <div :class="outerClasses">
    <div class="mx-auto w-full max-w-7xl lg:px-8">
      <div :class="innerClasses">
        <div class="mx-auto max-w-2xl lg:max-w-5xl">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import clsx from 'clsx';

interface Props {
  className?: string;
}

const props = defineProps<Props>();

const outerClasses = computed(() => clsx('sm:px-8', props.className));
const innerClasses = computed(() => 'relative px-4 sm:px-8 lg:px-12');
</script>
