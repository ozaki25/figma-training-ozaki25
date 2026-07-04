# UX観察スプリント（第4ラウンド・卒業判定）

## 実施環境

- 対象: http://localhost:5173/lessons/4-2/
- ビューポート: モバイル 390x844 / デスクトップ 1440x900
- ツール: Playwright (Chromium)
- 実施日時: 2026-07-04
- スクリプト: `scratchpad/ux-observe-r4.mjs` / スクショ: `scratchpad/r4_{mobile,desktop}_4-2.png`

## S71修正の再検証結果

| 観点 | モバイル 390x844 | デスクトップ 1440x900 |
| --- | --- | --- |
| `.goal-checklist-item code` 実寸 | `PriorityTag`= 104.4×22px, `TaskCard`= 79.2×22px | 同左（1行） |
| `.goal-checklist-label` ラッパー数 | 3 (= item数) | 3 |
| `document.scrollWidth == clientWidth` | 390 == 390 | 1440 == 1440 |
| LessonNav表示 | 「タスクカードをコンポーネント化して並べる」省略なし | 同左 |
| サイドバーリンク数 | 19（欠落・重複なし） | 19 |

## GoalChecklist機能

- 初期 `aria-checked="false"` → クリック後 `"true"` → リロード後も `"true"` を保持（localStorage永続化OK）

## 判定

**判定: B（卒業）**

S70課題G（`code`縦積み再発）はS71のラッパー統一で解消。code高さは全て22px（≤24px閾値内）、body横スクロールなし、チェック機能・永続化・他コンポーネントいずれも副作用なし。3ラウンドかけたUX観察サイクルはここで一旦終了とする。追加要望が出た時点で新規スプリントを立てる。
