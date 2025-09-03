import { defineConfig } from 'vitepress'
import { createRssFileEN } from './genFeed.js'

export default defineConfig({
  title: "shukebeta's scribbles",
  description: 'Personal tech notes and development discoveries',
  
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
      title: "shukebeta's scribbles",
      description: 'Personal tech notes and development discoveries',
      
      themeConfig: {
        nav: [
          { text: 'Guides', link: '/guides/' },
          { text: 'Troubleshooting', link: '/troubleshooting/' },
          { text: 'Development', link: '/development/' },
          { 
            text: 'More', 
            items: [
              { text: '中文版 🇨🇳', link: '/zh/' },
              { text: 'RSS Feed', link: '/feed.rss' }
            ]
          }
        ],        sidebar: {
          "/guides/": [
            {
              "text": "Step-by-step Guides",
              "items": [
                {
                  "text": "Claude Memory Continuity Prompts",
                  "link": "/guides/claude-memory-continuity-prompts"
                },
                {
                  "text": "CLI Development with Seq Logging",
                  "link": "/guides/cli-development-with-seq"
                },
                {
                  "text": "Docker Auto Installation (Ubuntu)",
                  "link": "/guides/docker-auto-install"
                },
                {
                  "text": "Docker Data Restore from Backup",
                  "link": "/guides/docker-data-restore"
                },
                {
                  "text": "Example New Article",
                  "link": "/guides/example-new-article"
                },
                {
                  "text": "Git Smart Add Alias",
                  "link": "/guides/git-smartadd-alias"
                },
                {
                  "text": "Improved Cloudflare DNS Update Script",
                  "link": "/guides/cloudflare-dns-update"
                },
                {
                  "text": "Mocking Node.js Path Separators: The Dependency Injection Solution",
                  "link": "/guides/nodejs-path-mocking-dependency-injection"
                },
                {
                  "text": "Quick Tip: Get GitHub PR Diffs Easily",
                  "link": "/guides/github-pr-diff-trick"
                },
                {
                  "text": "VirtIO Clipboard Sharing: Linux Host ↔ Windows Guest",
                  "link": "/guides/virt-manager-clipboard-sharing"
                }
              ]
            }
          ],
          "/troubleshooting/": [
            {
              "text": "Problem Solutions",
              "items": [
                {
                  "text": "Fix Rider WinForms Designer Build Locks",
                  "link": "/troubleshooting/disable-rider-winforms-designer"
                }
              ]
            }
          ],
          "/development/": [
            {
              "text": "Development Tools",
              "items": [
                {
                  "text": "Claude Commands",
                  "link": "/development/claude/"
                }
              ]
            }
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
          copyright: "Copyright © 2025 Shuke's Scribbles"
        },
        
      }
    },
    
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: '舒克贝塔的烂笔头',
      description: '个人技术笔记和开发发现',
      
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guides/' },
          { text: '故障排除', link: '/zh/troubleshooting/' },
          { text: '开发', link: '/zh/development/' },
          { 
            text: '更多', 
            items: [
              { text: 'English 🇺🇸', link: '/' },
              { text: 'RSS 订阅', link: '/feed.rss' }
            ]
          }
        ],        sidebar: {
          "/zh/guides/": [
            {
              "text": "分步指南",
              "items": [
                {
                  "text": "Claude 记忆连续性提示词",
                  "link": "/zh/guides/claude-memory-continuity-prompts"
                },
                {
                  "text": "CLI Development with Seq Logging",
                  "link": "/zh/guides/cli-development-with-seq"
                },
                {
                  "text": "Docker 自动安装（Ubuntu）",
                  "link": "/zh/guides/docker-auto-install"
                },
                {
                  "text": "Git 智能添加别名",
                  "link": "/zh/guides/git-smartadd-alias"
                },
                {
                  "text": "Node.js 路径分隔符模拟：依赖注入解决方案",
                  "link": "/zh/guides/nodejs-path-mocking-dependency-injection"
                },
                {
                  "text": "VirtIO 剪贴板共享：Linux 主机 ↔ Windows 虚拟机",
                  "link": "/zh/guides/virt-manager-clipboard-sharing"
                },
                {
                  "text": "从备份恢复 Docker 数据",
                  "link": "/zh/guides/docker-data-restore"
                },
                {
                  "text": "快速技巧：轻松获取 GitHub PR 差异",
                  "link": "/zh/guides/github-pr-diff-trick"
                },
                {
                  "text": "改进的 Cloudflare DNS 更新脚本",
                  "link": "/zh/guides/cloudflare-dns-update"
                }
              ]
            }
          ],
          "/zh/troubleshooting/": [
            {
              "text": "问题解决",
              "items": [
                {
                  "text": "修复 Rider WinForms 设计器构建锁定",
                  "link": "/zh/troubleshooting/disable-rider-winforms-designer"
                }
              ]
            }
          ],
          "/zh/development/": [
            {
              "text": "开发工具",
              "items": [
                {
                  "text": "Claude 命令",
                  "link": "/zh/development/claude/"
                }
              ]
            }
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
          copyright: 'Copyright © 2025 舒克贝塔的烂笔头'
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
    },
    
    // Global search configuration
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '返回搜索',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  },
  
  // Head configuration for SEO
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: "shukebeta's scribbles" }],
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
    title: "shukebeta's scribbles",
    description: 'Personal tech notes and development discoveries',
    copyright: "Copyright © 2025 Shuke's Scribbles"
  },

  // Sitemap
  sitemap: {
    hostname: 'https://pkb.shukebeta.com'
  },

  // Build hooks
  buildEnd: createRssFileEN
})