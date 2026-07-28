<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

type Lesson = { slug: string; text: string; link: string }
type Chapter = { number: number; text: string; lessons: Lesson[] }

// サイドバー定義と重複するが、Vueコンポーネントからconfig.mtsを安全に参照するのが難しいためここに定義する。
// 追加・変更時はconfig.mtsとあわせて更新する。
const chapters: Chapter[] = [
  {
    number: 1,
    text: 'Figmaを開いてみる',
    lessons: [
      { slug: '1-1', text: '画面構成を知る', link: '/lessons/1-1/' },
      { slug: '1-2', text: 'フレームを作って操作する', link: '/lessons/1-2/' },
    ],
  },
  {
    number: 2,
    text: '基本要素を作る',
    lessons: [
      { slug: '2-1', text: 'シェイプとテキストを配置する', link: '/lessons/2-1/' },
      { slug: '2-2', text: 'オートレイアウトで並べる', link: '/lessons/2-2/' },
      { slug: '2-3', text: '整列とリサイズ挙動（内包/拡大/固定）を理解する', link: '/lessons/2-3/' },
    ],
  },
  {
    number: 3,
    text: 'デザインの基礎知識',
    lessons: [
      { slug: '3-1', text: 'カラーとタイポグラフィのルール化', link: '/lessons/3-1/' },
      { slug: '3-2', text: 'コンポーネントとバリアントを作る', link: '/lessons/3-2/' },
      { slug: '3-3', text: 'コード生成を見据えたレイヤー命名', link: '/lessons/3-3/' },
      { slug: '3-4', text: 'バリアブルでデザイントークンを管理する', link: '/lessons/3-4/' },
    ],
  },
  {
    number: 4,
    text: '実践: タスク一覧画面を作る',
    lessons: [
      { slug: '4-1', text: 'レイアウトの骨組みを作る', link: '/lessons/4-1/' },
      { slug: '4-2', text: 'デザイントークンとスタイルを定義する', link: '/lessons/4-2/' },
      { slug: '4-3', text: 'タスクカードと優先度バリアント', link: '/lessons/4-3/' },
      { slug: '4-4', text: '統計・フィルタ・ナビの部品を作る', link: '/lessons/4-4/' },
      { slug: '4-5', text: '一覧画面を仕上げて完成させる', link: '/lessons/4-5/' },
    ],
  },
  {
    number: 5,
    text: 'Figma MCP + Claude Codeで一覧画面をコード化',
    lessons: [
      { slug: '5-1', text: 'Figma MCPサーバーをセットアップする', link: '/lessons/5-1/' },
      { slug: '5-2', text: 'タスク一覧画面をコード生成する', link: '/lessons/5-2/' },
    ],
  },
  {
    number: 6,
    text: '実践: タスク登録フォームを作る',
    lessons: [
      { slug: '6-1', text: 'フォームのレイアウトを組む', link: '/lessons/6-1/' },
      { slug: '6-2', text: '入力欄・ボタンを作る', link: '/lessons/6-2/' },
      { slug: '6-3', text: '仕上げ・一貫性チェック', link: '/lessons/6-3/' },
    ],
  },
  {
    number: 7,
    text: 'タスク登録フォームをコード化',
    lessons: [
      { slug: '7-1', text: 'タスク登録フォームをコード生成する', link: '/lessons/7-1/' },
    ],
  },
]

const totalLessons = chapters.reduce((acc, c) => acc + c.lessons.length, 0)

const flat = chapters.flatMap((c) =>
  c.lessons.map((l, i) => ({
    ...l,
    chapter: c,
    indexInChapter: i + 1,
  }))
)

const { page } = useData()

const current = computed(() => {
  // page.relativePath: "lessons/1-1/index.md" のような形
  const rp = page.value.relativePath || ''
  const match = rp.match(/^lessons\/(\d+-\d+)\//)
  if (!match) return null
  const slug = match[1]
  const idxOverall = flat.findIndex((l) => l.slug === slug)
  if (idxOverall < 0) return null
  const item = flat[idxOverall]
  return {
    chapter: item.chapter,
    lessonText: item.text,
    lessonLink: item.link,
    indexInChapter: item.indexInChapter,
    chapterTotal: item.chapter.lessons.length,
    overall: idxOverall + 1,
    total: totalLessons,
  }
})
</script>

<template>
  <nav v-if="current" class="lesson-nav" aria-label="レッスンの現在位置">
    <ol class="lesson-nav__crumbs">
      <li>
        <a href="/">ホーム</a>
      </li>
      <li aria-hidden="true" class="lesson-nav__sep">/</li>
      <li>
        <span>{{ current.chapter.number }}章 {{ current.chapter.text }}</span>
      </li>
      <li aria-hidden="true" class="lesson-nav__sep">/</li>
      <li>
        <span class="lesson-nav__current">{{ current.lessonText }}</span>
      </li>
    </ol>
    <div class="lesson-nav__progress" aria-label="進捗">
      <span class="lesson-nav__badge">
        第{{ current.chapter.number }}章 {{ current.indexInChapter }}/{{ current.chapterTotal }}
      </span>
      <span class="lesson-nav__dot" aria-hidden="true">・</span>
      <span class="lesson-nav__overall">
        全{{ current.total }}中 {{ current.overall }}/{{ current.total }}
      </span>
    </div>
  </nav>
</template>

<style scoped>
.lesson-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin: 0 0 20px;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.lesson-nav__crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}

.lesson-nav__crumbs li {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.lesson-nav__crumbs a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.lesson-nav__crumbs a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.lesson-nav__sep {
  color: var(--vp-c-text-3);
}

.lesson-nav__current {
  color: var(--vp-c-text-1);
  font-weight: 500;
  overflow-wrap: anywhere;
}

.lesson-nav__progress {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.lesson-nav__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
  font-size: 12px;
}

.lesson-nav__dot {
  color: var(--vp-c-text-3);
}

.lesson-nav__overall {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

@media (max-width: 640px) {
  .lesson-nav {
    font-size: 12px;
    padding: 8px 10px;
  }

}
</style>
