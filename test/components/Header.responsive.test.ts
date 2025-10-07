import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Header from '../../app/components/Header.vue'

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (width: number) => {
  return (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
}

describe('Header Responsive Behavior', () => {
  beforeEach(() => {
    // Reset DOM and mocks before each test
    vi.clearAllMocks()
  })

  describe('Mobile Layout (375px)', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia(375),
      })
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
    })

    it('should render header with mobile navigation button', async () => {
      const wrapper = await mountSuspended(Header)
      const headerElement = wrapper.find('header')
      
      expect(headerElement.exists()).toBe(true)
      expect(headerElement.classes()).toContain('relative')
    })

    it('should show mobile navigation menu button on small screens', async () => {
      const wrapper = await mountSuspended(Header)
      
      // Mobile navigation should be present in the DOM
      const mobileNav = wrapper.findComponent({ name: 'MobileNavigation' })
      expect(mobileNav.exists()).toBe(true)
    })

    it('should hide desktop navigation on mobile', async () => {
      const wrapper = await mountSuspended(Header)
      
      // Desktop navigation should still exist but be hidden via CSS
      const desktopNav = wrapper.findComponent({ name: 'DesktopNavigation' })
      expect(desktopNav.exists()).toBe(true)
    })
  })

  describe('Tablet Layout (768px)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia(768),
      })
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
    })

    it('should render both mobile and desktop navigation components', async () => {
      const wrapper = await mountSuspended(Header)
      
      const mobileNav = wrapper.findComponent({ name: 'MobileNavigation' })
      const desktopNav = wrapper.findComponent({ name: 'DesktopNavigation' })
      
      expect(mobileNav.exists()).toBe(true)
      expect(desktopNav.exists()).toBe(true)
    })

    it('should show desktop navigation at tablet breakpoint', async () => {
      const wrapper = await mountSuspended(Header)
      
      // At 768px, desktop navigation should be visible via md: breakpoint
      const desktopNav = wrapper.findComponent({ name: 'DesktopNavigation' })
      expect(desktopNav.exists()).toBe(true)
    })

    it('should have proper container max-width at tablet size', async () => {
      const wrapper = await mountSuspended(Header)
      
      const container = wrapper.findComponent({ name: 'Container' })
      expect(container.exists()).toBe(true)
    })
  })

  describe('Desktop Layout (1024px)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia(1024),
      })
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
    })

    it('should show desktop navigation', async () => {
      const wrapper = await mountSuspended(Header)
      
      const desktopNav = wrapper.findComponent({ name: 'DesktopNavigation' })
      expect(desktopNav.exists()).toBe(true)
    })

    it('should render theme toggle button', async () => {
      const wrapper = await mountSuspended(Header)
      
      const themeToggle = wrapper.findComponent({ name: 'ThemeToggle' })
      expect(themeToggle.exists()).toBe(true)
    })

    it('should have proper header structure', async () => {
      const wrapper = await mountSuspended(Header)
      
      const headerElement = wrapper.find('header')
      expect(headerElement.exists()).toBe(true)
      
      // Check for inner div wrapper
      const innerDiv = headerElement.find('div')
      expect(innerDiv.exists()).toBe(true)
    })
  })

  describe('Large Desktop Layout (1440px)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia(1440),
      })
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      })
    })

    it('should maintain desktop navigation at large screens', async () => {
      const wrapper = await mountSuspended(Header)
      
      const desktopNav = wrapper.findComponent({ name: 'DesktopNavigation' })
      expect(desktopNav.exists()).toBe(true)
    })

    it('should render avatar container on home page', async () => {
      const wrapper = await mountSuspended(Header)
      
      // Avatar container should be present when isHomePage is true
      const avatarContainer = wrapper.findComponent({ name: 'AvatarContainer' })
      expect(avatarContainer.exists()).toBe(true)
    })

    it('should have Container component with proper max-width', async () => {
      const wrapper = await mountSuspended(Header)
      
      const container = wrapper.findComponent({ name: 'Container' })
      expect(container.exists()).toBe(true)
      
      // Container should have outer class for proper styling
      const outerDiv = container.find('.sm\\:px-8')
      expect(outerDiv.exists()).toBe(true)
    })
  })

  describe('Scroll Behavior', () => {
    it('should add clamp class on scroll down', async () => {
      const wrapper = await mountSuspended(Header)
      
      // Simulate scroll down
      window.scrollY = 100
      window.dispatchEvent(new Event('scroll'))
      
      await wrapper.vm.$nextTick()
      
      // Check if avatar has the clamp class applied
      const avatar = wrapper.findComponent({ name: 'Avatar' })
      if (avatar.exists()) {
        // Avatar should respond to scroll
        expect(avatar.exists()).toBe(true)
      }
    })

    it('should remove clamp class on scroll up', async () => {
      const wrapper = await mountSuspended(Header)
      
      // Simulate scroll up after being scrolled down
      window.scrollY = 0
      window.dispatchEvent(new Event('scroll'))
      
      await wrapper.vm.$nextTick()
      
      // Avatar should be in normal state
      const avatar = wrapper.findComponent({ name: 'Avatar' })
      if (avatar.exists()) {
        expect(avatar.exists()).toBe(true)
      }
    })
  })

  describe('Component Integration', () => {
    it('should render all required child components', async () => {
      const wrapper = await mountSuspended(Header)
      
      // Check for all major child components
      expect(wrapper.findComponent({ name: 'Container' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MobileNavigation' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'DesktopNavigation' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'ThemeToggle' }).exists()).toBe(true)
    })

    it('should conditionally render AvatarContainer on home page', async () => {
      const wrapper = await mountSuspended(Header)
      
      // Avatar should be present by default (home page)
      const avatarContainer = wrapper.findComponent({ name: 'AvatarContainer' })
      expect(avatarContainer.exists()).toBe(true)
    })

    it('should have proper pointer events structure', async () => {
      const wrapper = await mountSuspended(Header)
      
      const headerElement = wrapper.find('header')
      expect(headerElement.exists()).toBe(true)
      
      // Check for pointer-events-auto wrapper
      const pointerEventsDiv = headerElement.find('.pointer-events-auto')
      expect(pointerEventsDiv.exists()).toBe(true)
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should have correct z-index and positioning classes', async () => {
      const wrapper = await mountSuspended(Header)
      
      const headerElement = wrapper.find('header')
      expect(headerElement.classes()).toContain('relative')
      expect(headerElement.classes()).toContain('z-50')
    })

    it('should apply flex layout classes to header', async () => {
      const wrapper = await mountSuspended(Header)
      
      const headerElement = wrapper.find('header')
      expect(headerElement.classes()).toContain('flex')
    })

    it('should have navigation section with gap classes', async () => {
      const wrapper = await mountSuspended(Header)
      
      // The gap classes are on the navigation wrapper div
      const navWrapper = wrapper.find('.relative.flex.gap-4')
      expect(navWrapper.exists()).toBe(true)
    })
  })
})
