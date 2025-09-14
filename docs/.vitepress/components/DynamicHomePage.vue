<template>
  <div class="dynamic-home">
    <section v-if="currentData && currentData.recentArticles.length > 0" class="recent-articles">
      <h2>🚀 Recent Articles</h2>
      <div class="article-grid">
        <article
          v-for="article in currentData.recentArticles.slice(0, 6)"
          :key="article.link"
          class="article-card"
        >
          <h3><a :href="article.link">{{ article.title }}</a></h3>
          <p class="description">{{ article.description || 'Click to read more...' }}</p>
          <div class="meta">
            <span class="category">{{ getCategoryIcon(article.category) }} {{ article.category }}</span>
            <span class="date">{{ formatDate(article.mtime) }}</span>
          </div>
        </article>
      </div>
    </section>

    <section v-if="currentData && currentData.totalCount > 6" class="all-articles-link">
      <div class="stats">
        <p>📚 Total: <strong>{{ currentData.totalCount }}</strong> articles</p>
        <p>🔄 Last updated: {{ formatDate(currentData.lastUpdated) }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const homeData = ref(null)
const { lang } = useData()

const currentData = computed(() => {
  if (!homeData.value) return null

  // Determine if we're on Chinese site (with SSR protection)
  const isChineseSite = lang.value === 'zh-CN' ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/zh/'))

  return isChineseSite ? homeData.value.chinese : homeData.value.english
})

onMounted(async () => {
  try {
    // Support subpath deployment by using VitePress base URL
    const base = import.meta.env.BASE_URL || '/'
    const dataUrl = base.endsWith('/')
      ? base + 'generated-home-data.json'
      : base + '/generated-home-data.json'

    const response = await fetch(dataUrl)
    if (response.ok) {
      homeData.value = await response.json()
    }
  } catch (error) {
    console.warn('Could not load home data:', error)
  }
})

function getCategoryIcon(category) {
  const icons = {
    guides: '📖',
    troubleshooting: '🔧',
    development: '💻',
    projects: '🚀'
  }
  return icons[category] || '📄'
}

function formatDate(dateStr) {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''

  // Use locale-aware formatting based on current language
  const locale = lang.value === 'zh-CN' ? 'zh-CN' : 'en-US'
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.dynamic-home {
  margin: 2rem 0;
}

.recent-articles h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-brand-1);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.article-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  background: var(--vp-c-bg);
}

.article-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.article-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.article-card h3 a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.article-card h3 a:hover {
  text-decoration: underline;
}

.description {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem 0;
  line-height: 1.4;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.category {
  background: var(--vp-c-default-soft);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: capitalize;
}

.all-articles-link {
  text-align: center;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-top: 2rem;
}

.stats p {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
}
</style>