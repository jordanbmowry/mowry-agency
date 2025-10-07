# GitHub Copilot Instructions

## Project Context

This is a **Nuxt.js migration** of the [Spotlight Template](https://spotlight.tailwindui.com/) from Tailwind UI. The project demonstrates a pixel-perfect migration from Next.js to Nuxt.js while maintaining all visual design, animations, and responsive behavior.

## Tech Stack & Architecture

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS v4 with custom typography system
- **UI Library**: Headless UI Vue for accessible components
- **Theme System**: Nuxt Color Mode for dark/light theme switching
- **Images**: Nuxt Image for optimized image handling
- **Testing**: Vitest for unit tests, Playwright for e2e testing

## Key Design Principles

### 1. Pixel-Perfect Fidelity

- Every component must match the original Spotlight design exactly
- Responsive breakpoints must behave identically to the Next.js version
- Animations and micro-interactions should be indistinguishable

### 2. Performance First

- Use Nuxt's auto-imports and optimizations
- Implement proper SSR/SSG support
- Optimize images and assets

### 3. Accessibility

- Maintain ARIA labels and semantic HTML
- Ensure keyboard navigation works properly
- Support screen readers and assistive technologies

## Component Architecture

### Header System

The header is the most complex component with several key features:

```vue
Header.vue (Main orchestrator) ├── Container.vue (Layout wrapper) ├── Avatar.vue
(User avatar with link) ├── AvatarContainer.vue (Styled avatar wrapper) ├──
ThemeToggle.vue (Dark/light mode toggle) ├── DesktopNavigation.vue (Desktop nav
menu) ├── MobileNavigation.vue (Mobile dropdown menu) ├── NavItem.vue
(Individual nav links) └── MobileNavItem.vue (Mobile nav links)
```

### Critical Features

1. **Scroll Animations**: Avatar scaling and header position changes
2. **Responsive Navigation**: Mobile/desktop navigation switching at 768px
3. **Theme Switching**: Seamless light/dark mode transitions
4. **Mobile Animations**: Backdrop blur and scale animations for mobile menu

## Development Guidelines

### Vue 3 Patterns

```vue
<!-- Use Composition API -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Prefer composables for reusable logic
const { $colorMode } = useNuxtApp();
const route = useRoute();

// Use computed for reactive derived state
const isActive = computed(() => route.path === href);
</script>
```

### Styling Conventions

```vue
<!-- Use Tailwind classes that match the original design -->
<template>
  <div class="bg-zinc-50 dark:bg-black">
    <!-- Prefer semantic class combinations -->
    <button
      class="rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm"
    >
      Menu
    </button>
  </div>
</template>
```

### Animation Patterns

```vue
<!-- Use Vue transitions for component animations -->
<Transition
  enter-active-class="duration-150 ease-out"
  enter-from-class="opacity-0 scale-95"
  enter-to-class="opacity-100 scale-100"
>
  <div v-if="open">Animated content</div>
</Transition>
```

## Responsive Design

### Breakpoints

- **Mobile**: `< 768px` - Mobile navigation, right-aligned
- **Tablet**: `768px - 1024px` - Desktop navigation appears
- **Desktop**: `> 1024px` - Full desktop layout

### Key Responsive Behaviors

```vue
<!-- Mobile/Desktop navigation switching -->
<MobileNavigation class="pointer-events-auto md:hidden" />
<DesktopNavigation class="pointer-events-auto hidden md:block" />

<!-- Responsive container padding -->
<div class="sm:px-8">
  <div class="mx-auto w-full max-w-7xl lg:px-8">
    <!-- Content -->
  </div>
</div>
```

## Testing Strategy

### Component Testing

```typescript
// Test responsive behavior
describe('Header Responsive Tests', () => {
  test('shows mobile navigation on small screens', () => {
    // Test mobile breakpoint behavior
  });

  test('shows desktop navigation on large screens', () => {
    // Test desktop breakpoint behavior
  });
});
```

### E2E Testing

- Test theme switching functionality
- Verify mobile menu animations
- Check scroll behavior and avatar animations
- Validate navigation between pages

## Migration Considerations

### Next.js → Nuxt.js Mapping

| Next.js             | Nuxt.js           | Notes              |
| ------------------- | ----------------- | ------------------ |
| `usePathname()`     | `useRoute().path` | Route detection    |
| `next/image`        | `<NuxtImg>`       | Image optimization |
| `next-themes`       | `useColorMode()`  | Theme management   |
| `@headlessui/react` | `@headlessui/vue` | UI components      |

### Common Patterns

```vue
<!-- Navigation active state -->
<script setup>
const route = useRoute();
const isActive = computed(() => route.path === href);
</script>

<!-- Theme toggle -->
<script setup>
const colorMode = useColorMode();
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>
```

## Performance Optimizations

### Image Handling

```vue
<NuxtImg
  src="/images/avatar.jpg"
  alt="Avatar"
  width="64"
  height="64"
  sizes="4rem"
  class="rounded-full"
/>
```

### CSS Custom Properties

```css
/* Dynamic header positioning */
:root {
  --header-height: auto;
  --header-position: sticky;
  --avatar-image-transform: scale(1);
}
```

## Debugging Tips

### Common Issues

1. **Hydration Mismatches**: Ensure server/client rendering consistency
2. **Animation Glitches**: Check transition classes and timing
3. **Theme Flashing**: Verify color mode configuration
4. **Mobile Menu Issues**: Check z-index and pointer-events

### Development Tools

- Vue DevTools for component inspection
- Browser DevTools for responsive testing
- Lighthouse for performance auditing

## Code Quality Standards

### TypeScript Usage

```typescript
// Define prop interfaces
interface Props {
  href: string;
  className?: string;
}

// Use proper typing for composables
const colorMode: Ref<'light' | 'dark'> = useColorMode();
```

### Component Documentation

```vue
<!--
Header Component
- Handles responsive navigation switching
- Manages scroll-based avatar animations
- Provides theme toggle functionality
-->
<template>
  <!-- Component implementation -->
</template>
```

## File Organization

```
app/
├── components/           # Reusable UI components
├── layouts/             # Page layouts
├── pages/               # File-based routing
├── assets/css/          # Global styles
└── public/images/       # Static assets
```

Remember: Every change should maintain the exact visual fidelity and behavior of the original Spotlight template while leveraging Nuxt.js best practices and performance optimizations.
