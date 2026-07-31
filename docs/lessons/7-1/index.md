# 7-1 タスク登録フォームをコード生成する

5-2ではタスク一覧をコードに変換しました。ここでは2画面目、6章で作った `task-form` を同じ流れでコードにします。5-1で作った `task-app` の中でClaude Codeを起動し、ターミナルAで開発サーバーが動いている状態から始めます。閉じていたら、`task-app` で `npm run dev` と `claude` を立ち上げ直してください。

5-2との違いは、フォームには**バリアント付きのButton**と、ラベルと入力欄がひとまとまりになった**TextField**があることです。4章の `priority`・`active`・`done`、6-2の `variant: primary / secondary` と作ってきたバリアントが、コード生成でどう扱われるかを確認します。

## 5-2との違い: バリアントはpropsになる

Figma側のバリアントは、コード側では**コンポーネントのprops**にほぼそのまま対応します。6-2で `Button` に `variant` プロパティを付け、値を `primary` と `secondary` にしたのは、この変換を意識した設計でした。

![Figma側のButtonコンポーネントセット（primaryとsecondaryの2バリアント）が、コード側では Button の variant プロパティに変換される対応関係の図](/lessons/7-1/variant-to-props.svg)

コード側では、たとえばReact + TypeScriptなら次のような形になります。

```tsx
type Props = {
  variant: 'primary' | 'secondary'
  children: React.ReactNode
}

// 呼び出し側
<Button variant="primary">タスクを登録</Button>
```

Figma側のプロパティ名（`variant`）と値（`primary` / `secondary`）を、そのままpropsの名前と型に落とし込む形です。4章からプロパティ名と値の付け方を意識してきた効果が、ここで出ます。

TextFieldの `multiline` も同じ変換で、こちらは真偽値のpropsになります。ラベルと入力欄をひとまとまりにして1つのコンポーネントにしたので、呼び出し側は次のように並べるだけで済みます。

```tsx
<TextField label="タスク名 *" placeholder="例: 会議資料の作成" />
<TextField label="説明" placeholder="例: 共有する資料の要点をまとめる" multiline />
<TextField label="期限" placeholder="2026/07/10" />
<TextField label="優先度" placeholder="選択する ▼" />
<TextField label="カテゴリ" placeholder="例: デザイン" />
```

## 指示の書き方

5-2で使った5要素（Figmaリンク、技術スタック、コンポーネント境界、ファイル配置、トークンの使い方）は同じです。フォーム固有で足したいのは次の2点です。

- **TextFieldとButtonはそれぞれ別ファイルに分ける**: 一覧画面の `TaskCard` と同じ扱いです
- **Buttonの `variant` プロパティを型として明示する**: Figmaでバリアントを作った意図を、コード側でも `'primary' | 'secondary'` の形で残してもらう

雛形はこれです。URL部分だけ、自分の `task-form` フレームのリンクに差し替えてください。

```text
このFigmaのフレームをReact + Tailwind CSSで実装してください。

- URL: <ここに task-form のリンク>
- 出力先: src/components/task-form/
- コンポーネント分割:
  - TextField（label + input を持つ）を別ファイル TextField.tsx に。
    multiline を boolean のpropsで受け取れるようにする
  - Button を別ファイル Button.tsx に。variant プロパティを
    'primary' | 'secondary' のunion型で受け取れるようにする
  - TaskForm が親として TextField を5つと Button を2つ並べる（TaskForm.tsx）
- スタイル: Tailwind CSSのユーティリティクラスのみ
- トークン: src/index.css の @theme に定義したクラス（bg-brand、p-16、rounded-8 など）を
  使い、#7C3AED や 16px のような値の直書きはしない
- Figma側のレイヤー名（TextField・Button・label・input など）を
  コンポーネント名やクラス名にできるだけ反映してください
- src/NewTask.tsx から呼び出して、`/new/` のページに表示できる状態にしてください
  （`/` の一覧画面はそのまま残してください）
```

「union型で受け取れるように」と書いておくと、`variant: string` のような緩い型ではなく、Figmaで作った2値だけを受け付ける型として出やすくなります。

::: tip 動作は含めない
このレッスンで頼むのは「見た目のコード化」までです。送信時のイベントハンドラや入力値のバリデーションは、生成後に追加指示を出す形で分けるほうが結果が読みやすくなります（例:「TaskFormに `onSubmit` propsを追加してください」）。フォームライブラリを使うかどうかも、この段階では指示しません。
:::

## 演習: タスク登録フォームを生成する

### 1. Figmaのリンクを用意する

1. Figmaで4章から使っているファイルを開き、`task-form` フレームを選ぶ
2. 右クリック → **コピー/貼り付けオプション** → **選択範囲へのリンクをコピー** を選ぶ

### 2. 足りないトークンを追加する

フォームには一覧で使わなかった余白と角丸があります。5-2と同じ書き出しを、こんどは `task-form` に対してかけます。

```text
このFigmaフレームのバリアブルを get_variable_defs で読み取り、
src/index.css の @theme に足りないものだけ追加してください。

- URL: <ここに task-form のリンク>
- 名前の付け方は既にある行と同じ
- 既にある行は変えない
```

`src/index.css` に次の2行が増えていれば正しい状態です。

```css
  --spacing-48: 48px;
  --radius-16: 16px;
```

### 3. 画面の生成を指示する

上の雛形をコピーし、URLの行だけ、手順1でコピーした `task-form` のリンクに差し替えて送ります。

### 4. ファイルツリーとコードを確認する

Claude Codeが最初に提示するファイルツリーで、次を確認します。

- `TaskForm.tsx`、`TextField.tsx`、`Button.tsx` の3ファイルに分かれている
- `Button.tsx` の `variant` propsが `'primary' | 'secondary'` のunion型になっている
- `TaskForm.tsx` の中で `TextField` を5回、`Button` を2回呼んでいる

想定と違えば、コードを書き出す前に「Buttonのvariantは型を絞ってください」のように追加で指示します。

### 5. ブラウザで表示を確認する

`http://localhost:5173/new/` を開きます。フォームカードの中にラベル付きの入力欄が並び（期限と優先度は横2列）、右下に「キャンセル」と紫の「タスクを登録」ボタンが出ていれば成功です。

### 6. TaskListとの整合性を見比べる

`/` と `/new/` を行き来して見比べます。次の3点がそろっていれば、2画面の統一感がコードにも受け継がれています。

- **色**: ボタンの紫、カードの背景、テキストの色が両画面で同じクラス名になっている
- **角丸・余白**: カードの `rounded-*` と `p-*` が両画面で同じクラス名になっている
- **フォント**: 見出し・本文のフォントサイズとウェイトが両画面でそろっている

ずれていれば、Claude Codeに「TaskListと同じTailwind値を使うようにTaskFormを揃えてください」と追加で頼めます。Figma側で2画面とも同じトークンを使っておいた効果が、この揃えやすさに出ます。

## よくあるやりとり

- **`variant` が `string` 型で出た**: 「`variant` は `'primary' | 'secondary'` のunion型で書き直してください」
- **secondaryの色が反映されていない**: 「Figmaの `secondary` バリアントは白背景・紫枠・紫文字です。Tailwindで `bg-surface border border-brand text-brand` になるようにしてください」
- **TextFieldがTaskFormに直接埋め込まれた**: 「`TextField` は別ファイル `TextField.tsx` に分けて、`TaskForm.tsx` からimportする形にしてください」
- **動作を足したい**: 「`TaskForm` に `onSubmit: (values) => void` のpropsを追加し、送信時に5つの入力値をオブジェクトで渡してください」

修正指示は、いま出ているコードを一度読んでから書くのがコツです。ここは5-2と同じです。

## この章はここまで

これでデザインからコードへの変換を2画面ぶん体験しました。4章で作ったタスク一覧と6章で作ったタスク登録フォームが、両方ともコードとして手元にあります。1〜3章で覚えた手順を本番の2画面にそのまま当てはめ、整えたレイヤー名とコンポーネントが生成コードの質に出ることも2回とも確かめられました。お疲れさまでした。

## ゴール確認

- [ ] `task-form` のリンクとバリアント指定を含む指示をClaude Codeに投げられた
- [ ] 生成された `Button.tsx` の `variant` propsが `'primary' | 'secondary'` のunion型になっているか確認できた
- [ ] TaskListとTaskFormを並べて、色・角丸・タイポの整合性を見比べられた
