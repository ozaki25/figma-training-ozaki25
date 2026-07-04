<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const STORAGE_PREFIX = 'goal-checklist:v1:'

type State = Record<number, boolean>

function loadState(key: string): State {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch {
    return {}
  }
}

function saveState(key: string, state: State) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state))
  } catch {
    // ignore
  }
}

function stripTaskMarker(text: string): string {
  return text.replace(/^\s*\[[ xX]\]\s*/, '')
}

function enhance() {
  if (typeof document === 'undefined') return
  // VitePressのheader anchor slugはNFDに正規化されるため、textContentで探す
  const heading = Array.from(document.querySelectorAll('h2')).find((h) =>
    (h.textContent || '').trim().replace(/\s*​?\s*$/, '').startsWith('ゴール確認')
  ) as HTMLElement | undefined
  if (!heading) return

  // 次のUL要素を探す（間にaタグやテキストがあっても許容）
  let sibling: Element | null = heading.nextElementSibling
  while (sibling && sibling.tagName !== 'UL' && sibling.tagName !== 'H2') {
    sibling = sibling.nextElementSibling
  }
  if (!sibling || sibling.tagName !== 'UL') return
  const ul = sibling as HTMLUListElement
  if (ul.dataset.goalChecklistEnhanced === 'true') return
  ul.dataset.goalChecklistEnhanced = 'true'

  const key = route.path || location.pathname
  const state = loadState(key)

  const items = Array.from(ul.children).filter(
    (el): el is HTMLLIElement => el.tagName === 'LI'
  )
  const total = items.length
  if (total === 0) return

  // 進捗表示
  const progress = document.createElement('div')
  progress.className = 'goal-checklist-progress'
  const progressText = document.createElement('span')
  progressText.className = 'goal-checklist-progress-text'
  const progressBar = document.createElement('div')
  progressBar.className = 'goal-checklist-progress-bar'
  const progressFill = document.createElement('div')
  progressFill.className = 'goal-checklist-progress-fill'
  progressBar.appendChild(progressFill)
  progress.appendChild(progressText)
  progress.appendChild(progressBar)
  ul.parentElement?.insertBefore(progress, ul)

  ul.classList.add('goal-checklist')

  function updateProgress() {
    const done = Object.values(state).filter(Boolean).length
    progressText.textContent = `${done} / ${total} 完了`
    progressFill.style.width = total > 0 ? `${(done / total) * 100}%` : '0%'
    progress.setAttribute('aria-label', `達成度 ${done} / ${total}`)
  }

  items.forEach((li, idx) => {
    // 既存の`[ ]`/`[x]`プレフィックスを取り除いてテキストノードを整える
    const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT)
    const first = walker.nextNode() as Text | null
    if (first) first.data = stripTaskMarker(first.data)

    // 既存のdisabled checkbox（GFMタスクリスト形式で入る可能性）を除去
    li.querySelectorAll('input[type="checkbox"]').forEach((el) => el.remove())

    li.classList.add('goal-checklist-item')
    li.setAttribute('role', 'checkbox')
    li.setAttribute('tabindex', '0')

    // ラベル内容を単一のflex itemにまとめる。地の文とinline codeが個別flex itemに
    // 分裂すると、末尾テキストが幅を奪い他のitemが1文字単位で折り返される。
    const label = document.createElement('span')
    label.className = 'goal-checklist-label'
    while (li.firstChild) {
      label.appendChild(li.firstChild)
    }

    const box = document.createElement('span')
    box.className = 'goal-checklist-box'
    box.setAttribute('aria-hidden', 'true')
    li.appendChild(box)
    li.appendChild(label)

    function render() {
      const checked = !!state[idx]
      li.setAttribute('aria-checked', checked ? 'true' : 'false')
      li.classList.toggle('is-checked', checked)
    }

    function toggle() {
      state[idx] = !state[idx]
      saveState(key, state)
      render()
      updateProgress()
    }

    li.addEventListener('click', (e) => {
      // liの中にリンクなどが含まれる可能性を考慮
      const target = e.target as HTMLElement
      if (target.closest('a')) return
      toggle()
    })
    li.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        toggle()
      }
    })

    render()
  })

  updateProgress()
}

async function run() {
  await nextTick()
  // VitePressのページ遷移後のDOM入れ替えを待つ
  setTimeout(enhance, 0)
}

onMounted(run)
watch(() => route.path, run)
</script>

<template>
  <span style="display: none" aria-hidden="true"></span>
</template>
