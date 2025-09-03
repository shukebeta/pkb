#!/usr/bin/env node

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Read markdown files and extract titles with front matter support
function getMarkdownFiles(dir) {
  if (!existsSync(dir)) return []
  
  const files = readdirSync(dir)
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const filePath = join(dir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // Parse front matter
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      let title, order = 99
      
      if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1]
        const titleMatch = frontMatter.match(/^title:\s*(.+)$/m)
        const orderMatch = frontMatter.match(/^order:\s*(\d+)$/m)
        
        title = titleMatch ? titleMatch[1].trim() : null
        order = orderMatch ? parseInt(orderMatch[1]) : 99
      }
      
      // Fallback to H1 title if no front matter title
      if (!title) {
        const h1Match = content.match(/^# (.+)$/m)
        title = h1Match ? h1Match[1] : file.replace('.md', '')
      }
      
      const link = `${dir.replace('docs', '')}/${file.replace('.md', '')}`
      
      return {
        text: title,
        link: link,
        order: order
      }
    })
    .sort((a, b) => a.order - b.order || a.text.localeCompare(b.text))

  return files.map(({ text, link }) => ({ text, link }))
}

// Generate sidebar configs
function generateSidebarConfigs() {
  return {
    english: {
      '/guides/': [{
        text: 'Step-by-step Guides',
        items: getMarkdownFiles('docs/guides')
      }],
      '/troubleshooting/': [{
        text: 'Problem Solutions', 
        items: getMarkdownFiles('docs/troubleshooting')
      }],
      '/projects/': [{
        text: 'Side Projects',
        items: getMarkdownFiles('docs/projects')
      }],
      '/development/': [{
        text: 'Development Tools',
        items: getMarkdownFiles('docs/development').concat([
          { text: 'Claude Commands', link: '/development/claude/' }
        ])
      }]
    },
    chinese: {
      '/zh/guides/': [{
        text: '分步指南',
        items: getMarkdownFiles('docs/zh/guides')
      }],
      '/zh/troubleshooting/': [{
        text: '问题解决',
        items: getMarkdownFiles('docs/zh/troubleshooting')
      }],
      '/zh/development/': [{
        text: '开发工具',
        items: getMarkdownFiles('docs/zh/development').concat([
          { text: 'Claude 命令', link: '/zh/development/claude/' }
        ])
      }]
    }
  }
}

// Update config.js file with new approach
function updateConfigFile() {
  const configPath = 'docs/.vitepress/config.js'
  if (!existsSync(configPath)) {
    console.error('❌ Config file not found:', configPath)
    return false
  }
  
  const configContent = readFileSync(configPath, 'utf-8')
  const configs = generateSidebarConfigs()
  
  // Format sidebar with proper indentation
  const formatSidebar = (sidebar, indent) => {
    return JSON.stringify(sidebar, null, 2)
      .split('\n')
      .map((line, i) => i === 0 ? `${indent}sidebar: ${line}` : `${indent}${line}`)
      .join('\n')
  }
  
  // Replace English sidebar (first occurrence)
  let updatedContent = configContent.replace(
    /(\s+)sidebar:\s*\{[\s\S]*?\n\s+\}/,
    formatSidebar(configs.english, '        ')
  )
  
  // Replace Chinese sidebar (second occurrence within zh config)
  updatedContent = updatedContent.replace(
    /(zh:[\s\S]*?themeConfig:[\s\S]*?)(\s+)sidebar:\s*\{[\s\S]*?\n\s+\}/,
    `$1${formatSidebar(configs.chinese, '        ')}`
  )
  
  writeFileSync(configPath, updatedContent, 'utf-8')
  return true
}

console.log('🔄 Auto-updating navigation...')

const configs = generateSidebarConfigs()

console.log('📝 Generated sidebar config:')
console.log('English guides:', configs.english['/guides/'][0].items.length)  
console.log('Chinese guides:', configs.chinese['/zh/guides/'][0].items.length)

if (updateConfigFile()) {
  console.log('✅ Successfully updated config.js!')
  console.log('💡 Run `npm run docs:dev` to see changes')
} else {
  console.log('❌ Failed to update config.js automatically')
  console.log('📋 Manual update required with the generated config above')
}