# UX観察スプリント（第3ラウンド）

## 実施環境

- 対象: http://localhost:5173/ （VitePress dev server）
- ビューポート: デスクトップ 1440x900 / モバイル 390x844
- 実施ツール: Playwright (Chromium)
- 実施日時: 2026-07-04
- 観察スクリプト: `scratchpad/ux-observe-r3.mjs` / スクリーンショット: `scratchpad/r3_mobile_4-2_*.png`
- 前回観察: `docs-internal/ux-observation-s67.md`

## 前回課題（S67）の解消状況

| S67課題 | 判定 | 検証 |
| --- | --- | --- |
| A. モバイルLessonNav現在レッスン名が16chで省略 | 〇 | `.lesson-nav__current` は `max-width: none / white-space: normal / text-overflow: clip`。モバイル4-2で「タスクカードをコンポーネント化して並べる」がスクショ上も省略なしで表示 |
| B. ゴール確認`code`が`break-all`でトークン途中改行 | △ | `word-break: break-all` は解除されたが、`.goal-checklist-item` が `display: flex` + `min-width: 0` のため、モバイルで**別経路の破綻**が発生（下記 課題G） |
| C. `/lessons/` フッター前後リンクが1-1に固定 | 〇 | `.pager-link` は0件、「← ホームに戻る」あり |
| D. 学習時間表と段落で日数感が重複 | 〇 | Read確認: 表は「読む時間の目安」列のみ。段落は「実所要は目安の約2倍」と倍率で1回言及、「10〜15日」記述なし |
| E. カリキュラム表から2本目以降に直行できない | 〇 | Read確認: 表に「レッスン」列を追加、`[1-1]…[7-1]` の18リンク掲載 |
| F. 2-2 L58が2-1文脈で書かれている | 〇 | 「あれば削除」の条件句を確認 |

## 新規に見つけた課題

### 課題G. モバイルのGoalChecklistで`<code>`が1文字ずつ縦積みされる（実害）

- モバイル4-2の1項目目「`PriorityTag` と `TaskCard` の2つをコンポーネント化し…」で、`PriorityTag` が「Pri/ori/tyT/ag」、`TaskCard` が「Ta/sk/Ca/rd」と縦4行に分解される（スクショで確認、実測 code 幅 43px / 34px）
- 原因: S63で `.goal-checklist-item` を `display:flex` + `min-width:0` にした結果、直下の `<code>` と地の文の text node が個別の flex item に分裂。末尾の長い日本語テキストが幅を奪い、他の flex item が任意箇所で折り返される（`overflow-wrap:anywhere` が過剰に効く）
- 効果: S68で`break-all`を外した狙い（`PriorityTag`を途中で切らない）が、flex分裂経由で実質再発している。前回S70観察はcomputedStyleだけを見て見落としていた
- 位置づけ: S67課題Bの実質的な未解消。実害あり
- 改善案: `.goal-checklist-item` の flex を保ちつつ、ラベル本文を1つのラッパー（例: `<span class="goal-checklist-label">`）にまとめて単一flex itemにする。あるいはラベル部分だけ `display: block` にする

### 課題H. サイドバーH2がH1より先にDOM出現（軽微）

- レッスンページの見出し走査で `H2×7`（章タイトル）が本文H1より前に並ぶ。VitePress標準サイドバーの構造由来
- スクリーンリーダーのH見出しジャンプで本文にたどり着くまで7ステップ必要
- 位置づけ: テーマ本格改修が必要。当面スコープ外

### 課題I: 無し（他に致命的な観察はなかった）

- 画像altは観察対象全ページで欠落なし
- 5ページ × 2幅で `scrollWidth == clientWidth`（横スクロールなし）
- ダーク切替でLessonNav/GoalChecklist/画像は崩れなし

## 判定

**判定: A（改善継続）**

S67課題6件のうち5件は解消。ただし課題B（`code`途中改行）は`display:flex`経由で実質再発しており、モバイル読解の中核であるゴール確認UIに実害が残る。前回s70観察の判定Bは撤回し、G解消を次スプリントの最優先タスクとする。G解消後に4ラウンド目観察を行い、卒業判定を再度行う。
