# 5-2 タスク一覧画面をコード生成する

5-1でFigma MCPサーバーの接続まで終わりました。ここからは、その接続を実際に使ってタスク一覧画面をコードに変換します。4章で作った `task-list` フレームの共有リンクをClaude Codeに渡し、まずトークンをCSSに書き出し、そのうえで画面のコンポーネントを生成させます。

生成されるコードの質は、Figma側の作り込みでほぼ決まります。3〜4章でレイヤー名やオートレイアウトを整えた効果が、ここで出てきます。

5-1で作った `task-app` の中でClaude Codeを起動し、ターミナルAで開発サーバーが動いている状態から始めます。

## 生成までの流れ

FigmaのデザインがReact + Tailwind CSSのコードになるまで、データは次のように流れます。

![Figma MCPによるコード生成の流れ。Figmaのtask-listデザインをget_design_contextで読み取り、Claude Codeが指示に沿ってReactとTailwind CSSのファイル、TaskList.tsxとTaskCard.tsxを生成する](/lessons/5-2/generation-flow.svg)

真ん中の `get_design_context` は、Figma MCPが持っているツールです。フレームの構造・オートレイアウトの設定・トークン・レイヤー名を一度にまとめて取得します。Claude Codeはこの中身を読み、指示に沿ってコードを組み立てます。

## トークンを先にCSSへ書き出す

コンポーネントを作らせる前に、色のトークンをCSS側に用意します。`get_variable_defs` は4-2で定義したトークンの一覧（`brand` は `#7C3AED`、`text/main` は `#2A2A31` など）を返すツールです。これをTailwindの `@theme` に書き出します。

`@theme` は自分の色をTailwindに教えるための書き方です。`--color-brand` と書けば `bg-brand`、`--color-text-main` と書けば `text-text-main` が使えるようになります。Figmaで付けたトークン名が、そのままクラス名になります。

先に書き出さないと、生成コードには `bg-[#7C3AED]` のように色の値が直接書かれます。見た目は同じですが、Figmaのトークンとはつながっていないので、紫を変えるときに全ファイルを直すことになります。

## 指示の書き方

画面を作らせる指示は、次の5つを盛り込むと結果が安定します。

- **Figmaの共有リンク**: どのフレームを対象にするか。フレーム単位でリンクをコピーする
- **技術スタック**: どの言語・ライブラリで書くか。ここではReact + Tailwind CSSを例にする
- **コンポーネント境界**: 1つのファイルにまとめず、どこで分けたいか
- **ファイル配置とファイル名**: どのディレクトリに、どんな名前で書き出してほしいか
- **色の指定方法**: 書き出した `@theme` のクラスを使わせる

実際に書くと次のようになります。演習ではこの雛形を使います。

```text
このFigmaのフレームをReact + Tailwind CSSで実装してください。

- URL: https://www.figma.com/design/xxxxx/xxxxx?node-id=1-234
- 出力先: src/components/task-list/
- コンポーネント分割: TaskCardは別ファイル（TaskCard.tsx）、
  TaskListが親としてTaskCardを並べる（TaskList.tsx）
- スタイル: Tailwind CSSのユーティリティクラスのみ。styled-componentsなどは使わない
- 色: src/index.css の @theme に定義したクラス（bg-brand、text-text-sub など）を使い、
  #7C3AED のような値の直書きはしない
- Figma側のレイヤー名（TaskCard、task-title、task-due など）を
  コンポーネント名やクラス名にできるだけ反映してください
- src/App.tsx から呼び出して、`/` のページに表示できる状態にしてください
```

「レイヤー名を反映してほしい」と1行入れておくと、`task-title` が `taskTitle` や `task-title` のクラスとして残りやすくなります。3-3で命名を整えた効果を確認できる場面です。

::: tip 他のスタックを使いたい場合
Vue、素のHTML/CSS、React Nativeなどでも、指示の骨格は同じです。「技術スタック」の行を差し替えれば、Claude Codeは同じ流れでコードを組み立てます。例として `Vue 3 + Composition API` や `HTMLファイル1枚（外部ライブラリなし）` のように書き換えてください。
:::

## 生成結果の受け取り方

指示を投げると、Claude Codeはおおむね次のような順で応答します。

1. Figma MCPの `get_design_context` を呼んでフレームの中身を読み取る
2. 生成するファイルツリー（例: `TaskList.tsx`、`TaskCard.tsx`）を提示する
3. 各ファイルの中身を書き出す（許可を求めてから書き込む場合もある）
4. 使い方や次の一手（親コンポーネントへの取り込み方など）を短くまとめる

まず読むべきは、2で提示されるファイルツリーです。想定していた分割になっているかをここで確認します。想定と違えば、コードを書き出す前に修正を指示できます。

コードが書き出された後は、次の観点で確認します。

- **構造**: `TaskList` が `TaskCard` を `map` で並べている形になっているか
- **クラス名・コンポーネント名**: レイヤー名がそのまま残っているか（`task-title` など）
- **Tailwindクラス**: オートレイアウトの間隔やパディングが `gap-4` や `p-4` のような形で出ているか
- **色**: `bg-brand`・`text-text-main` のように `@theme` のクラスで指定されているか

## 演習: タスク一覧画面を生成する

### 1. Figmaのリンクを用意する

1. Figmaで4章のファイルを開き、`task-list` フレームを選ぶ
2. 右クリック → **コピー/貼り付けオプション** → **選択範囲へのリンクをコピー** を選ぶ

### 2. トークンをCSSに書き出す

Claude Codeに次のように頼みます。URLは手順1でコピーしたものに差し替えます。

```text
このFigmaフレームのバリアブルを get_variable_defs で読み取り、
src/index.css の @theme に色トークンとして書き出してください。

- URL: <ここに task-list のリンク>
- 名前はFigma側のバリアブル名をそのまま使う（text/main → --color-text-main）
- セマンティックのトークンだけ。purple/500 のようなプリミティブは書き出さない
- 色だけでよい。余白・角丸・テキストスタイルは書き出さない
- @import "tailwindcss"; は残す
```

`src/index.css` を開いて、次の15行がそろっているか見比べます。並び順は違っていても構いません。

```css
@import "tailwindcss";

@theme {
  --color-brand: #7c3aed;
  --color-text-main: #2a2a31;
  --color-text-sub: #6e6e76;
  --color-text-inverse: #ffffff;
  --color-background: #f5f5f5;
  --color-surface: #ffffff;
  --color-border: #e5e5ea;
  --color-background-selected: #f3eeff;
  --color-placeholder: #d9d9e0;
  --color-priority-high-bg: #fee2e2;
  --color-priority-high-text: #b91c1c;
  --color-priority-mid-bg: #fef3c7;
  --color-priority-mid-text: #b45309;
  --color-priority-low-bg: #eeeeee;
  --color-priority-low-text: #4b5563;
}
```

足りない行や余分な行があれば、この15行をそのまま貼って「`@theme` をこれに合わせてください」と頼みます。

### 3. 画面の生成を指示する

上の雛形をコピーし、URLの行だけ、手順1でコピーした `task-list` のリンクに差し替えて送ります。

### 4. ファイルツリーとコードを確認する

1. Claude Codeが提示する `TaskList.tsx` と `TaskCard.tsx` の中身をエディタで開く
2. `TaskCard` のprops（タイトル・説明・優先度・期限などを受け取る形になっているか）を見る
3. `TaskList` の中でダミーデータの配列を `map` して `TaskCard` を並べているかを見る
4. 色が `bg-brand`・`text-text-sub` のようなクラスになっているかを見る

### 5. ブラウザで表示を確認する

ターミナルAの開発サーバーが動いているので、ファイルが書き出された時点でブラウザは自動で更新されています。白いカードが縦に並び、左にチェックの丸と優先度タグ、中央にタスク名、右端に期限が出れば成功です。

## よくあるやりとり

一発で理想どおりのコードが出ることは少ないです。次のような追加指示で少しずつ揃えていきます。

- **色が値で直書きされた**: 「`bg-[#7C3AED]` は `bg-brand` に、他の色も `@theme` のクラスに置き換えてください」
- **`done` バリアントが反映されない**: 「`done=true` のカードは完了タスクです。チェックの塗りを `bg-brand`、タイトルの色を `text-text-sub`、装飾に `line-through` を当ててください」
- **ファイルが1つにまとまってしまった**: 「`TaskCard` は別ファイル `TaskCard.tsx` に分けて、`TaskList.tsx` からimportする形にしてください」
- **クラス名がFigmaと違う**: 「レイヤー名の `task-title` と `task-due` を、Tailwindのクラス名の隣にコメントとして残してもらえますか」

修正指示は、いま出ているコードを一度読んでから書くのがコツです。

::: warning コール数に注意
同じフレームを何度も読み直させると、そのたびにFigmaのツールコールを消費します。Figma側には利用できるコール数の上限があるので、最初の指示に情報を盛り込み、修正はコードの書き換えだけで済むようにしてください。
:::

## 生成の質はFigma側の作り込みで決まる

Figma側が次のようになっていると、そのまま生成コードに出ます。

- **レイヤー名が良い**: `TaskCard`・`task-title` のような名前が、そのままコンポーネント名やクラス名になる
- **オートレイアウトが整っている**: 間隔・パディング・配置が、Tailwindの `gap-*`・`p-*`・`items-*` に翻訳される
- **トークンが定義されている**: `brand`・`text/main`・`space/16` のような名前で、色や余白の意図が伝わる

逆に、Figma側でレイヤー名が `Frame 42` のまま、オートレイアウトを使わずに座標で並べていると、生成されるコードは意味不明な要素名と絶対配置の羅列になります。手直しの手間は、そのまま元のデザインの整い具合で決まります。

見た目だけでは伝わらない挙動（クリックしたら何が起きるか、など）は、注釈に書いておくとClaude Codeに届きます。注釈はDev Modeに切り替えてツールバーの「Annotation」（`Shift + T`）を選び、対象のレイヤーをクリックして書きます。

## ゴール確認

- [ ] 4章のトークンを `src/index.css` の `@theme` に書き出せた
- [ ] 生成された `TaskList.tsx` と `TaskCard.tsx` の中身を読み、想定どおりの分割になっているか確認できた
- [ ] レイヤー名やトークン名が、そのままコンポーネント名やクラス名に出ることを確認できた
