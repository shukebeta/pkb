import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
// import Giscus from '@giscus/vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Temporarily disable comments until Discussions is configured
  /*
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Giscus, {
        id: "comments",
        repo: "shukebeta/pkb",
        repoId: "YOUR_REPO_ID_HERE", // 从 giscus.app 获取
        category: "General",
        categoryId: "YOUR_CATEGORY_ID_HERE", // 从 giscus.app 获取
        mapping: "pathname",
        strict: "0",
        reactionsEnabled: "1",
        emitMetadata: "0",
        inputPosition: "bottom",
        theme: "preferred_color_scheme",
        lang: "en",
        loading: "lazy"
      })
    })
  }
  */
}