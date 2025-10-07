import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Photos from '~/components/Photos.vue';

// Stub NuxtImg to render as img tag
const NuxtImgStub = {
  name: 'NuxtImg',
  props: ['src', 'alt', 'sizes', 'class'],
  template: '<img :src="src" :alt="alt" :class="class" />',
};

describe('Photos Component', () => {
  describe('Responsive Behavior', () => {
    it('renders 5 photo images', () => {
      const wrapper = mount(Photos, {
        global: {
          stubs: {
            NuxtImg: NuxtImgStub,
          },
        },
      });
      const images = wrapper.findAll('img');

      expect(images).toHaveLength(5);
    });

    it('applies correct responsive width classes', () => {
      const wrapper = mount(Photos);
      const photoContainers = wrapper.findAll('.aspect-9\\/10');

      expect(photoContainers).toHaveLength(5);

      photoContainers.forEach((container) => {
        const classes = container.classes();
        // Check for mobile width (w-44 = 11rem = 176px)
        expect(classes).toContain('w-44');
        // Check for desktop width (sm:w-72 = 18rem = 288px)
        expect(classes).toContain('sm:w-72');
      });
    });

    it('applies rotation classes to photos', () => {
      const wrapper = mount(Photos);
      const photoContainers = wrapper.findAll('.aspect-9\\/10');
      const expectedRotations = [
        'rotate-2',
        '-rotate-2',
        'rotate-2',
        'rotate-2',
        '-rotate-2',
      ];

      photoContainers.forEach((container, index) => {
        const classes = container.classes();
        const expectedRotation = expectedRotations[index];
        expect(classes).toContain(expectedRotation);
      });
    });

    it('has correct aspect ratio', () => {
      const wrapper = mount(Photos);
      const photoContainers = wrapper.findAll('.aspect-9\\/10');

      photoContainers.forEach((container) => {
        const classes = container.classes();
        expect(classes).toContain('aspect-9/10');
      });
    });

    it('applies responsive border radius', () => {
      const wrapper = mount(Photos);
      const photoContainers = wrapper.findAll('.aspect-9\\/10');

      photoContainers.forEach((container) => {
        const classes = container.classes();
        // Mobile: rounded-xl
        expect(classes).toContain('rounded-xl');
        // Desktop: sm:rounded-2xl
        expect(classes).toContain('sm:rounded-2xl');
      });
    });

    it('contains overflow-hidden container with responsive gap', () => {
      const wrapper = mount(Photos);
      const gapContainer = wrapper.find('.overflow-hidden');

      expect(gapContainer.exists()).toBe(true);
      const classes = gapContainer.classes();
      expect(classes).toContain('gap-5'); // mobile gap
      expect(classes).toContain('sm:gap-8'); // desktop gap
    });
  });

  describe('Image Attributes', () => {
    it('renders images with correct src paths', () => {
      const wrapper = mount(Photos, {
        global: {
          stubs: {
            NuxtImg: NuxtImgStub,
          },
        },
      });
      const images = wrapper.findAll('img');

      expect(images).toHaveLength(5);

      const expectedPaths = [
        '/images/photos/image-1.jpg',
        '/images/photos/image-2.jpg',
        '/images/photos/image-3.jpg',
        '/images/photos/image-4.jpg',
        '/images/photos/image-5.jpg',
      ];

      images.forEach((img, index) => {
        expect(img.attributes('src')).toBe(expectedPaths[index]);
      });
    });

    it('images have object-cover class for proper scaling', () => {
      const wrapper = mount(Photos, {
        global: {
          stubs: {
            NuxtImg: NuxtImgStub,
          },
        },
      });
      const images = wrapper.findAll('img');

      images.forEach((img) => {
        const classes = img.classes();
        expect(classes).toContain('object-cover');
      });
    });

    it('images fill their containers', () => {
      const wrapper = mount(Photos, {
        global: {
          stubs: {
            NuxtImg: NuxtImgStub,
          },
        },
      });
      const images = wrapper.findAll('img');

      images.forEach((img) => {
        const classes = img.classes();
        expect(classes).toContain('absolute');
        expect(classes).toContain('inset-0');
        expect(classes).toContain('h-full');
        expect(classes).toContain('w-full');
      });
    });
  });
});
