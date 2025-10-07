import { vi, beforeEach } from 'vitest'
import { config } from '@vue/test-utils'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRoute: vi.fn(() => ({
    path: '/',
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useColorMode: vi.fn(() => ({
    value: 'light',
    preference: 'light',
  })),
  useNuxtApp: vi.fn(() => ({
    $colorMode: {
      value: 'light',
      preference: 'light',
    },
  })),
}))

// Mock Nuxt components
config.global.stubs = {
  NuxtLink: {
    template: '<a><slot /></a>',
    props: ['to'],
  },
  NuxtImg: {
    template: '<img />',
    props: ['src', 'alt', 'width', 'height', 'sizes'],
  },
}

// Mock CSS imports
vi.mock('~/assets/css/main.css', () => ({}))

// Global test setup
beforeEach(() => {
  // Reset viewport for each test
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  })
})