# S65 モバイル実機幅チェック（Playwright）

## 検証条件

- iPhone14 (390x844) / iPhoneSE (375x667) / Android (412x915)
- 対象: `/`, `/lessons/`, `/lessons/1-1/`, `/lessons/4-3/`, `/lessons/6-2/`
- Playwrightで `document.body.scrollWidth`、はみ出し要素、フォントサイズ、タップ領域を計測
- スクリプト: `scratchpad/check.mjs`

## 修正前の詰まり

### 1. `/lessons/6-2/` で body 横スクロール発生（重要）

- iPhoneSE (375) で `body.scrollWidth = 428`（53px 横スクロール）
- iPhone14/Android でも同様の横スクロール
- 原因: ゴール確認セクションの `<li>` が `display: flex`。項目本文の中の
  インライン `<code>TaskCard.tsx</code>` のようなドット付きの英数字トークンが
  改行できず、フレックス子要素が縮まないため右にはみ出していた
  （デフォルトの `min-width: auto` の罠）
- 実測: 該当 `<code>` が `right=383` に位置、`.goal-checklist` UL の
  `scrollWidth=404` vs `clientWidth=327`

### 2. header-anchor の `<a>` タップ領域 37x18（軽微）

- LessonNavのパンくず「ホーム」リンク。インラインテキストのため
  WCAG 2.5.8 の "inline" 例外に該当。修正見送り

## 修正内容

`docs/.vitepress/theme/custom.css` の `.goal-checklist-item` に以下を追加:

```css
min-width: 0;
overflow-wrap: anywhere;
word-break: break-word;
```

さらに、

```css
.goal-checklist-item > *:not(.goal-checklist-box) { min-width: 0; }
.goal-checklist-item code { overflow-wrap: anywhere; word-break: break-all; }
```

これでフレックス子要素が縮小可能になり、インラインcodeも折り返せる。

## 修正後の再検証結果

全 15 パターン（3ビューポート×5ページ）で:

- `body.scrollWidth == documentElement.clientWidth`（横スクロールなし）
- 12px未満のフォントなし
- `.goal-checklist` 内のタップ領域は 44px 以上を確保（既存の padding 10px+行高で確保済み）
- 4-3 の表・6-2 のコードブロックは `overflow-x: auto` の内側に閉じ込められており、
  ページ全体の横スクロールには影響しない（意図どおり）

## ビルド

`npm run docs:build` 通過。

## 見送り（BACKLOG候補）

- header-anchor の paragraph link 拡大: インライン例外に該当するため必須ではないが、
  「ホーム」パンくずリンクだけは padding を厚めにしても良い。次回検討
- コードブロックのフォントサイズ調整: 現状 12px 以上・可読性OK。触らず
