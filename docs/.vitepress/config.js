import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Personal Knowledge Base',
  description: 'Technical guides and troubleshooting documentation',
  
  // Clean URLs without .html extension
  cleanUrls: true,
  
  // Last updated timestamp
  lastUpdated: true,
  
  // Ignore dead links during build (temporarily disabled for now)
  // ignoreDeadLinks: true,
  
  // Locales configuration for bilingual support
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'Personal Knowledge Base',
      description: 'Technical guides and troubleshooting documentation',
      
      themeConfig: {
        nav: [
          { text: 'Guides', link: '/guides/' },
          { text: 'Troubleshooting', link: '/troubleshooting/' },
          { text: 'Development', link: '/development/' }
        ],
        
        sidebar: {
          '/guides/': [
            {
              text: 'Step-by-step Guides',
              items: [
                { text: 'CLI Development with Seq', link: '/guides/cli-development-with-seq' },
                { text: 'Docker Auto Installation', link: '/guides/docker-auto-install' },
                { text: 'Docker Data Restore', link: '/guides/docker-data-restore' },
                { text: 'Cloudflare DNS Update', link: '/guides/cloudflare-dns-update' },
                { text: 'GitHub PR Diff Trick', link: '/guides/github-pr-diff-trick' },
                { text: 'Node.js Path Mocking DI', link: '/guides/nodejs-path-mocking-dependency-injection' },
                { text: 'Claude Memory Continuity', link: '/guides/claude-memory-continuity-prompts' },
                { text: 'Git Smart Add Alias', link: '/guides/git-smartadd-alias' },
                { text: 'VirtIO Clipboard Sharing', link: '/guides/virt-manager-clipboard-sharing' }
              ]
            }
          ],
          '/troubleshooting/': [
            {
              text: 'Problem Solutions',
              items: [
                { text: 'Disable Rider WinForms Designer', link: '/troubleshooting/disable-rider-winforms-designer' }
              ]
            }
          ],
          '/development/': [
            {
              text: 'Development Tools',
              items: [
                { text: 'Claude Commands', link: '/development/claude/' }
              ]
            }
          ]
        },
        
        socialLinks: [
          { icon: 'github', link: 'https://github.com/shukebeta/pkb' }
        ],
        
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2024 Personal Knowledge Base'
        },
        
        search: {
          provider: 'local'
        }
      }
    },
    
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: '个人知识库',
      description: '技术指南和问题解决文档',
      
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guides/' },
          { text: '故障排除', link: '/zh/troubleshooting/' },
          { text: '开发', link: '/zh/development/' }
        ],
        
        sidebar: {
          '/zh/guides/': [
            {
              text: '分步指南',
              items: [
                { text: 'Seq 日志的 CLI 开发', link: '/zh/guides/cli-development-with-seq' },
                { text: 'VirtIO 剪贴板共享', link: '/zh/guides/virt-manager-clipboard-sharing' },
                { text: 'GitHub PR 差异技巧', link: '/zh/guides/github-pr-diff-trick' },
                { text: 'Git 智能添加别名', link: '/zh/guides/git-smartadd-alias' },
                { text: 'Docker 自动安装', link: '/zh/guides/docker-auto-install' },
                { text: 'Docker 数据恢复', link: '/zh/guides/docker-data-restore' },
                { text: 'Node.js 路径模拟 DI', link: '/zh/guides/nodejs-path-mocking-dependency-injection' },
                { text: 'Cloudflare DNS 更新', link: '/zh/guides/cloudflare-dns-update' },
                { text: 'Claude 记忆连续性', link: '/zh/guides/claude-memory-continuity-prompts' }
              ]
            }
          ],
          '/zh/troubleshooting/': [
            {
              text: '问题解决',
              items: [
                { text: '禁用 Rider WinForms 设计器', link: '/zh/troubleshooting/disable-rider-winforms-designer' }
              ]
            }
          ],
          '/zh/development/': [
            {
              text: '开发工具',
              items: [
                { text: 'Claude 命令', link: '/zh/development/claude/' }
              ]
            }
          ]
        },
        
        socialLinks: [
          { icon: 'github', link: 'https://github.com/shukebeta/pkb' }
        ],
        
        footer: {
          message: '基于 MIT 许可证发布。',
          copyright: 'Copyright © 2024 个人知识库'
        },
        
        search: {
          provider: 'local'
        },
        
        // Chinese language specific
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        
        outline: {
          label: '页面导航'
        },
        
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        }
      }
    }
  },
  
  // Theme configuration
  themeConfig: {
    logo: '/logo.svg',
    
    editLink: {
      pattern: 'https://github.com/shukebeta/pkb/edit/master/docs/:path'
    }
  },
  
  // Head configuration for SEO
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Personal Knowledge Base' }],
    ['meta', { name: 'og:image', content: 'https://pkb.shukebeta.com/logo.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://pkb.shukebeta.com/logo.svg' }],
    // Google Analytics (replace with your tracking ID)
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID' }],
    ['script', {}, "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'GA_TRACKING_ID');"]
  ],

  // RSS Feed
  rss: {
    hostname: 'https://pkb.shukebeta.com',
    title: 'Personal Knowledge Base',
    description: 'Technical guides and troubleshooting documentation',
    copyright: 'Copyright © 2024 Personal Knowledge Base'
  },

  // Sitemap
  sitemap: {
    hostname: 'https://pkb.shukebeta.com'
  }
})