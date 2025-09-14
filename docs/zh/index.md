---
layout: home

hero:
  name: "舒克贝塔的烂笔头"
  text: "随手技术笔记"
  tagline: "个人开发心得、问题记录和技术发现的随手整理"
  image:
    src: /logo.svg
    alt: PKB Logo
  actions:
    - theme: brand
      text: 浏览指南
      link: /zh/guides/
    - theme: alt
      text: GitHub
      link: https://github.com/shukebeta/pkb
    - theme: alt
      text: RSS 订阅
      link: /feed.rss

features:
  - icon: 📖
    title: 分步指南
    details: 从命令行开发到Docker自动化的全面教程
    link: /zh/guides/
  - icon: 🔧
    title: 故障排除
    details: 实际问题解决方案，包含详细说明和代码示例
    link: /zh/troubleshooting/
  - icon: 💻
    title: 开发工具
    details: 专业的开发工作流程和工具配置
    link: /zh/development/
  - icon: 🌐
    title: 双语支持
    details: 内容提供中英文版本，满足更广泛的用户需求
---

<script setup>
import DynamicHomePage from '../.vitepress/components/DynamicHomePage.vue'
</script>

<DynamicHomePage />

---

*知识库自 2024 年起用 ❤️ 维护*