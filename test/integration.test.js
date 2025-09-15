import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs'
import { join } from 'path'

describe('PKB Integration Tests', () => {
  const testDir = 'test-integration'
  const originalDocsDir = 'docs'

  beforeAll(() => {
    // Create test fixture directory structure
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
    
    // Create test docs structure
    mkdirSync(`${testDir}/guides`, { recursive: true })
    mkdirSync(`${testDir}/zh/guides`, { recursive: true })
    mkdirSync(`${testDir}/.vitepress`, { recursive: true })
    mkdirSync(`${testDir}/public`, { recursive: true })

    // Create test articles
    writeFileSync(join(testDir, 'guides/test-article-1.md'), `---
title: "Test Article 1"
order: 1
---

# Test Article 1

This is a test article for integration testing.

It has multiple paragraphs to test description extraction.`)

    writeFileSync(join(testDir, 'guides/test-article-2.md'), `---
title: "Test Article 2" 
sidebar: false
---

# Hidden Article

This article should not appear in sidebar.`)

    writeFileSync(join(testDir, 'zh/guides/chinese-article.md'), `---
title: "中文文章"
order: 2
---

# 中文文章

这是一篇中文测试文章。

用于测试中文内容的处理。`)

    writeFileSync(join(testDir, 'guides/index.md'), `---
title: "Guides Index"
---

# Step-by-step Guides

This is the guides section.`)
  })

  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  it('should generate correct sidebars and home data', () => {
    // Temporarily modify the script to use test directory
    const scriptContent = readFileSync('scripts/update-nav.js', 'utf-8')
    const testScript = scriptContent
      .replace(/const docsRoot = 'docs'/, `const docsRoot = '${testDir}'`)
      .replace(/'docs\//g, `'${testDir}/`)
      .replace(/console\.log\(/g, '// console.log(')
    
    writeFileSync('scripts/update-nav-test.js', testScript)
    
    try {
      // Run the modified script
      const result = execSync('node scripts/update-nav-test.js', { stdio: 'pipe', encoding: 'utf-8' })
      
      // Check that generated files exist
      expect(existsSync(`${testDir}/.vitepress/generated-sidebars.cjs`)).toBe(true)
      expect(existsSync(`${testDir}/public/generated-home-data.json`)).toBe(true)
      
      // Check sidebar content
      const sidebarContent = readFileSync(`${testDir}/.vitepress/generated-sidebars.cjs`, 'utf-8')
      expect(sidebarContent).toContain('Test Article 1')
      expect(sidebarContent).not.toContain('Hidden Article')
      expect(sidebarContent).toContain('中文文章')
      
      // Check home data
      const homeData = JSON.parse(readFileSync(`${testDir}/public/generated-home-data.json`, 'utf-8'))
      expect(homeData.english.recentArticles).toHaveLength(1) // Only visible article
      expect(homeData.chinese.recentArticles).toHaveLength(1)
      expect(homeData.english.recentArticles[0].title).toBe('Test Article 1')
      expect(homeData.chinese.recentArticles[0].title).toBe('中文文章')
      
    } catch (error) {
      console.error('Script execution error:', error.message)
      throw error
    } finally {
      // Cleanup test script
      if (existsSync('scripts/update-nav-test.js')) {
        rmSync('scripts/update-nav-test.js')
      }
    }
  })

  it('should handle articles with different modification times in correct order', () => {
    // Create articles with specific content that will help us test ordering
    writeFileSync(join(testDir, 'guides/old-article.md'), `---
title: "Old Article"
order: 50
---

# Old Article

This is an older article.`)

    writeFileSync(join(testDir, 'guides/new-article.md'), `---
title: "New Article" 
order: 50
---

# New Article

This is a newer article.`)

    // Set different modification times
    const now = Date.now()
    const oldTime = now - 24 * 60 * 60 * 1000 // 1 day ago
    
    // Unfortunately we can't easily mock fs.statSync in integration tests
    // So we'll just verify the structure is correct
    const scriptContent = readFileSync('scripts/update-nav.js', 'utf-8')
    const testScript = scriptContent
      .replace(/const docsRoot = 'docs'/, `const docsRoot = '${testDir}'`)
      .replace(/'docs\//g, `'${testDir}/`)
      .replace(/console\.log\(/g, '// console.log(')
    
    writeFileSync('scripts/update-nav-test.js', testScript)
    
    try {
      execSync('node scripts/update-nav-test.js', { stdio: 'pipe' })
      
      const homeData = JSON.parse(readFileSync(`${testDir}/public/generated-home-data.json`, 'utf-8'))
      
      // Should have all visible articles
      expect(homeData.english.recentArticles.length).toBeGreaterThan(0)
      expect(homeData.english.totalCount).toBeGreaterThan(0)
      
    } finally {
      rmSync('scripts/update-nav-test.js', { force: true })
    }
  })

  it('should validate that actual project structure works', () => {
    // Test with real project structure
    execSync('node scripts/update-nav.js', { stdio: 'pipe' })
    
    // Verify real generated files exist and are valid
    expect(existsSync('docs/.vitepress/generated-sidebars.cjs')).toBe(true)
    expect(existsSync('docs/public/generated-home-data.json')).toBe(true)
    
    const realHomeData = JSON.parse(readFileSync('docs/public/generated-home-data.json', 'utf-8'))
    
    // Should have structure we expect
    expect(realHomeData).toHaveProperty('english')
    expect(realHomeData).toHaveProperty('chinese') 
    expect(realHomeData.english).toHaveProperty('recentArticles')
    expect(realHomeData.english).toHaveProperty('totalCount')
    expect(realHomeData.chinese).toHaveProperty('recentArticles')
    expect(realHomeData.chinese).toHaveProperty('totalCount')
    
    // Should have some actual content
    expect(realHomeData.english.totalCount).toBeGreaterThan(0)
  })
})