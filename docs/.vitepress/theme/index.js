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
        repoId: "R_kgDOPUd2Ng",
        category: "General",
        categoryId: "DIC_kwDOPUd2Ns4Cu08m",
        mapping: "pathname",
        strict: "0",
        reactionsEnabled: "1",
        emitMetadata: "1",
        inputPosition: "top",
        theme: "preferred_color_scheme",
        lang: "zh-CN",
        loading: "lazy"
      })
    })
  }
}