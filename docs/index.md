---
layout: home

hero:
  name: "shukebeta's scribbles"
  text: "Random Tech Notes"
  tagline: "Personal collection of development tips, troubleshooting notes, and technical discoveries"
  image:
    src: /logo.svg
    alt: PKB Logo
  actions:
    - theme: brand
      text: Browse Guides
      link: /guides/
    - theme: alt
      text: View on GitHub
      link: https://github.com/shukebeta/pkb
    - theme: alt
      text: RSS Feed
      link: /feed.rss

features:
  - icon: 📖
    title: Step-by-Step Guides
    details: Comprehensive tutorials covering everything from CLI development to Docker automation
    link: /guides/
  - icon: 🔧
    title: Troubleshooting Solutions
    details: Real-world problem solutions with detailed explanations and code examples
    link: /troubleshooting/
  - icon: 💻
    title: Development Tools
    details: Professional development workflows and tool configurations
    link: /development/
  - icon: 🌐
    title: Bilingual Support
    details: Content available in both English and Chinese for broader accessibility
---

<script setup>
import DynamicHomePage from './.vitepress/components/DynamicHomePage.vue'
</script>

<DynamicHomePage />

---

*Knowledge base maintained with ❤️ since 2024*