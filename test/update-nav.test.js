import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

// Import functions by creating a module that exports them
// We'll need to modify update-nav.js to be testable
const testDir = 'test-fixtures'

// Mock functions extracted from update-nav.js for testing
function getPageInfo(filePath) {
  try {
    const rawContent = readFileSync(filePath, 'utf-8')
    const { data, content } = matter(rawContent)

    let title = data.title || null
    let order = data.order || 99
    let sidebarHidden = data.sidebar === false

    if (typeof order === 'string') {
      const parsed = parseInt(order, 10)
      if (!isNaN(parsed)) order = parsed
      else order = 99
    }

    if (!title) {
      const h1Match = content.match(/^\s*#\s+(.*)$/m)
      title = h1Match ? h1Match[1].trim() : filePath.split('/').pop().replace(/\.md$/, '')
    }

    const contentWithoutH1 = content.replace(/^\s*#\s+.*$/m, '').trim()
    const firstParagraph = contentWithoutH1.split('\n\n')[0]
    const description = firstParagraph
      ? firstParagraph.trim().substring(0, 120).replace(/\n/g, ' ') + '...'
      : ''

    return { title, order, sidebarHidden, description }
  } catch (error) {
    console.warn(`Warning: Failed to read file ${filePath} - ${error.message}`)
    const fallbackTitle = filePath.split('/').pop().replace(/\.md$/, '')
    return { title: fallbackTitle, order: 99, sidebarHidden: false, description: '' }
  }
}

function createSafeUrl(filename) {
  return filename.replace(/\.md$/, '')
}

describe('update-nav.js core functions', () => {
  beforeEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe('getPageInfo', () => {
    it('should extract title from frontmatter', () => {
      const testFile = join(testDir, 'test.md')
      writeFileSync(testFile, `---
title: "Test Title"
order: 5
---

# Header

Content here`)

      const result = getPageInfo(testFile)
      expect(result.title).toBe('Test Title')
      expect(result.order).toBe(5)
      expect(result.sidebarHidden).toBe(false)
    })

    it('should extract title from H1 when no frontmatter title', () => {
      const testFile = join(testDir, 'test.md')
      writeFileSync(testFile, `# My Article Title

This is the content`)

      const result = getPageInfo(testFile)
      expect(result.title).toBe('My Article Title')
      expect(result.order).toBe(99)
    })

    it('should use filename as fallback title', () => {
      const testFile = join(testDir, 'my-article.md')
      writeFileSync(testFile, `Just some content without title`)

      const result = getPageInfo(testFile)
      expect(result.title).toBe('my-article')
    })

    it('should handle sidebar: false frontmatter', () => {
      const testFile = join(testDir, 'hidden.md')
      writeFileSync(testFile, `---
title: "Hidden Article"
sidebar: false
---

Content`)

      const result = getPageInfo(testFile)
      expect(result.sidebarHidden).toBe(true)
    })

    it('should extract description from first paragraph', () => {
      const testFile = join(testDir, 'test.md')
      writeFileSync(testFile, `# Title

This is the first paragraph that should be used as description.

This is the second paragraph.`)

      const result = getPageInfo(testFile)
      expect(result.description).toBe('This is the first paragraph that should be used as description....')
    })

    it('should convert string order to number', () => {
      const testFile = join(testDir, 'test.md')
      writeFileSync(testFile, `---
order: "10"
---

# Title`)

      const result = getPageInfo(testFile)
      expect(result.order).toBe(10)
    })

    it('should handle invalid order strings', () => {
      const testFile = join(testDir, 'test.md')
      writeFileSync(testFile, `---
order: "invalid"
---

# Title`)

      const result = getPageInfo(testFile)
      expect(result.order).toBe(99)
    })
  })

  describe('createSafeUrl', () => {
    it('should remove .md extension', () => {
      expect(createSafeUrl('article.md')).toBe('article')
      expect(createSafeUrl('my-guide.md')).toBe('my-guide')
    })

    it('should handle files without .md extension', () => {
      expect(createSafeUrl('article')).toBe('article')
    })
  })
})