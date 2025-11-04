<template>
  <NuxtLink to="/" aria-label="Home" :class="avatarClasses">
    <ColorScheme placeholder="..." tag="span">
      <img
        v-if="!$colorMode.unknown"
        :src="
          $colorMode.value === 'dark'
            ? '/images/mowry_agency_logo_darkmode.png'
            : '/images/agency/Mowry_Agency_Logo.png'
        "
        alt="Mowry Agency Logo"
        :class="imageClasses"
        width="512"
        height="512"
        decoding="async"
        data-nimg="1"
        :sizes="large ? '4rem' : '2.25rem'"
        style="color: transparent"
      />

      <!-- Placeholder for SSR and unknown state -->
      <template #placeholder>
        <img
          src="/images/agency/Mowry_Agency_Logo.png"
          alt="Mowry Agency Logo"
          :class="imageClasses"
          width="512"
          height="512"
          decoding="async"
          data-nimg="1"
          :sizes="large ? '4rem' : '2.25rem'"
          style="color: transparent"
        />
      </template>
    </ColorScheme>
  </NuxtLink>
</template>

<script setup lang="ts">
import clsx from 'clsx';
import { computed } from 'vue';

interface Props {
  large?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  large: false,
  className: '',
});

const avatarClasses = computed(() => clsx(props.className, 'pointer-events-auto cursor-pointer'));

const imageClasses = computed(() =>
  clsx(
    'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
    props.large ? 'h-16 w-16' : 'h-9 w-9',
  ),
);
</script>
