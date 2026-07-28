import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import type { Theme } from 'vitepress'
import { inBrowser, useRoute } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import mediumZoom from 'medium-zoom'
import 'medium-zoom/dist/style.css'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    if (inBrowser && !import.meta.env.DEV) {
      import('@vercel/analytics').then(({ inject }) => inject())
      import('@vercel/speed-insights').then(({ injectSpeedInsights }) =>
        injectSpeedInsights()
      )
    }
  },
  setup() {
    // 完成イメージは1440px幅のキャプチャを700px前後に縮めて表示しているため、
    // クリックで原寸を見られるようにする。ルート遷移のたびに貼り直す。
    const route = useRoute()
    const attach = () => {
      mediumZoom('.vp-doc img', {
        background: 'var(--vp-c-bg)',
        margin: 24,
      })
    }
    onMounted(attach)
    watch(
      () => route.path,
      () => nextTick(attach)
    )
  },
} satisfies Theme
