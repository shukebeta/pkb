import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock VitePress useData
vi.mock('vitepress', () => ({
  useData: vi.fn(() => ({ lang: { value: 'en' } }))
}))

// Mock fetch globally
global.fetch = vi.fn()

// Dynamically import the component after mocks are set up
const DynamicHomePage = await import('../docs/.vitepress/components/DynamicHomePage.vue').then(m => m.default)

describe('DynamicHomePage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const sampleHomeData = {
    english: {
      recentArticles: [
        {
          title: 'Test Article 1',
          description: 'Description for article 1',
          link: '/guides/test-1',
          mtime: '2024-01-15T10:00:00Z',
          category: 'guides'
        },
        {
          title: 'Test Article 2', 
          description: 'Description for article 2',
          link: '/guides/test-2',
          mtime: '2024-01-14T10:00:00Z',
          category: 'troubleshooting'
        }
      ],
      totalCount: 10,
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    chinese: {
      recentArticles: [
        {
          title: '测试文章',
          description: '中文描述',
          link: '/zh/guides/test',
          mtime: '2024-01-15T10:00:00Z',
          category: 'guides'
        }
      ],
      totalCount: 5,
      lastUpdated: '2024-01-15T10:00:00Z'
    }
  }

  it('should mount component successfully', () => {
    const wrapper = mount(DynamicHomePage)
    expect(wrapper.find('.dynamic-home').exists()).toBe(true)
  })

  it('should handle successful data fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(sampleHomeData)
    })

    const wrapper = mount(DynamicHomePage)
    
    // Wait for mount and fetch
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.homeData).toEqual(sampleHomeData)
  })

  it('should handle fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    fetch.mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(DynamicHomePage)
    
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  describe('utility functions', () => {
    it('should return correct category icons', () => {
      const wrapper = mount(DynamicHomePage)
      
      expect(wrapper.vm.getCategoryIcon('guides')).toBe('📖')
      expect(wrapper.vm.getCategoryIcon('troubleshooting')).toBe('🔧')
      expect(wrapper.vm.getCategoryIcon('development')).toBe('💻')
      expect(wrapper.vm.getCategoryIcon('projects')).toBe('🚀')
      expect(wrapper.vm.getCategoryIcon('unknown')).toBe('📄')
    })

    it('should format dates correctly', () => {
      const wrapper = mount(DynamicHomePage)
      
      const testDate = '2024-01-15T10:00:00Z'
      const result = wrapper.vm.formatDate(testDate)
      
      // Should return formatted date string
      expect(result).toMatch(/Jan|January/)
      expect(result).toContain('15')
      expect(result).toContain('2024')
    })

    it('should handle invalid dates', () => {
      const wrapper = mount(DynamicHomePage)
      
      expect(wrapper.vm.formatDate(null)).toBe('')
      expect(wrapper.vm.formatDate('')).toBe('')
      expect(wrapper.vm.formatDate('invalid-date')).toBe('')
    })
  })
})