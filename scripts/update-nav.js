#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs'
import { join, basename, resolve } from 'path'

const docsRoot = 'docs'

function parseFrontMatter(content) {
  try {
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    let title = null
    let order = 99
    
    if (fmMatch) {
      const fm = fmMatch[1]
      const titleMatch = fm.match(/^\s*title:\s*(?:"|'|)?(.*?)(?:"|'|)?\s*$/m)
      if (titleMatch) {
        title = titleMatch[1].trim()
        // Remove any quotes that weren't caught by the regex
        title = title.replace(/^["']|["']$/g, '')
      }
      const orderMatch = fm.match(/^\s*order:\s*(\d+)\s*$/m)
      if (orderMatch) {
        const parsed = parseInt(orderMatch[1], 10)
        if (!isNaN(parsed)) order = parsed
      }
    }
    return { title, order }
  } catch (error) {
    console.warn(`Warning: Failed to parse frontmatter - ${error.message}`)
    return { title: null, order: 99 }
  }
}

function getPageInfo(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const { title: fmTitle, order } = parseFrontMatter(content)
    let title = fmTitle
    
    if (!title) {
      const h1 = content.match(/^\s*#\s+(.*)$/m)
      title = h1 ? h1[1].trim() : basename(filePath).replace(/\.md$/, '')
    }
    
    return { title, order }
  } catch (error) {
    console.warn(`Warning: Failed to read file ${filePath} - ${error.message}`)
    const fallbackTitle = basename(filePath).replace(/\.md$/, '')
    return { title: fallbackTitle, order: 99 }
  }
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
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
      const { title, order } = getPageInfo(fullPath)
      index = { text: title, link: baseUrl, order }
    } else {
      const { title, order } = getPageInfo(fullPath)
      const name = entry.name.slice(0, -3) // Remove .md more efficiently
      const link = baseUrl + name
      childItems.push({ text: title, link, order })
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

  // sort by order then text
  childItems.sort((a, b) => (a.order || 99) - (b.order || 99) || (a.text || '').localeCompare(b.text || ''))

  // remove internal 'order' from final output
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

function writeGeneratedFile(sidebars) {
  try {
    const outPath = 'docs/.vitepress/generated-sidebars.js'
    const banner = '// THIS FILE IS AUTO-GENERATED BY scripts/update-nav.js - DO NOT EDIT\n'
    const content = banner + '\nexport default ' + JSON.stringify(sidebars, null, 2) + '\n'
    writeFileSync(outPath, content, 'utf-8')
    console.log('✅ Wrote docs/.vitepress/generated-sidebars.js')
  } catch (error) {
    console.error('❌ Failed to write generated file:', error.message)
    process.exit(1)
  }
}

try {
  console.log('🔄 Generating VitePress sidebars...')
  const sidebars = generateSidebars()
  const englishSections = Object.keys(sidebars.english).length
  const chineseSections = Object.keys(sidebars.chinese).length
  console.log(`📝 Generated ${englishSections} English sections and ${chineseSections} Chinese sections`)
  writeGeneratedFile(sidebars)
  console.log('💡 Run `npm run docs:dev` to preview changes locally')
} catch (error) {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
}
