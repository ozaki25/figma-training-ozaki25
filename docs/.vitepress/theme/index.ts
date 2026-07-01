import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import type { Theme } from 'vitepress'
import { inBrowser } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    if (inBrowser && !import.meta.env.DEV) {
      import('@vercel/analytics').then(({ inject }) => inject())
      import('@vercel/speed-insights').then(({ injectSpeedInsights }) =>
        injectSpeedInsights()
      )
    }
  },
} satisfies Theme
