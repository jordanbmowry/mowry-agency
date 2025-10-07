<template>
  <NuxtLink to="/" aria-label="Home" :class="avatarClasses">
    <img
      src="/images/avatar.jpg"
      alt=""
      :class="imageClasses"
      width="512"
      height="512"
      decoding="async"
      data-nimg="1"
      :sizes="large ? '4rem' : '2.25rem'"
      style="color: transparent"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import clsx from 'clsx';

interface Props {
  large?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  large: false,
  className: '',
});

const avatarClasses = computed(() =>
  clsx(props.className, 'pointer-events-auto')
);

const imageClasses = computed(() =>
  clsx(
    'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
    props.large ? 'h-16 w-16' : 'h-9 w-9'
  )
);
</script>
