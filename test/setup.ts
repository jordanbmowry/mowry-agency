import { vi, beforeEach } from 'vitest';
import { config } from '@vue/test-utils';
import { ref } from 'vue';

// Mock $fetch globally first
const mockFetch = vi.fn().mockResolvedValue({ success: true });
vi.stubGlobal('$fetch', mockFetch);

// Mock Nuxt composables with simpler, more stable approach
vi.mock('#app', () => ({
  defineNuxtPlugin: vi.fn((plugin) => plugin),
  defineNuxtRouteMiddleware: vi.fn((middleware) => middleware),
  definePageMeta: vi.fn(),
  navigateTo: vi.fn(),
  abortNavigation: vi.fn(),
  throwError: vi.fn(),
  clearError: vi.fn(),
  isNuxtError: vi.fn(),
  useRoute: vi.fn(() => ({
    path: '/',
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    name: undefined,
    redirectedFrom: undefined,
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    beforeResolve: vi.fn(),
    afterEach: vi.fn(),
    currentRoute: { value: { path: '/' } },
  })),
  useColorMode: vi.fn(() => ref('light')),
  useNuxtApp: vi.fn(() => ({
    $colorMode: ref('light'),
    $config: {},
    ssrContext: null,
    payload: {},
    isHydrating: false,
    runWithContext: vi.fn((fn) => fn()),
  })),
  useState: vi.fn((key, init) => ref(init ? init() : undefined)),
  useCookie: vi.fn(() => ref(undefined)),
  useRequestHeaders: vi.fn(() => ({})),
  useRequestEvent: vi.fn(() => ({})),
  useRuntimeConfig: vi.fn(() => ({
    app: {},
    public: {},
  })),
  useLazyFetch: vi.fn(() => ({
    data: ref(null),
    pending: ref(false),
    error: ref(null),
    refresh: vi.fn(),
  })),
  $fetch: mockFetch,
  refreshCookie: vi.fn(),
  createError: vi.fn((options) => new Error(options.statusMessage)),
  showError: vi.fn(),
}));

// Mock #imports for Nuxt auto-imports
vi.mock('#imports', () => ({
  useRoute: vi.fn(() => ({ path: '/' })),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useColorMode: vi.fn(() => ref('light')),
  useNuxtApp: vi.fn(() => ({ $colorMode: ref('light') })),
  useState: vi.fn((key, init) => ref(init ? init() : undefined)),
  $fetch: mockFetch,
}));

// Suppress Vue warnings in tests
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = vi.fn();
});

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
};

// Mock CSS imports
vi.mock('~/assets/css/main.css', () => ({}));

// Global test setup
beforeEach(() => {
  // Reset viewport for each test
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  });
});
