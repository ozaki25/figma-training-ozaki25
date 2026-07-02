import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import markdownItCjkFriendly from 'markdown-it-cjk-friendly'

const siteTitle = 'Figmaハンズオン'
const siteDescription =
  'Figma未経験のエンジニアが2日間でUIデザインからコード生成まで学ぶハンズオン'

export default withPwa(
  defineConfig({
    lang: 'ja-JP',
    title: siteTitle,
    description: siteDescription,
    cleanUrls: true,
    head: [
      ['meta', { name: 'robots', content: 'noindex,nofollow' }],
      ['meta', { name: 'theme-color', content: '#7C3AED' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: siteTitle }],
      ['meta', { property: 'og:description', content: siteDescription }],
      ['meta', { property: 'og:site_name', content: siteTitle }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: siteTitle }],
      ['meta', { name: 'twitter:description', content: siteDescription }],
      ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
      ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
      ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' }],
    ],
    themeConfig: {
      nav: [{ text: 'ホーム', link: '/' }],
      sidebar: [],
      outline: {
        label: '目次',
        level: [2, 3],
      },
      docFooter: {
        prev: '前のページ',
        next: '次のページ',
      },
      lastUpdated: {
        text: '最終更新',
      },
      darkModeSwitchLabel: '外観',
      lightModeSwitchTitle: 'ライトモードに切り替える',
      darkModeSwitchTitle: 'ダークモードに切り替える',
      sidebarMenuLabel: 'メニュー',
      returnToTopLabel: 'トップへ戻る',
      langMenuLabel: '言語を変更',
      notFound: {
        title: 'ページが見つかりません',
        quote: 'お探しのページは移動または削除された可能性があります。',
        linkText: 'トップページへ戻る',
      },
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '検索',
              buttonAriaLabel: '検索',
            },
            modal: {
              displayDetails: '詳細を表示',
              resetButtonTitle: '検索条件をクリア',
              backButtonTitle: '閉じる',
              noResultsText: '見つかりませんでした:',
              footer: {
                selectText: '選択',
                selectKeyAriaLabel: 'Enter',
                navigateText: '移動',
                navigateUpKeyAriaLabel: '上矢印',
                navigateDownKeyAriaLabel: '下矢印',
                closeText: '閉じる',
                closeKeyAriaLabel: 'Esc',
              },
            },
          },
        },
      },
    },
    markdown: {
      config(md) {
        md.use(tabsMarkdownPlugin)
        md.use(markdownItCjkFriendly)
      },
    },
    pwa: {
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: siteTitle,
        short_name: siteTitle,
        description: siteDescription,
        lang: 'ja',
        theme_color: '#7C3AED',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    },
  })
)
