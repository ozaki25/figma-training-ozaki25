# 6-3 タスク登録フォームをコード生成する

6-2ではタスク一覧をコードに変換しました。ここでは2画面目、5章で作った `task-form` を同じ流れでコードにします。ゴールはこのハンズオンの締めくくり、2画面ぶんのコード化が終わることです。

6-2との違いは、フォームには**バリアント付きのButton**と、ラベルと入力欄がひとまとまりになった**TextField**があることです。バリアントとはコンポーネントの見た目を切り替えるプロパティのことで、5-2で `variant: primary / secondary` を作りました。これがコード生成でどう扱われるかを、このレッスンで確認します。

## 6-2との違い: バリアントはpropsになる

Figma側のバリアントは、コード側では**コンポーネントのprops**にほぼそのまま対応します。5-2で `Button` に `variant` プロパティを付け、値を `primary` と `secondary` にしたのは、この変換を意識した設計でした。

![Figma側のButtonコンポーネントセット（primaryとsecondaryの2バリアント）が、コード側では Button の variant プロパティに変換される対応関係の図](/lessons/6-3/variant-to-props.svg)

コード側では、たとえばReact + TypeScriptなら次のような形になります。

```tsx
type Props = {
  variant: 'primary' | 'secondary'
  children: React.ReactNode
}

// 呼び出し側
<Button variant="primary">登録</Button>
```

Figma側のプロパティ名（`variant`）と値（`primary` / `secondary`）を、そのままpropsの名前と型に落とし込む形です。3-2でプロパティ名と値をどう付けるかを意識したのは、この段階で意味を持ちます。

TextFieldの方はバリアントを作っていないので、propsとしては `label` と `placeholder` だけ受け取る形になります。ラベルと入力欄をひとまとまりにして1つのコンポーネントにしたので、呼び出し側は次のように3行並べるだけで済みます。

```tsx
<TextField label="タスク名" placeholder="例: 会議資料の作成" />
<TextField label="期限" placeholder="2026/07/10" />
<TextField label="メモ" placeholder="任意" />
```

## 指示の書き方

6-2で使った4要素（Figmaリンク、技術スタック、コンポーネント境界、ファイル配置）は同じです。フォーム固有で足したいのは次の2点です。

- **TextFieldとButtonはそれぞれ別ファイルに分ける**: 一覧画面の `TaskCard` と同じ扱いです
- **Buttonの `variant` プロパティを型として明示する**: Figmaでバリアントを作った意図を、コード側でも `'primary' | 'secondary'` の形で残してもらう

雛形はこれです。URL部分だけ、自分の `task-form` フレームのリンクに差し替えてください。

```text
このFigmaのフレームをReact + Tailwind CSSで実装してください。

- URL: <ここに task-form のリンク>
- 出力先: src/components/task-form/
- コンポーネント分割:
  - TextField（label + input を持つ）を別ファイル TextField.tsx に
  - Button を別ファイル Button.tsx に。variant プロパティを
    'primary' | 'secondary' のunion型で受け取れるようにする
  - TaskForm が親として TextField を3つと Button を並べる（TaskForm.tsx）
- スタイル: Tailwind CSSのユーティリティクラスのみ
- Figma側のレイヤー名（TextField・Button・label・input など）を
  コンポーネント名やクラス名にできるだけ反映してください
```

「union型で受け取れるように」と書いておくと、`variant: string` のような緩い型ではなく、Figmaで作った2値だけを受け付ける型として出やすくなります。

::: tip 動作は含めない
このレッスンで頼むのは「見た目のコード化」までです。送信時のイベントハンドラや入力値のバリデーションは、生成後に追加指示を出す形で分けるほうが結果が読みやすくなります（例:「TaskFormに `onSubmit` propsを追加してください」）。フォームライブラリを使うかどうかも、この段階では指示しません。
:::

## 演習: タスク登録フォームを生成する

### 1. Figmaのリンクを用意する

1. Figmaで5章のファイルを開き、`task-form` フレームを選ぶ
2. 右クリック → **Copy/Paste as** → **Copy link to selection** でURLをコピーする

### 2. Claude Codeに指示を投げる

上の雛形をコピーし、URLだけ差し替えて送ります。出力先は6-2で使ったのと同じプロジェクトの `src/components/task-form/` にすると、次の演習手順で2画面をまとめて確認できます。

### 3. ファイルツリーとコードを確認する

Claude Codeが最初に提示するファイルツリーで、次を確認します。

- `TaskForm.tsx`、`TextField.tsx`、`Button.tsx` の3ファイルに分かれている
- `Button.tsx` の `variant` propsが `'primary' | 'secondary'` のunion型になっている
- `TaskForm.tsx` の中で `TextField` を3回、`Button` を1回呼んでいる

想定と違えば、コードを書き出す前に「Buttonのvariantは型を絞ってください」のように追加で指示します。

### 4. ローカルで表示してみる

生成された3ファイルを `src/components/task-form/` に置き、適当なページから `<TaskForm />` を呼び出します。ブラウザで、フォームカードの中にラベル付きの入力欄が3つ縦に並び、下に紫の登録ボタンが幅いっぱいで出ていれば成功です。

### 5. TaskListとの整合性を見比べる

6-2で生成した `TaskList` と、いま生成した `TaskForm` を同じページに並べて表示してみます。次の3点がそろっていれば、2画面のトンマナがコードにも受け継がれています。

- **色**: ボタンの紫、カードの背景、テキストの色が両画面で同じ値になっている
- **角丸・余白**: カードの `rounded-*` と `p-*` の値が近い（5-3で揃えた効果）
- **フォント**: 見出し・本文のフォントサイズとウェイトが両画面でそろっている

ずれていれば、Claude Codeに「TaskListと同じTailwind値を使うようにTaskFormを揃えてください」と追加で頼めます。Figma側で色スタイルを共有しておいた効果が、この揃えやすさに出ます。

## よくあるやりとり

- **`variant` が `string` 型で出た**: 「`variant` は `'primary' | 'secondary'` のunion型で書き直してください」
- **secondaryの色が反映されていない**: 「Figmaの `secondary` バリアントは白背景・紫枠・紫文字です。Tailwindで `bg-white border border-[#7C3AED] text-[#7C3AED]` になるようにしてください」
- **TextFieldがTaskFormに直接埋め込まれた**: 「`TextField` は別ファイル `TextField.tsx` に分けて、`TaskForm.tsx` からimportする形にしてください」
- **動作を足したい**: 「`TaskForm` に `onSubmit: (values) => void` のpropsを追加し、送信時に3つの入力値をオブジェクトで渡してください」

修正指示は、いま出ているコードを一度読んでから書くのがコツです。ここは6-2と同じです。

## 2画面のコード化が完了

これで、4章で作ったタスク一覧と、5章で作ったタスク登録フォームが両方ともコードとして手元にあります。ゼロからのUIデザインが、Figmaを経由してそのまま動くコードに変換される流れを一通り体験できました。7章で2日間全体を振り返ります。

## ゴール確認

- [ ] `task-form` のリンクとバリアント指定を含む指示をClaude Codeに投げられた
- [ ] 生成された `Button.tsx` の `variant` propsが `'primary' | 'secondary'` のunion型になっているか確認できた
- [ ] TaskListとTaskFormを並べて、色・角丸・タイポの整合性を見比べられた
