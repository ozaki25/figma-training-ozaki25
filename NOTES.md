# 調査メモ

スプリントで得た調査結果・技術的な決定事項を記録する。実装時はここを参照する。

## 参考リポジトリ技術構成調査（2026-07-01）

全4リポジトリ共通: デフォルトブランチはmain。vercel.jsonはどこにも存在せず、
デプロイはVercelのGit連携（push時自動デプロイ）。GitHub Actionsはビルド検証専用。

### figma-training-ozaki25 が採用する構成（決定）

ベース: ux-certification-basics-ozaki25 / color-coordination-training-ozaki25 の構成
（この2つはほぼ同一で、textlint込みの実績ある構成のため）

- Node 22（`engines.node >= 22`）、`"type": "module"`、private
- vitepress ^1.6.4
- PWA: @vite-pwa/vitepress ^1.1.0 + @vite-pwa/assets-generator ^1.0.2 + vite-plugin-pwa ^1.2.0
  - registerType: autoUpdate、日本語manifest、NetworkFirst(navigate, timeout 5s)、
    maximumFileSizeToCacheInBytes 5MB、アイコン64/192/512+maskable
  - ルートに pwa-assets.config.ts、scripts に pwa:icons
- @vercel/analytics ^2.0.1、@vercel/speed-insights ^2.0.0
- textlint ^15.6.0 + textlint-rule-preset-ja-technical-writing ^12.0.2 +
  textlint-filter-rule-comments ^1.3.0
  - .textlintrc.json は ux/color と同一内容を流用（sentence-length: 150、max-ten: 5、
    max-kanji-continuous-len: 8、dearu-desumasu等の混在系ルールはfalse）
- vitepress-plugin-tabs（^0.9.0 を採用、新しい方）
- markdown-it-cjk-friendly ^2.0.2（日本語太字レンダリング問題の回避。採用）
- VitePress設定: withPwaラッパー、日本語ロケール、ローカル検索（日本語UI翻訳付き）、
  章ごとのcollapsedサイドバー、OGP/Twitterカード、noindex,nofollow、cleanUrls
- scripts: docs:dev / docs:build / docs:preview / docs:lint / pwa:icons
- GitHub Actions build.yml: main push + PRトリガー、Node 22 + npmキャッシュ、
  npm ci → textlint → docs:build
- docs/ 構成: .vitepress/（config.mts + theme/）、lessons/、public/、index.md、404.md

### 採用しないもの（理由）

- Mermaid（vitepress-plugin-mermaid）: 本リポジトリは図をSVG自作する方針のため不要
- CodeMirrorブラウザ内エディタ一式: Figma研修ではコード編集演習がないため不要
- @shikijs/vitepress-twoslash: TypeScript解説向けのため不要
- quiz/ ディレクトリ・quiz:validate: ドリルは作らない方針のため不要
- Playwright e2e（uxのみ導入）: 当面不要。必要になったら検討
- vercel.json: 参考リポジトリ同様、Vercel Git連携に任せるため不要

### 補足

- web-front-training-ozaki25 の現mainにはtextlintは未導入（textlint構成の参照元には使わない）
- テーマカラーの参考: ux #3949ab、color #c2185b → figmaは Figmaブランド系の紫を使う（PLAN.md参照）

## サイトテーマ配色（2026-07-01）

Figmaブランドの紫 #A259FF を軸に、WCAG AAを満たすよう明度を調整した。
実装は `docs/.vitepress/theme/custom.css`。検証は `scripts/check-contrast.mjs`（`node scripts/check-contrast.mjs` で再実行できる）。
`theme-color` メタとPWA manifestの `theme_color` は #7C3AED に更新済み。

アクセントにはFigmaブランドの他色を2色だけ使う。ヒーロー見出しのグラデーション終点
（ライトはオレンジ系 #C2410C、ダークは緑系 #5EDDA8）と、ヒーロー画像背景のぼかし
（緑 #0ACF83・青 #1ABCFE ベースの半透明。装飾のためコントラスト要件の対象外）。

### コントラスト比の検証結果（すべてAA合格）

| 用途 | 前景 | 背景 | 比率 | 基準 |
| --- | --- | --- | --- | --- |
| light: brand-1（リンク） | #6D28D9 | #FFFFFF | 7.10:1 | 4.5:1 |
| light: brand-2（hover） | #5B21B6 | #FFFFFF | 8.98:1 | 4.5:1 |
| light: ボタン文字 | #FFFFFF | #7C3AED | 5.70:1 | 4.5:1 |
| light: ボタン文字（hover） | #FFFFFF | #6D28D9 | 7.10:1 | 4.5:1 |
| light: ヒーロー見出しグラデ始点 | #6D28D9 | #FFFFFF | 7.10:1 | 3:1（大） |
| light: ヒーロー見出しグラデ終点 | #C2410C | #FFFFFF | 5.18:1 | 3:1（大） |
| dark: brand-1（リンク） | #C4A5FF | #1B1B1F | 8.32:1 | 4.5:1 |
| dark: brand-2（hover） | #D4BEFF | #1B1B1F | 10.31:1 | 4.5:1 |
| dark: ボタン文字 | #FFFFFF | #7C3AED | 5.70:1 | 4.5:1 |
| dark: ヒーロー見出しグラデ始点 | #C4A5FF | #1B1B1F | 8.32:1 | 3:1（大） |
| dark: ヒーロー見出しグラデ終点 | #5EDDA8 | #1B1B1F | 10.12:1 | 3:1（大） |

## Figma現行UI調査（2026-07）

1-1執筆前にWeb検索で確認した、2026年7月時点のFigma Designエディタの画面構成。

- エディタは4領域で構成: ツールバー、左サイドバー、右サイドバー、キャンバス
- ツールバーは**画面下部の中央**に浮いている（2024年のUI3リデザイン以降）。移動ツール、フレーム、シェイプ、テキスト、コメントなどの作成系ツールが並ぶ
- 左サイドバーはレイヤーとページの一覧（公式ヘルプでの呼称は「左サイドバー」。レイヤーパネルとも呼ばれる）。Assets（コンポーネント挿入）もここから
- 右サイドバーは選択中オブジェクトのプロパティを表示・編集する場所（呼称は「右サイドバー」または「プロパティパネル」）。DesignタブとPrototypeタブがある。選択に応じて表示内容が変わる
- **2026年前半から新しい「ナビゲーションバー」を段階的にロールアウト中**。画面最左端の細い縦バーで、レイヤー・Assets・変数・通知などの入口を集約。従来左サイドバー上部にあったFile/Assetsタブがここへ移動。ロールアウト中のため、ユーザーによって新旧どちらのUIも当たり得る。レッスンでは「最左端に細い縦バーが見える場合もある」と両対応の書き方にする

情報源:

- Figma Learn「Explore the navigation bar and left sidebar」(help.figma.com/hc/en-us/articles/360039831974)
- Figma Learn「Design, prototype, and explore layer properties in the right sidebar」(help.figma.com/hc/en-us/articles/360039832014)
- Figma Learn「Access design tools from the toolbar」(help.figma.com/hc/en-us/articles/360041064174)
- Figma Blog「Making the Move to UI3」(UI3で下部ツールバー化)
- Figma Forum(2026年1月、新左ナビゲーションバーのロールアウトに関するユーザー投稿)

### 追加調査: フレーム・ズーム・ページ（2026-07、1-2執筆時）

- フレームツールのショートカットは `F`（`A` でも可）。ツールを選ぶと**右サイドバーにプリセット一覧**が出る（Phone / Tablet / Desktop / Presentation などのカテゴリ）
- Desktopプリセットは 1440×1024。Phoneカテゴリに iPhone 各機種などがある
- パン: Space + ドラッグ（押している間だけ手のひらツールになる）
- ズーム: Cmd/Ctrl + スクロール。ショートカットは Shift+1（全体表示）、Shift+2（選択範囲にズーム）、Shift+0（100%）、+ / -（段階ズーム）
- ページ: 左サイドバー上部のページ名をクリックするとページ一覧が開く。「+」で追加、右クリック → Rename で名前変更。ページ一覧の位置は新ナビゲーションバーUIでも左サイドバー内で変わらない

情報源:

- Figma Learn「Frames in Figma Design」(help.figma.com/hc/en-us/articles/360041539473)
- Figma Learn「FD4B: Create a frame using frame presets」(help.figma.com/hc/en-us/articles/30974070391191)
- Figma Learn「Adjust your zoom and view options」(help.figma.com/hc/en-us/articles/360041065034)
- Figma Learn「Create and manage pages」(help.figma.com/hc/en-us/articles/360038511293)

### 追加調査: シェイプ・テキスト・角丸（2026-07、2-1執筆時）

- シェイプツールのショートカット: 四角形 `R`、楕円 `O`、直線 `L`。ツールバーのシェイプツール（四角形アイコン）を長押しすると種類を切り替えられる
- `Shift` を押しながらドラッグすると縦横比が固定される（正方形・正円になる）
- 角丸（Corner radius）はUI3では右サイドバーの **Appearance セクション**にある。数値入力のほか、アイコン上を左右ドラッグでも調整できる。選択対象によってフィールドの位置が変わることがある
- 塗りは右サイドバーの **Fill セクション**。色スウォッチをクリックするとカラーピッカーが開く。「+」で塗りを追加
- テキストツールは `T`。キャンバスをクリックしてそのまま入力。フォント・サイズ・ウェイトは右サイドバーの **Typography セクション**で変更する
- 重なり順の変更: 左サイドバーでドラッグ（一覧の上が前面）。ショートカットは `Cmd/Ctrl + ]`（前面へ）、`Cmd/Ctrl + [`（背面へ）

情報源:

- Figma Learn「Adjust corner radius and smoothing」(help.figma.com/hc/en-us/articles/360050986854)
- Figma Learn「Design an interactive button component」(help.figma.com/hc/en-us/articles/20953528101783)
- Figma Forum「UI3: fix corner radius input in place」(角丸フィールドの位置がUI3で選択対象により変わる点)

### 追加調査: Auto Layout（2026-07、2-2執筆時）

- 適用: レイヤーを選択して `Shift + A`（Mac/Windows共通）。右サイドバーの Layout セクションの「Add auto layout」でも同じ
- 適用時、Figmaが縦・横・グリッドのどのフローが適切か自動判定する（並び方向は後から変更できる）
- 設定は右サイドバーの **Layout セクション**に集約: フロー（Vertical / Horizontal / Grid の3種。GridもUI3でフローの1つとして選べる）、要素間の間隔（gap）、パディング（水平・垂直。個別指定も可）、整列（9マスのアラインメントボックス）
- Horizontal 選択時のみ **Wrap**（折り返し）が選べる
- 解除: `Shift + Option + A`（Windowsは `Shift + Alt + A`）。右クリック → More layout options → Remove all auto layout でネストごと一括解除も可能
- 「Suggest auto layout」機能: フレーム内の構造をFigmaが推測して必要なAuto Layoutをまとめて付与する。挙動が読みにくいためレッスンでは扱わない（手動のShift+Aのみ教える）

情報源:

- Figma Learn「Guide to auto layout」(help.figma.com/hc/en-us/articles/360040451373)
- Figma Learn「Toggle on auto layout in designs」(help.figma.com/hc/en-us/articles/5731482952599)
- Figma Learn「Use the horizontal and vertical flows in auto layout」(help.figma.com/hc/en-us/articles/31289464393751)

### 追加調査: リサイズ挙動 Hug/Fixed/Fill（2026-07、2-3執筆時）

- リサイズ設定は右サイドバーの **W / H 入力欄それぞれのドロップダウン**で選ぶ。選択肢は Fixed（固定値）/ Hug contents / Fill container の3つ
- **Hug contents** は中身に合わせて最小サイズを保つ。Auto Layoutフレームとテキストだけが選べる
- **Fill container** は親のAuto Layoutフレームいっぱいに広がる。**親がAuto Layoutのときだけ**選択肢に出る
- **Fixed** は中身や親が変わってもサイズを変えない。数値を直接入力するとFixedになる
- ドロップダウンの項目にホバーすると、キャンバス上にリサイズ結果のガイド線がプレビュー表示される
- ショートカット: `Option/Alt + ダブルクリック`（バウンディングボックスの縦横の辺）で Fill を設定できる

情報源:

- Figma Learn「Guide to auto layout」(help.figma.com/hc/en-us/articles/360040451373)
- Figma Learn「Create a responsive card with auto layout and constraints」(help.figma.com/hc/en-us/articles/18894664907287)
- Figma Forum「New Auto Layout, Hug content and Fill container」

### 追加調査: スタイル（色・テキスト）とVariables（2026-07、3-1執筆時）

- 色スタイルの登録: 要素を選択し、右サイドバー Fill セクション右上の**スタイルアイコン（点が4つ並んだアイコン。ホバーで「Apply styles and variables」と出る）**をクリック → パネル右上の「+」→ 名前を付けて Create style
- テキストスタイルの登録: テキストを選択し、Typography セクション右上の同じ4点アイコン → 「+」→ Create style。フォント・サイズ・ウェイト・行間がまとめて保存される
- 適用: 対象を選択して同じ4点アイコンからスタイル名を選ぶ。検索も可能
- 編集: 何も選択していない状態の右サイドバーに「Local styles」一覧が出る。スタイル名にホバーすると出る**調整アイコン（スライダー型）**から定義を編集。編集すると適用中の全要素に一括反映される
- スタイル名に `/` を入れるとグループ化される（例: `text/main` と `text/sub` は text グループにまとまる）
- Variables: 2026年時点で色・数値などを保存できる別機能。ライト/ダークのモード切替やデザイントークンに使う。単一値のみでグラデーション等は保存できない。公式も「Variablesはスタイルの置き換えではない」としており、単純な色・テキストの共通化ならスタイルで十分 → **本ハンズオンではスタイルのみ扱い、Variablesは名前の紹介にとどめる（決定）**

情報源:

- Figma Learn「Create color, text, effect, and layout guide styles」(help.figma.com/hc/en-us/articles/360038746534)
- Figma Learn「Apply styles to layers and objects」(help.figma.com/hc/en-us/articles/360040316193)
- Figma Learn「Manage and share styles」(help.figma.com/hc/en-us/articles/360039820134)
- Figma Learn「The difference between variables and styles」(help.figma.com/hc/en-us/articles/15871097384471)

### 追加調査: コンポーネントとバリアント（2026-07、3-2執筆時）

- コンポーネント化: 要素を選択して右クリック →「Create component」、またはショートカット `Cmd + Option + K`（Windowsは `Ctrl + Alt + K`）。ツールバー中央のコンポーネント作成ボタン（ひし形4つのアイコン）でも可
- メインコンポーネントはレイヤーパネルで**塗りのひし形4つの紫アイコン**、キャンバス上では紫の枠で表示される。インスタンスは**輪郭だけのひし形1つの紫アイコン**
- インスタンスの作成: メインコンポーネントをコピー&ペースト（`Cmd/Ctrl + D` の複製も可）、または左サイドバーの **Assets パネル**からキャンバスへドラッグ。クイック挿入は `Shift + I`
- メインコンポーネントを編集すると、同一ファイル内の全インスタンスに自動反映される
- インスタンス側ではテキスト・色などの**上書き（override）**ができる。上書きした箇所はメイン側の変更で上書きされずに残る。構造（レイヤーの追加・削除）はインスタンス側では変えられない
- バリアント: メインコンポーネントを選択すると右サイドバーに「**Add variant**」が出る（選択中のコンポーネント下端の紫の「+」でも追加できる）。追加すると同じ見た目のバリアントが複製され、2つが**紫の破線枠のコンポーネントセット**にまとまる
- プロパティは初期名「Property 1」、値は「Default / Variant2」。右サイドバーの Current variant セクションでプロパティ名・値を編集できる（例: プロパティ `online`、値 `true / false`）
- インスタンスを選択すると右サイドバーにプロパティのドロップダウンが出て、バリアントを切り替えられる
- 複数の既存コンポーネントをまとめる場合は選択して右サイドバーの「Combine as variants」

情報源:

- Figma Learn「Create components to reuse in designs」(help.figma.com/hc/en-us/articles/360038663154)
- Figma Learn「Create and insert component instances」(help.figma.com/hc/en-us/articles/360039150173)
- Figma Learn「Create and use variants」(help.figma.com/hc/en-us/articles/360056440594)
- Figma Learn「Design an interactive button component」(help.figma.com/hc/en-us/articles/20953528101783)
- Figma Learn「FD4B: Components fundamentals」(help.figma.com/hc/en-us/articles/30984647753751)

### 追加調査: レイヤーのリネーム（2026-07、3-3執筆時）

- デフォルト名は要素の種類 + 連番で自動付与される（Rectangle 1、Ellipse 2、Frame 3 など）
- リネーム: レイヤーパネルの名前を**ダブルクリック**、または選択して `Cmd + R`（Windowsは `Ctrl + R`）。右クリック →「Rename」でも可
- **一括リネーム**: 複数レイヤーを選択して同じ `Cmd/Ctrl + R` を押すと一括リネームのダイアログが開く
  - 「Rename to」に新しい名前を入力。「Number ↑ / Number ↓」ボタンで連番を付与できる
  - 「Match」欄で名前の一部だけを検索・置換できる。正規表現も使える
- 「Rename layers with AI」機能もある（Actionsから。中身を見てAIが名前を提案）。挙動が環境依存のためレッスンでは名前の紹介にとどめ、手動リネームを教える
- Figma MCPを使ったコード生成では、レイヤー名・構造・Auto Layout・変数/スタイルが生成コードの品質に直結する。公式のMCPガイドも意味のあるレイヤー名（hero-section、cta-button など）とコンポーネント・Auto Layoutの活用を推奨している

情報源:

- Figma Learn「Rename Layers」(help.figma.com/hc/en-us/articles/360039958934)
- Figma Learn「Rename layers with AI」(help.figma.com/hc/en-us/articles/24004711129879)
- Figma Learn「Guide to the Figma MCP server」(help.figma.com/hc/en-us/articles/32132100833559)
- figma/mcp-server-guide (github.com/figma/mcp-server-guide)
