import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Giscus from '@giscus/vue'
import { useRoute } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => {
        const route = useRoute()
        const isChinesePage = route.path.startsWith('/zh/')
        
        return h(Giscus, {
          id: "comments",
          repo: "shukebeta/pkb",
          repoId: "R_kgDOPUd2Ng",
          category: "General",
          categoryId: "DIC_kwDOPUd2Ns4Cu08m",
          mapping: "pathname",
          strict: "0",
          reactionsEnabled: "1",
          emitMetadata: "1",
          inputPosition: "top",
          theme: "preferred_color_scheme",
          lang: isChinesePage ? "zh-CN" : "en",
          loading: "lazy"
        })
      }
    })
  }
}