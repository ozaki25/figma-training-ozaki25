# 5-1 Figma MCPサーバーをセットアップする

4章でタスク一覧画面のデザインができました。5章では、その画面をFigma MCPとClaude Codeでコードに変換します。

このレッスンでは、生成したコードを表示するためのアプリを用意し、Figma側のデザインとClaude Codeのあいだをつなぐ「Figma MCPサーバー」をセットアップします。ここで整えた土台は、6章で作るフォームを7章でコードにするときにもそのまま使います。

## 前提

このレッスンは次の状態を前提にします。

- Claude Codeが手元のマシンにインストールされていて、ターミナルから `claude` コマンドで起動できる
- Figmaアカウントを持っていて、4章で作ったデザインファイルにブラウザまたはFigma Desktopでアクセスできる

## Figma MCPの役割

Figma MCPは、Figmaのデザインファイルを構造化されたデータとしてClaude Codeに渡すためのサーバーです。ブラウザで見えている絵ではなく、フレームの入れ子構造・オートレイアウトの設定・スタイル・レイヤー名といった「Figmaが内部で持っている情報」がそのままClaude Codeに届きます。

![Figma MCP接続の概念図。左のFigma（クラウド）から、中央のFigma MCPサーバー（Anthropic公式プラグイン経由）を通って、右のClaude Codeへ矢印が伸びる。Claude CodeはFigmaのデザイン情報を構造化データとして受け取り、コードを生成する](/lessons/5-1/mcp-connection.svg)

## RemoteサーバーとDesktopサーバー

Figma MCPには2つの形があります。ブラウザで認証して使う**Remoteサーバー**と、Figma DesktopアプリのDev Modeでローカルに立てる**Desktopサーバー**です。このハンズオンでは、Figma Desktopアプリが要らないRemoteサーバーを使います。

## 演習: アプリの用意とセットアップ

### 1. アプリのベースを作る

生成したコードを画面に出すための、React + Tailwind CSSのプロジェクトを作ります。設定を1つずつ手で書く代わりに、コマンドをまとめて実行します。ここからターミナルを2つ使います。

Figmaで作ったのはフルスクリーンの画面2枚なので、アプリ側もページを2つ用意します。一覧画面が `/`、登録フォームが `/new/` です。Viteは置いたHTMLファイルの数だけページを持てるので、ライブラリは要りません。

1. プロジェクトを置きたい場所（デスクトップなど）で**ターミナルA**を開く
2. 次のコマンドをまとめて貼り付けて実行する

   ```bash
   npx --yes create-vite@latest task-app --template react-ts --no-interactive --no-immediate
   cd task-app
   npm install
   npm install tailwindcss @tailwindcss/vite
   rm -rf src/assets src/App.css
   mkdir -p new

   cat > vite.config.ts <<'EOF'
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'
   import { resolve } from 'node:path'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     build: {
       rollupOptions: {
         input: {
           main: resolve(import.meta.dirname, 'index.html'),
           new: resolve(import.meta.dirname, 'new/index.html'),
         },
       },
     },
   })
   EOF

   cat > src/index.css <<'EOF'
   @import "tailwindcss";
   EOF

   cat > src/App.tsx <<'EOF'
   export default function App() {
     return (
       <div className="min-h-screen bg-[#f5f5f5] p-8">
         <p className="text-sm text-[#6e6e76]">ここにタスク一覧画面が入ります</p>
       </div>
     )
   }
   EOF

   cat > new/index.html <<'EOF'
   <!doctype html>
   <html lang="ja">
     <head>
       <meta charset="UTF-8" />
       <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>task-app</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/new.tsx"></script>
     </body>
   </html>
   EOF

   cat > src/new.tsx <<'EOF'
   import { StrictMode } from 'react'
   import { createRoot } from 'react-dom/client'
   import './index.css'
   import NewTask from './NewTask.tsx'

   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <NewTask />
     </StrictMode>,
   )
   EOF

   cat > src/NewTask.tsx <<'EOF'
   export default function NewTask() {
     return (
       <div className="min-h-screen bg-[#f5f5f5] p-8">
         <p className="text-sm text-[#6e6e76]">ここにタスク登録フォームが入ります</p>
       </div>
     )
   }
   EOF
   ```

3. `task-app` フォルダができたのを確認する

`rm -rf src/assets src/App.css` と `src/App.tsx` の書き換えは、テンプレートに付いてくるデモ用のロゴとCSSを消すためです。残しておくとTailwindの見た目と混ざります。

`new/index.html` が `/new/` のページになります。中の `src/new.tsx` が、既定の `src/main.tsx` と同じ役目で `NewTask` を描き出します。

### 2. 開発サーバーを起動する

コードを書き換えるたびにブラウザが自動で更新される状態にします。

1. ターミナルAはコマンドで `task-app` に移動した状態なので、そのまま `npm run dev` を実行する
2. 表示されたURL（`http://localhost:5173/`）をブラウザで開く。薄いグレーの背景に「ここにタスク一覧画面が入ります」と出る
3. `http://localhost:5173/new/` も開く。「ここにタスク登録フォームが入ります」と出る

どちらも文字が小さいグレーで表示されていれば、Tailwindも効いています。このターミナルは起動したまま、閉じずに置いておきます。

### 3. プラグインを入れて再起動する

Figmaプラグインを入れると、Figma MCPサーバーへの接続設定と、デザインからコードを生成するためのSkill（Claude Codeの拡張機能）がClaude Codeに追加されます。

1. **ターミナルB**を開き、`task-app` に移動して `claude` でClaude Codeを起動する
2. Claude Codeの入力欄に次のスラッシュコマンドを打つ。ターミナルのシェルではなく、Claude Codeの入力欄に打つ点に注意する

   ```text
   /plugin install figma@claude-plugins-official
   ```

3. インストール完了メッセージが出たら、Claude Codeを終了して、もう一度 `claude` で起動し直す

再起動が必要なのは、MCP接続がClaude Codeの起動時に初期化されるためです。インストールしただけでは接続されません。`task-app` の中で起動しているので、生成したファイルはこのプロジェクトに書かれます。

### 4. Figmaを認証して接続を確認する

1. `/plugin` を打って管理パネルを開き、「Installed」タブの `figma` を選んでEnterを押す
2. ブラウザが開いたら、Figmaにログインして「Allow access」を押す。許可するとブラウザは自動で閉じる
   - ブラウザが開かないこともある。認証済みか、別のFigma MCP接続が使われている場合なので、そのまま手順3で状態を確かめる
3. Claude Codeに戻り、`/mcp` を打って、一覧のFigmaのサーバーが **connected** になっていることを確認する

認証情報はローカルに保存されるので、この操作はマシンごとに一度だけです。

connectedになっていれば、`mcp__Figma__` で始まるツール群（`get_design_context`、`get_screenshot` など）がClaude Codeから呼べる状態です。

### 5. タスク一覧を読み取らせる

つながったかどうかは、Figmaのデザインを1つ読み取らせると分かります。

1. ブラウザまたはFigma Desktopで、4章で作ったタスク一覧のファイルを開く
2. `task-list` フレームを選び、右クリック → **コピー/貼り付けオプション** → **選択範囲へのリンクをコピー** を選ぶ
3. Claude Codeに戻り、次のプロンプトを投げる（URLはコピーしたものに差し替える）

   ```text
   このFigmaフレームの構造を教えて: <URL>
   ```

4. `task-list` の下に `header` や `content` があること、`brand` や `surface` などのトークン名が含まれていることを確認する

構造が返ってくれば、Figma MCPのセットアップは完了です。ここではまだコード生成はしません。5-2ではこの接続を使って、タスク一覧画面をコードに変換します。

## トラブルシューティング

うまくいかないときは、次を順に確認します。

- **`/plugin` を打っても figma が出てこない**: プラグインのインストールコマンドの後、Claude Codeを再起動しましたか。MCPは起動時にしか初期化されません
- **起動時に「MCP server "figma" skipped」と出る**: 過去に自分でFigma MCPを設定していると、同じ接続が既にあるので同梱ぶんはスキップされます。`/mcp` で connected になっていれば、そのまま進めて問題ありません
- **connected にならない**: ブラウザで「Allow access」を押した後、Claude Code側で数秒待ってから `/mcp` を打ち直します。それでも変わらなければ、ネットワーク（会社のプロキシなど）でAnthropic・Figmaへの接続が塞がれていないか確認します
- **フレームを読ませても中身が返ってこない**: 共有リンクが有効か、リンク先のファイルが自分のアカウントで閲覧できる状態かを確認します。プライベートなチームファイルは招待されていないと読めません

## 参考リンク

- [Figma Learn「Claude Code and Figma: Set up the MCP server」](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server)
- [Figma Developer Docs「Set up the remote server」](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- [Figma Learn「Guide to the Figma MCP server」](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [Claude Code Docs「Connect Claude Code to tools via MCP」](https://code.claude.com/docs/en/mcp)

## ゴール確認

- [ ] `task-app` を作り、開発サーバーを起動してブラウザで表示できた
- [ ] Figmaプラグインを入れ、`task-app` の中でClaude Codeを起動し直せた
- [ ] ブラウザで認証し、`/mcp` でFigmaのサーバーが connected になったことを確認できた
- [ ] タスク一覧のフレームをClaude Codeに読み取らせ、構造が返ってくることを確認できた
