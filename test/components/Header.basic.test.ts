import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Header from '../../app/components/Header.vue'

describe('Header Component - Basic Tests', () => {
  it('should render the Header component', async () => {
    const wrapper = await mountSuspended(Header)
    expect(wrapper.exists()).toBe(true)
  })

  it('should contain a header element', async () => {
    const wrapper = await mountSuspended(Header)
    const headerElement = wrapper.find('header')
    expect(headerElement.exists()).toBe(true)
  })

  it('should have proper z-index class', async () => {
    const wrapper = await mountSuspended(Header)
    const headerElement = wrapper.find('header')
    expect(headerElement.classes()).toContain('z-50')
  })
})
