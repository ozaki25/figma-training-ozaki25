# 6-1 Figma MCPサーバーをセットアップする

ここまで4章でタスク一覧、5章で登録フォームと、2画面のデザインを作ってきました。6章ではその2画面をFigma MCPとClaude Codeでコードに変換します。

このレッスンでは、Figma側のデザインとClaude Codeのあいだをつなぐ「Figma MCPサーバー」をセットアップし、接続確認まで済ませます。生成そのものは6-2と6-3で行うので、ここでは「つながっている状態を作る」ことに集中します。

## 前提

このレッスンは次の状態を前提にします。

- Claude Codeが手元のマシンにインストールされていて、ターミナルから `claude` コマンドで起動できる
- Figmaアカウントを持っていて、4章・5章で作ったデザインファイルにブラウザまたはFigma Desktopでアクセスできる
- ネットワークからFigmaとAnthropicに接続できる（社内プロキシで塞がれていないこと）

Figmaのプランについては、この後の「2つの方式」で説明します。

## Figma MCPの役割

Figma MCPは、Figmaのデザインファイルを構造化されたデータとしてClaude Codeに渡すためのサーバーです。ブラウザで見えている絵ではなく、フレームの入れ子構造・オートレイアウトの設定・スタイル・レイヤー名といった「Figmaが内部で持っている情報」がそのままClaude Codeに届きます。3-3や5-3でレイヤー名と構造を整えたのは、この受け渡しの品質を上げるためでした。

![Figma MCP接続の概念図。左のFigma（クラウド）から、中央のFigma MCPサーバー（Anthropic公式プラグイン経由）を通って、右のClaude Codeへ矢印が伸びる。Claude CodeはFigmaのデザイン情報を構造化データとして受け取り、コードを生成する](/lessons/6-1/mcp-connection.svg)

## 2つの方式

2026年7月時点で、Figma MCPには次の2つの提供形態があります。

- **Remoteサーバー（推奨）**: Anthropic公式のClaude CodeプラグインとしてFigmaが用意しているもの。Figma Desktopアプリは不要で、ブラウザでOAuth認証するだけで使えます。全プラン・全シートで使えます
- **Desktopサーバー（Dev Mode）**: Figma DesktopアプリでDev Modeを有効にしてローカルにMCPサーバーを立てるもの。Professional以上の有料プランのDev/Fullシートが必要です

本ハンズオンでは、無料プランでも進められる**Remoteサーバー**でセットアップします。Desktopサーバーの手順は最後にコラムで軽く触れます。

::: warning プランによる制限
Figma無料（Starter）プランでは、Remoteサーバーは使えるものの月あたり6ツールコールという制限があります。6-2と6-3で各画面を生成すると数コールを使うため、余裕はありません。Professional以上のプランで進めるのが理想ですが、無料プランでも1画面ぶんの体験はできます。
:::

## セットアップ手順

3ステップです。順番に進めます。

### 1. Figmaプラグインを入れる

ターミナルでClaude Codeを起動した状態で、次のスラッシュコマンドを打ちます。

```bash
/plugin install figma@claude-plugins-official
```

これはAnthropic公式のプラグインマーケットプレイスからFigmaプラグインを取ってきて、Claude Codeに組み込むコマンドです。プラグインの中身は、Figma MCPサーバーの接続設定と、デザインからコードを生成するためのSkill（Claude Codeの拡張機能）です。

インストールが終わったら、Claude Codeをいったん終了して起動し直します。MCP接続はClaude Codeの起動時に初期化されるため、インストールしただけでは接続されません。

### 2. Figmaアカウントで認証する

再起動したら、次のコマンドで管理パネルを開きます。

```bash
/plugin
```

「Installed」タブに `figma` が並んでいます。選択してEnterを押すとブラウザが開き、Figmaのログインと「Allow access」の確認画面が出ます。許可するとブラウザは自動で閉じます。認証情報はローカルに保存されるので、この操作はマシンごとに一度だけです。

### 3. 接続を確認する

もう一度 `/plugin` を打って、Installedタブの `figma` に **connected** のバッジが付いていることを確認します。`/mcp` コマンドでも接続中のMCPサーバー一覧を見られるので、そちらで確認してもかまいません。

connectedになっていれば、この時点で `mcp__Figma__` で始まるツール群（`get_design_context`、`get_screenshot` など）がClaude Codeから呼べる状態になっています。

## 動作確認

「つながっている」だけでは実感がわかないので、Figmaのデザインを1つ読み取らせてみます。

1. ブラウザまたはFigma Desktopで、4章で作ったタスク一覧のファイルを開く
2. `task-list` フレームを選び、右クリック → **Copy/Paste as** → **Copy link to selection**（またはメニューの「Share」→「Copy link」）でURLをコピーする
3. Claude Codeに戻り、次のように投げる

```text
このFigmaのフレームの中身を教えて: <コピーしたURL>
```

Claude Codeが `mcp__Figma__get_design_context` などを呼び、フレーム名（`task-list`）、子要素の `header` や `content`、トークン名の `brand` や `surface` といった情報を返してくれば成功です。まだコード生成はしません。「Figmaの中身がClaude Codeに見えている」ことだけを確認します。

## トラブルシューティング

うまくいかないときは、次の3つを疑います。

- **`/plugin` を打っても figma が出てこない**: プラグインのインストールコマンドの後、Claude Codeを再起動しましたか。MCPは起動時にしか初期化されません
- **connected にならない**: ブラウザで「Allow access」を押した後、Claude Code側で数秒待ってから `/plugin` を打ち直します。それでも変わらなければ、ネットワーク（会社のプロキシなど）でAnthropic・Figmaへの接続が塞がれていないか確認します
- **フレームを読ませても中身が返ってこない**: 共有リンクが有効か、リンク先のファイルが自分のアカウントで閲覧できる状態かを確認します。プライベートなチームファイルは招待されていないと読めません

## 演習: セットアップと接続確認

### 1. プラグインを入れて再起動する

1. Claude Codeを起動した状態で `/plugin install figma@claude-plugins-official` を実行する
2. インストール完了メッセージを確認したら、Claude Codeを一度終了して起動し直す

### 2. ブラウザでFigmaを認証する

1. `/plugin` を打ち、Installedタブの `figma` を選んでEnterを押す
2. 開いたブラウザでFigmaにログインし、「Allow access」を押す
3. Claude Codeに戻り、再度 `/plugin` で `figma: connected` になっていることを確認する

### 3. タスク一覧を読み取らせる

1. 4章で作った `task-list` フレームの共有リンクをコピーする
2. Claude Codeに次のプロンプトを投げる（URLはコピーしたものに差し替える）

```text
このFigmaフレームの構造を教えて: <URL>
```

3. `task-list` の下に `header` や `content` があること、`brand` や `surface` などのトークン名が含まれていることを確認する

構造が返ってくれば、Figma MCPのセットアップは完了です。6-2ではこの接続を使って、タスク一覧画面をコードに変換します。

## 参考リンク

- [Figma Learn「Claude Code and Figma: Set up the MCP server」](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server)
- [Figma Developer Docs「Set up the remote server」](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- [Figma Learn「Guide to the Figma MCP server」](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [Claude Code Docs「Connect Claude Code to tools via MCP」](https://code.claude.com/docs/en/mcp)

::: tip Desktopサーバー（Dev Mode）を使いたい場合
Figma Professional以上のプランで、Figma Desktopアプリから直接接続したい場合は、次の手順になります。Figma Desktopでデザインファイルを開き、下部ツールバーの **Dev Mode** に切り替えます。右サイドバーの **MCP server** セクションで「Enable desktop MCP server」をオンにします（メニュー → **Preferences** → **Enable Dev Mode MCP Server** でも可）。これで `http://127.0.0.1:3845/mcp` にローカルサーバーが立ちます。Claude Code側では `claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp` で登録します。Figma Desktopを起動しているあいだだけ有効です。以前は `/sse`（SSE）エンドポイントでしたが、現在は `/mcp`（Streamable HTTP）が正式版なので、古い記事の `--transport sse` を見ても真似しないでください。
:::

## ゴール確認

- [ ] `/plugin install figma@claude-plugins-official` でFigmaプラグインを入れ、Claude Codeを再起動できた
- [ ] ブラウザで認証し、`/plugin` の Installed タブで `figma: connected` を確認できた
- [ ] タスク一覧のフレームをClaude Codeに読み取らせ、構造が返ってくることを確認できた
