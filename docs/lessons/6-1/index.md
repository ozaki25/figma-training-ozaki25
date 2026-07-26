# 6-1 Figma MCPサーバーをセットアップする

ここまで4章でタスク一覧、5章で登録フォームと、2画面のデザインを作ってきました。6章ではその2画面をFigma MCPとClaude Codeでコードに変換します。

このレッスンでは、生成したコードを表示するためのアプリを用意し、Figma側のデザインとClaude Codeのあいだをつなぐ「Figma MCPサーバー」をセットアップします。生成そのものは6-2と6-3で行うので、ここでは動かす土台を整えます。

## 前提

このレッスンは次の状態を前提にします。

- Claude Codeが手元のマシンにインストールされていて、ターミナルから `claude` コマンドで起動できる
- Figmaアカウントを持っていて、4章・5章で作ったデザインファイルにブラウザまたはFigma Desktopでアクセスできる

## Figma MCPの役割

Figma MCPは、Figmaのデザインファイルを構造化されたデータとしてClaude Codeに渡すためのサーバーです。ブラウザで見えている絵ではなく、フレームの入れ子構造・オートレイアウトの設定・スタイル・レイヤー名といった「Figmaが内部で持っている情報」がそのままClaude Codeに届きます。

![Figma MCP接続の概念図。左のFigma（クラウド）から、中央のFigma MCPサーバー（Anthropic公式プラグイン経由）を通って、右のClaude Codeへ矢印が伸びる。Claude CodeはFigmaのデザイン情報を構造化データとして受け取り、コードを生成する](/lessons/6-1/mcp-connection.svg)

## RemoteサーバーとDesktopサーバー

2026年7月時点で、Figma MCPには次の提供形態があります。

- **Remoteサーバー（推奨）**: Anthropic公式のClaude CodeプラグインとしてFigmaが用意しているもの。Figma Desktopアプリは不要で、ブラウザでOAuth認証するだけで使えます。全プラン・全シートで使えます
- **Desktopサーバー（Dev Mode）**: Figma DesktopアプリでDev Modeを有効にしてローカルにMCPサーバーを立てるもの。Professional以上の有料プランのDev/Fullシートが必要です

本ハンズオンでは、無料プランでも進められる**Remoteサーバー**でセットアップします。Desktopサーバーの手順は最後にコラムで軽く触れます。

## 演習: アプリの用意とセットアップ

### 1. アプリのベースを作る

生成したコードを画面に出すための、React + Tailwind CSSのプロジェクトを作ります。設定を1つずつ手で書く代わりに、コマンドをまとめてClaude Codeに実行させます。

1. プロジェクトを置きたい場所（デスクトップなど）でターミナルを開き、`claude` でClaude Codeを起動する
2. 次のコマンドを貼り付けて、実行するよう頼む

   ```bash
   npx --yes create-vite@latest task-app --template react-ts --no-interactive --no-immediate
   cd task-app
   npm install
   npm install tailwindcss @tailwindcss/vite
   rm -rf src/assets src/App.css

   cat > vite.config.ts <<'EOF'
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   })
   EOF

   cat > src/index.css <<'EOF'
   @import "tailwindcss";
   EOF

   cat > src/App.tsx <<'EOF'
   export default function App() {
     return (
       <div className="min-h-screen bg-[#f5f5f5] p-8">
         <p className="text-sm text-[#6e6e76]">ここに4章・5章の画面を並べていきます</p>
       </div>
     )
   }
   EOF
   ```

3. `task-app` フォルダができたのを確認する

`rm -rf src/assets src/App.css` と `src/App.tsx` の書き換えは、テンプレートに付いてくるデモ用のロゴとCSSを消すためです。残しておくとTailwindの見た目と混ざります。

### 2. 開発サーバーを起動する

コードを書き換えるたびにブラウザが自動で更新される状態にします。ここからターミナルを2つ使います。

1. **ターミナルA**で `task-app` に移動し、`npm run dev` を実行する
2. 表示されたURL（`http://localhost:5173/`）をブラウザで開く
3. 薄いグレーの背景に「ここに4章・5章の画面を並べていきます」と出ているのを確認する

文字が小さいグレーで表示されていれば、Tailwindも効いています。このターミナルは起動したまま、閉じずに置いておきます。

### 3. プラグインを入れて再起動する

Figmaプラグインを入れると、Figma MCPサーバーへの接続設定と、デザインからコードを生成するためのSkill（Claude Codeの拡張機能）がClaude Codeに追加されます。

1. Claude Codeの入力欄に次のスラッシュコマンドを打つ。ターミナルのシェルではなく、Claude Codeの入力欄に打つ点に注意する

   ```text
   /plugin install figma@claude-plugins-official
   ```

2. インストール完了メッセージが出たら、Claude Codeを終了する
3. **ターミナルB**で `task-app` に移動し、`claude` で起動し直す

再起動が必要なのは、MCP接続がClaude Codeの起動時に初期化されるためです。インストールしただけでは接続されません。あわせて `task-app` の中で起動し直すことで、生成したファイルがこのプロジェクトに書かれるようになります。

### 4. ブラウザでFigmaを認証する

1. `/plugin` を打って管理パネルを開き、「Installed」タブの `figma` を選んでEnterを押す
2. ブラウザが開くので、Figmaにログインして「Allow access」を押す。許可するとブラウザは自動で閉じる
3. Claude Codeに戻り、もう一度 `/plugin` を打って `figma` に **connected** のバッジが付いていることを確認する

認証情報はローカルに保存されるので、この操作はマシンごとに一度だけです。接続状態は `/mcp` コマンドの一覧でも確認できます。

connectedになっていれば、`mcp__Figma__` で始まるツール群（`get_design_context`、`get_screenshot` など）がClaude Codeから呼べる状態です。

### 5. タスク一覧を読み取らせる

つながったかどうかは、Figmaのデザインを1つ読み取らせると分かります。

1. ブラウザまたはFigma Desktopで、4章で作ったタスク一覧のファイルを開く
2. `task-list` フレームを選び、右クリック → **Copy/Paste as** → **Copy link to selection**（またはメニューの「Share」→「Copy link」）でURLをコピーする
3. Claude Codeに戻り、次のプロンプトを投げる（URLはコピーしたものに差し替える）

   ```text
   このFigmaフレームの構造を教えて: <URL>
   ```

4. `task-list` の下に `header` や `content` があること、`brand` や `surface` などのトークン名が含まれていることを確認する

構造が返ってくれば、Figma MCPのセットアップは完了です。ここではまだコード生成はしません。6-2ではこの接続を使って、タスク一覧画面をコードに変換します。

## トラブルシューティング

うまくいかないときは、次を順に確認します。

- **`/plugin` を打っても figma が出てこない**: プラグインのインストールコマンドの後、Claude Codeを再起動しましたか。MCPは起動時にしか初期化されません
- **connected にならない**: ブラウザで「Allow access」を押した後、Claude Code側で数秒待ってから `/plugin` を打ち直します。それでも変わらなければ、ネットワーク（会社のプロキシなど）でAnthropic・Figmaへの接続が塞がれていないか確認します
- **フレームを読ませても中身が返ってこない**: 共有リンクが有効か、リンク先のファイルが自分のアカウントで閲覧できる状態かを確認します。プライベートなチームファイルは招待されていないと読めません

## 参考リンク

- [Figma Learn「Claude Code and Figma: Set up the MCP server」](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server)
- [Figma Developer Docs「Set up the remote server」](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- [Figma Learn「Guide to the Figma MCP server」](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [Claude Code Docs「Connect Claude Code to tools via MCP」](https://code.claude.com/docs/en/mcp)

::: tip Desktopサーバー（Dev Mode）を使いたい場合
Figma Professional以上のプランなら、Figma Desktopアプリから直接接続する方式も選べます。

1. Figma Desktopでデザインファイルを開き、下部ツールバーの **Dev Mode** に切り替える
2. 右サイドバーの **MCP server** セクションで「Enable desktop MCP server」をオンにする（メニュー → **Preferences** → **Enable Dev Mode MCP Server** でも可）。これで `http://127.0.0.1:3845/mcp` にローカルサーバーが立つ
3. Claude Code側で `claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp` を実行して登録する

Figma Desktopを起動しているあいだだけ有効です。以前は `/sse`（SSE）エンドポイントでしたが、現在は `/mcp`（Streamable HTTP）が正式版なので、古い記事の `--transport sse` を見ても真似しないでください。
:::

## ゴール確認

- [ ] `task-app` を作り、開発サーバーを起動してブラウザで表示できた
- [ ] Figmaプラグインを入れ、`task-app` の中でClaude Codeを起動し直せた
- [ ] ブラウザで認証し、`/plugin` の Installed タブで `figma: connected` を確認できた
- [ ] タスク一覧のフレームをClaude Codeに読み取らせ、構造が返ってくることを確認できた
