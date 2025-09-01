import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader } from 'vitepress'

const hostname = 'https://pkb.shukebeta.com'

export async function createRssFileEN(config) {
  const feed = new Feed({
    title: "shukebeta's scribbles",
    description: 'Personal tech notes and development discoveries',
    id: hostname,
    link: hostname,
    language: 'en',
    image: `${hostname}/logo.svg`,
    favicon: `${hostname}/favicon.ico`,
    copyright: "Copyright © 2025 shukebeta's scribbles",
    updated: new Date(),
    generator: 'VitePress',
    feedLinks: {
      rss: `${hostname}/feed.rss`
    }
  })

  // Load all English posts
  const posts = await createContentLoader('**/*.md', {
    excerpt: true,
    render: true
  }).load()

  posts
    .filter((post) => !post.url.includes('/zh/')) // English only
    .filter((post) => post.url !== '/') // Exclude homepage
    .sort((a, b) => +new Date(b.frontmatter.date || '2024-01-01') - +new Date(a.frontmatter.date || '2024-01-01'))
    .slice(0, 20) // Latest 20 posts
    .forEach((post) => {
      feed.addItem({
        title: post.frontmatter.title || 'Untitled',
        id: `${hostname}${post.url}`,
        link: `${hostname}${post.url}`,
        description: post.excerpt || post.frontmatter.description || '',
        content: post.html,
        author: [
          {
            name: 'shukebeta',
            link: 'https://github.com/shukebeta'
          }
        ],
        date: new Date(post.frontmatter.date || '2024-01-01')
      })
    })

  writeFileSync(config.outDir + '/feed.rss', feed.rss2())
}