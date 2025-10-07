<template>
  <div class="mt-16 sm:mt-20">
    <div class="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
      <div
        v-for="(image, imageIndex) in images"
        :key="image.src"
        :class="[
          'relative w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
          rotations[imageIndex % rotations.length],
        ]"
        style="aspect-ratio: 9/10"
      >
        <NuxtImg
          :src="image.src"
          :alt="image.alt"
          class="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          @error="onImageError"
          sizes="xs:160px sm:160px md:160px lg:160px xl:160px"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const rotations = [
  'rotate-2',
  '-rotate-2',
  'rotate-2',
  'rotate-2',
  '-rotate-2',
];

const images = [
  { src: '/images/photos/image-1.jpg', alt: 'Photo 1' },
  { src: '/images/photos/image-2.jpg', alt: 'Photo 2' },
  { src: '/images/photos/image-3.jpg', alt: 'Photo 3' },
  { src: '/images/photos/image-4.jpg', alt: 'Photo 4' },
  { src: '/images/photos/image-5.jpg', alt: 'Photo 5' },
];

const onImageError = (error: string | Event) => {
  // Handle NuxtImg error - just log it for now
  console.warn('Image failed to load:', error);
};
</script>
