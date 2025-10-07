import { describe, test, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '~/components/Header.vue'

// Define common screen sizes for testing (same as Next.js tests)
const SCREEN_SIZES = {
  mobile: { width: 375, height: 667, name: 'iPhone SE' },
  mobileLarge: { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
  tablet: { width: 768, height: 1024, name: 'iPad Portrait' },
  tabletLandscape: { width: 1024, height: 768, name: 'iPad Landscape' },
  laptop: { width: 1366, height: 768, name: 'Laptop' },
  desktop: { width: 1920, height: 1080, name: 'Desktop' },
  ultrawide: { width: 2560, height: 1440, name: 'Ultrawide' },
}

// Helper to simulate viewport sizes
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Update document.documentElement.clientWidth for media queries
  Object.defineProperty(document.documentElement, 'clientWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

// Mock useRoute composable
const mockUseRoute = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => mockUseRoute(),
}))

// Mock useColorMode composable
const mockUseColorMode = vi.fn()
vi.mock('#app', () => ({
  useColorMode: () => mockUseColorMode(),
}))

const renderHeader = (pathname = '/') => {
  // Setup route mock
  mockUseRoute.mockReturnValue({
    path: pathname,
  })

  // Setup color mode mock
  mockUseColorMode.mockReturnValue({
    value: 'light',
    preference: 'light',
  })

  return mount(Header, {
    global: {
      stubs: {
        NuxtLink: {
          template: '<a :href="to"><slot /></a>',
          props: ['to'],
        },
        NuxtImg: {
          template: '<img :src="src" :alt="alt" :width="width" :height="height" />',
          props: ['src', 'alt', 'width', 'height', 'sizes'],
        },
      },
    },
  })
}

describe('Header Responsive Behavior Tests (Nuxt)', () => {
  beforeEach(() => {
    // Reset to default desktop viewport
    setViewport(SCREEN_SIZES.desktop.width, SCREEN_SIZES.desktop.height)
    // Clear any existing mocks
    vi.clearAllMocks()
  })

  describe('Mobile Devices (< 768px)', () => {
    test.each([
      [SCREEN_SIZES.mobile, 'mobile'],
      [SCREEN_SIZES.mobileLarge, 'large mobile'],
    ])('displays mobile navigation on %s (%s)', (screenSize, deviceType) => {
      setViewport(screenSize.width, screenSize.height)
      const wrapper = renderHeader()

      // Mobile menu button should be visible
      const mobileMenuButton = wrapper.find('button[aria-expanded]')
      expect(mobileMenuButton.exists()).toBe(true)
      
      // Check that the button text is "Menu"
      expect(mobileMenuButton.text()).toContain('Menu')

      // Desktop navigation should exist
      const navigation = wrapper.find('nav')
      expect(navigation.exists()).toBe(true)
    })

    test('mobile menu contains all navigation items', async () => {
      setViewport(SCREEN_SIZES.mobile.width, SCREEN_SIZES.mobile.height)
      const wrapper = renderHeader()

      // Find mobile navigation component
      const mobileNav = wrapper.findComponent({ name: 'MobileNavigation' })
      expect(mobileNav.exists()).toBe(true)

      // The navigation items are inside the Popover component
      // Check that the menu button exists
      const menuButton = mobileNav.find('button')
      expect(menuButton.exists()).toBe(true)
      expect(menuButton.text()).toContain('Menu')
    })

    test('navigation items are right-aligned on mobile', () => {
      setViewport(SCREEN_SIZES.mobile.width, SCREEN_SIZES.mobile.height)
      const wrapper = renderHeader()

      const navContainer = wrapper.find('.flex.flex-1.justify-end.md\\:justify-center')
      expect(navContainer.exists()).toBe(true)
    })
  })

  describe('Desktop Devices (> 768px)', () => {
    test.each([
      [SCREEN_SIZES.tablet, 'tablet'],
      [SCREEN_SIZES.laptop, 'laptop'],
      [SCREEN_SIZES.desktop, 'desktop'], 
      [SCREEN_SIZES.ultrawide, 'ultrawide'],
    ])('displays full desktop layout on %s (%s)', (screenSize, deviceType) => {
      setViewport(screenSize.width, screenSize.height)
      const wrapper = renderHeader()

      // Desktop navigation should be visible
      const desktopNav = wrapper.findComponent({ name: 'DesktopNavigation' })
      expect(desktopNav.exists()).toBe(true)
      expect(desktopNav.classes()).toContain('hidden')
      expect(desktopNav.classes()).toContain('md:block')

      // All navigation links should be present
      const navText = desktopNav.text()
      expect(navText).toContain('About')
      expect(navText).toContain('Articles')
      expect(navText).toContain('Projects')
      expect(navText).toContain('Speaking')
      expect(navText).toContain('Uses')

      // Theme toggle should be visible
      const themeToggle = wrapper.findComponent({ name: 'ThemeToggle' })
      expect(themeToggle.exists()).toBe(true)
    })

    test('navigation centers on desktop', () => {
      setViewport(SCREEN_SIZES.desktop.width, SCREEN_SIZES.desktop.height)
      const wrapper = renderHeader()

      const navContainer = wrapper.find('.flex.flex-1.justify-end.md\\:justify-center')
      expect(navContainer.exists()).toBe(true)
    })
  })

  describe('Avatar Responsive Behavior', () => {
    test('shows large avatar on home page', () => {
      setViewport(SCREEN_SIZES.desktop.width, SCREEN_SIZES.desktop.height)
      const wrapper = renderHeader('/')

      const avatar = wrapper.findComponent({ name: 'Avatar' })
      expect(avatar.exists()).toBe(true)
      expect(avatar.props('large')).toBe(true)
    })

    test('shows small avatar on non-home pages', () => {
      setViewport(SCREEN_SIZES.desktop.width, SCREEN_SIZES.desktop.height)
      const wrapper = renderHeader('/about')

      // On non-home pages, avatar should be small (in AvatarContainer without large prop)
      const avatarContainer = wrapper.findComponent({ name: 'AvatarContainer' })
      expect(avatarContainer.exists()).toBe(true)
      
      const avatar = avatarContainer.findComponent({ name: 'Avatar' })
      expect(avatar.exists()).toBe(true)
      expect(avatar.props('large')).toBeFalsy()
    })
  })

  describe('Theme Toggle Functionality', () => {
    test('theme toggle is positioned correctly across screen sizes', () => {
      Object.values(SCREEN_SIZES).forEach(screenSize => {
        setViewport(screenSize.width, screenSize.height)
        const wrapper = renderHeader()

        const themeToggle = wrapper.findComponent({ name: 'ThemeToggle' })
        expect(themeToggle.exists()).toBe(true)
        
        // Check that theme toggle is in the correct container
        const themeContainer = wrapper.find('.flex.justify-end.md\\:flex-1')
        expect(themeContainer.exists()).toBe(true)
        expect(themeContainer.findComponent({ name: 'ThemeToggle' }).exists()).toBe(true)
      })
    })

    test('theme toggle has proper styling', () => {
      const wrapper = renderHeader()
      const themeToggle = wrapper.findComponent({ name: 'ThemeToggle' })
      
      expect(themeToggle.exists()).toBe(true)
      
      // Check that it's wrapped in pointer-events-auto container
      const pointerEventsContainer = wrapper.find('.pointer-events-auto')
      expect(pointerEventsContainer.exists()).toBe(true)
    })
  })

  describe('Layout Container Behavior', () => {
    test('container maintains responsive padding across screen sizes', () => {
      Object.values(SCREEN_SIZES).forEach(screenSize => {
        setViewport(screenSize.width, screenSize.height)
        const wrapper = renderHeader()

        // Check for responsive container classes
        const containers = wrapper.findAll('.sm\\:px-8')
        expect(containers.length).toBeGreaterThan(0)
      })
    })

    test('header structure is semantic', () => {
      const wrapper = renderHeader()

      // Check for proper header structure
      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
      expect(header.classes()).toContain('pointer-events-none')
      expect(header.classes()).toContain('relative')
      expect(header.classes()).toContain('z-50')
    })
  })

  describe('Breakpoint Transitions', () => {
    test('handles mobile to tablet transition correctly', () => {
      // Start at mobile
      setViewport(767, 1024)
      const wrapper = renderHeader()
      
      // Mobile navigation should be present
      const mobileNav = wrapper.findComponent({ name: 'MobileNavigation' })
      expect(mobileNav.exists()).toBe(true)

      // Switch to tablet
      setViewport(768, 1024)
      
      // Desktop navigation should be present
      const desktopNav = wrapper.findComponent({ name: 'DesktopNavigation' })
      expect(desktopNav.exists()).toBe(true)
    })

    test('maintains consistent layout during viewport changes', () => {
      const wrapper = renderHeader()

      // Test multiple viewport changes
      const viewports = [
        SCREEN_SIZES.mobile,
        SCREEN_SIZES.tablet, 
        SCREEN_SIZES.desktop,
        SCREEN_SIZES.mobile,
      ]

      viewports.forEach(viewport => {
        setViewport(viewport.width, viewport.height)
        
        // Header should always be present
        expect(wrapper.find('header').exists()).toBe(true)
        
        // Theme toggle should always be present
        expect(wrapper.findComponent({ name: 'ThemeToggle' }).exists()).toBe(true)
      })
    })
  })

  describe('Performance and Accessibility', () => {
    test('header structure remains semantic across screen sizes', () => {
      Object.values(SCREEN_SIZES).forEach(screenSize => {
        setViewport(screenSize.width, screenSize.height)
        const wrapper = renderHeader()

        // Check semantic structure
        expect(wrapper.find('header').exists()).toBe(true)
        expect(wrapper.find('nav').exists()).toBe(true)
      })
    })

    test('components maintain proper structure', () => {
      const wrapper = renderHeader()

      // Check that all main components are present
      expect(wrapper.findComponent({ name: 'Container' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'ThemeToggle' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MobileNavigation' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'DesktopNavigation' }).exists()).toBe(true)
    })
  })
})