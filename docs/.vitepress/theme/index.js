import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Giscus from '@giscus/vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Giscus, {
        id: "comments",
        repo: "shukebeta/pkb",
        repoId: "R_kgDOL-aaFg", // Replace with your repo ID
        category: "Announcements",
        categoryId: "DIC_kwDOL-aaFs4CizrE", // Replace with your category ID  
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
}