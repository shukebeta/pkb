#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs'
import { join, basename, resolve } from 'path'
import matter from 'gray-matter'

const docsRoot = 'docs'

function getFileStats(filePath) {
  try {
    const stats = statSync(filePath)
    return {
      mtime: stats.mtime,
      birthtime: stats.birthtime
    }
  } catch {
    return null
  }
}


function getPageInfo(filePath) {
  try {
    const rawContent = readFileSync(filePath, 'utf-8')
    const { data, content } = matter(rawContent)
    
    // Get metadata from frontmatter
    let title = data.title || null
    let order = data.order || 99
    let sidebarHidden = data.sidebar === false
    
    // Convert order to number if it's a string
    if (typeof order === 'string') {
      const parsed = parseInt(order, 10)
      if (!isNaN(parsed)) order = parsed
      else order = 99
    }
    
    // If no title in frontmatter, extract from content's first H1
    if (!title) {
      const h1Match = content.match(/^\s*#\s+(.*)$/m)
      title = h1Match ? h1Match[1].trim() : basename(filePath).replace(/\.md$/, '')
    }
    
    // Get description from first paragraph in content (after removing H1)
    const contentWithoutH1 = content.replace(/^\s*#\s+.*$/m, '').trim()
    const firstParagraph = contentWithoutH1.split('\n\n')[0]
    const description = firstParagraph 
      ? firstParagraph.trim().substring(0, 120).replace(/\n/g, ' ') + '...'
      : ''
    
    const stats = getFileStats(filePath)
    
    return { title, order, sidebarHidden, description, stats }
  } catch (error) {
    console.warn(`Warning: Failed to read file ${filePath} - ${error.message}`)
    const fallbackTitle = basename(filePath).replace(/\.md$/, '')
    return { title: fallbackTitle, order: 99, sidebarHidden: false, description: '', stats: null }
  }
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function createSafeUrl(filename) {
  // Remove .md extension and encode for URL safety
  // encodeURI preserves path semantics while handling special chars
  return encodeURI(filename.replace(/\.md$/, ''))
}

function buildDirectory(dirPath, baseUrl = '/') {
  if (!existsSync(dirPath)) return { items: [], index: null }
  
  const entries = readdirSync(dirPath, { withFileTypes: true })
  // Stable alphabetical order to keep diffs predictable
  entries.sort((a, b) => a.name.localeCompare(b.name))

  let index = null
  const childItems = []

  // Process files first, then directories for better performance
  const files = entries.filter(e => e.isFile() && e.name.endsWith('.md'))
  const directories = entries.filter(e => e.isDirectory())

  // Process markdown files
  for (const entry of files) {
    const fullPath = join(dirPath, entry.name)
    
    if (entry.name === 'index.md') {
      const { title, order, sidebarHidden } = getPageInfo(fullPath)
      if (!sidebarHidden) {
        index = { text: title, link: baseUrl, order }
      }
    } else {
      const { title, order, sidebarHidden, stats } = getPageInfo(fullPath)
      if (!sidebarHidden) {
        const name = createSafeUrl(entry.name)
        const link = baseUrl + name
        childItems.push({ text: title, link, order, mtime: stats?.mtime })
      }
    }
  }

  // Process directories
  for (const entry of directories) {
    const fullPath = join(dirPath, entry.name)
    const subBaseUrl = baseUrl + entry.name + '/'
    const sub = buildDirectory(fullPath, subBaseUrl)

    if (sub.index && sub.items.length > 0) {
      // Directory with index page and subitems -> show as group with link and children
      childItems.push({ 
        text: sub.index.text || capitalize(entry.name), 
        link: sub.index.link, 
        items: sub.items, 
        order: sub.index.order 
      })
    } else if (sub.items.length > 0) {
      // Directory without index but with items -> show as group
      childItems.push({ text: capitalize(entry.name), items: sub.items, order: 99 })
    } else if (sub.index) {
      // Directory with only index -> show as single link
      childItems.push({ 
        text: sub.index.text || capitalize(entry.name), 
        link: sub.index.link, 
        order: sub.index.order 
      })
    }
  }

  // sort by order, then by modification time (newest first), then by text
  childItems.sort((a, b) => {
    const orderA = a.order || 99
    const orderB = b.order || 99
    
    // First sort by order
    if (orderA !== orderB) {
      return orderA - orderB
    }
    
    // If orders are the same, sort by modification time (newest first)
    if (a.mtime && b.mtime) {
      return new Date(b.mtime) - new Date(a.mtime)
    }
    
    // If no modification time, fall back to alphabetical
    return (a.text || '').localeCompare(b.text || '')
  })

  // remove internal 'order' and 'mtime' from final output
  const finalItems = childItems.map(item => {
    const out = { text: item.text }
    if (item.link) out.link = item.link
    if (item.items) out.items = item.items
    return out
  })

  return { index, items: finalItems }
}

function generateSidebars() {
  const english = {}
  english['/guides/'] = [
    { text: 'Step-by-step Guides', items: buildDirectory(join(docsRoot, 'guides'), '/guides/').items }
  ]
  english['/troubleshooting/'] = [
    { text: 'Problem Solutions', items: buildDirectory(join(docsRoot, 'troubleshooting'), '/troubleshooting/').items }
  ]
  english['/projects/'] = [
    { text: 'Side Projects', items: buildDirectory(join(docsRoot, 'projects'), '/projects/').items }
  ]
  english['/development/'] = [
    { text: 'Development Tools', items: buildDirectory(join(docsRoot, 'development'), '/development/').items }
  ]

  const chinese = {}
  chinese['/zh/guides/'] = [
    { text: '分步指南', items: buildDirectory(join(docsRoot, 'zh/guides'), '/zh/guides/').items }
  ]
  chinese['/zh/troubleshooting/'] = [
    { text: '问题解决', items: buildDirectory(join(docsRoot, 'zh/troubleshooting'), '/zh/troubleshooting/').items }
  ]
  chinese['/zh/development/'] = [
    { text: '开发工具', items: buildDirectory(join(docsRoot, 'zh/development'), '/zh/development/').items }
  ]

  return { english, chinese }
}

function collectAllArticles() {
  const allArticles = []
  
  function scanDirectory(dirPath, baseUrl = '/', language = 'en') {
    if (!existsSync(dirPath)) return
    
    const entries = readdirSync(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
        const { title, sidebarHidden, description, stats } = getPageInfo(fullPath)
        
        if (!sidebarHidden && stats) {
          const name = createSafeUrl(entry.name)
          const link = baseUrl + name
          
          allArticles.push({
            title,
            description,
            link,
            mtime: stats.mtime,
            birthtime: stats.birthtime,
            language,
            category: baseUrl.split('/').filter(Boolean)[language === 'zh' ? 1 : 0] || 'guides'
          })
        }
      } else if (entry.isDirectory()) {
        const subBaseUrl = baseUrl + entry.name + '/'
        scanDirectory(fullPath, subBaseUrl, language)
      }
    }
  }
  
  // Scan English content
  scanDirectory(join(docsRoot, 'guides'), '/guides/', 'en')
  scanDirectory(join(docsRoot, 'troubleshooting'), '/troubleshooting/', 'en')
  scanDirectory(join(docsRoot, 'development'), '/development/', 'en')
  scanDirectory(join(docsRoot, 'projects'), '/projects/', 'en')
  
  // Scan Chinese content
  scanDirectory(join(docsRoot, 'zh/guides'), '/zh/guides/', 'zh')
  scanDirectory(join(docsRoot, 'zh/troubleshooting'), '/zh/troubleshooting/', 'zh')
  scanDirectory(join(docsRoot, 'zh/development'), '/zh/development/', 'zh')
  
  return allArticles
}

function generateHomeData() {
  const allArticles = collectAllArticles()
  
  // Separate articles by language
  const englishArticles = allArticles.filter(article => article.language === 'en')
  const chineseArticles = allArticles.filter(article => article.language === 'zh')
  
  // Sort by modification time (newest first)
  englishArticles.sort((a, b) => new Date(b.mtime) - new Date(a.mtime))
  chineseArticles.sort((a, b) => new Date(b.mtime) - new Date(a.mtime))
  
  // Calculate last updated time based on actual article modification times
  function getLastUpdated(articles) {
    const validArticles = articles.filter(a => a.mtime)
    if (validArticles.length === 0) return new Date().toISOString()
    
    const lastMs = Math.max(...validArticles.map(a => new Date(a.mtime).getTime()))
    return new Date(lastMs).toISOString()
  }

  return {
    english: {
      recentArticles: englishArticles.slice(0, 10),
      featuredArticles: englishArticles.slice(0, 6),
      totalCount: englishArticles.length,
      lastUpdated: getLastUpdated(englishArticles)
    },
    chinese: {
      recentArticles: chineseArticles.slice(0, 10),
      featuredArticles: chineseArticles.slice(0, 6), 
      totalCount: chineseArticles.length,
      lastUpdated: getLastUpdated(chineseArticles)
    }
  }
}

function writeGeneratedFile(sidebars, homeData) {
  try {
    // Write sidebar file
    const sidebarPath = 'docs/.vitepress/generated-sidebars.cjs'
    const sidebarBanner = '// THIS FILE IS AUTO-GENERATED BY scripts/update-nav.js - DO NOT EDIT\n'
    const sidebarContent = sidebarBanner + '\nmodule.exports = ' + JSON.stringify(sidebars, null, 2) + '\n'
    writeFileSync(sidebarPath, sidebarContent, 'utf-8')
    console.log('✅ Wrote docs/.vitepress/generated-sidebars.cjs')
    
    // Write home data file (CommonJS for config)
    const homePath = 'docs/.vitepress/generated-home-data.cjs'
    const homeBanner = '// THIS FILE IS AUTO-GENERATED BY scripts/update-nav.js - DO NOT EDIT\n'
    const homeContent = homeBanner + '\nmodule.exports = ' + JSON.stringify(homeData, null, 2) + '\n'
    writeFileSync(homePath, homeContent, 'utf-8')
    console.log('✅ Wrote docs/.vitepress/generated-home-data.cjs')
    
    // Write home data file (JSON for client)
    const homeJsonPath = 'docs/public/generated-home-data.json'
    const homeJsonContent = JSON.stringify(homeData, null, 2) + '\n'
    writeFileSync(homeJsonPath, homeJsonContent, 'utf-8')
    console.log('✅ Wrote docs/public/generated-home-data.json')
  } catch (error) {
    console.error('❌ Failed to write generated file:', error.message)
    process.exit(1)
  }
}

try {
  console.log('🔄 Generating VitePress sidebars and home data...')
  const sidebars = generateSidebars()
  const homeData = generateHomeData()
  
  const englishSections = Object.keys(sidebars.english).length
  const chineseSections = Object.keys(sidebars.chinese).length
  console.log(`📝 Generated ${englishSections} English sections and ${chineseSections} Chinese sections`)
  console.log(`📰 Found ${homeData.english.totalCount} English articles, ${homeData.chinese.totalCount} Chinese articles`)
  
  writeGeneratedFile(sidebars, homeData)
  console.log('💡 Run `npm run docs:dev` to preview changes locally')
} catch (error) {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
}
