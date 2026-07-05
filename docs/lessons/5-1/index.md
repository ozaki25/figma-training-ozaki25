# 5-1 フォームのレイアウトを組む

ここからは2画面目、タスク登録フォームを作ります。4章のタスク一覧画面と同じサイドバー・同じヘッダー・同じスタイルでそろえます。

手順は4章と同じです。フレームで骨組みを作り、Auto LayoutとFill/Hugで並べ、4-3で登録した色スタイル・テキストスタイルをそのまま当てます。

このレッスンで作るのは画面の骨組みと、入力欄を入れる「器」（フォームカード）までです。入力欄やボタンそのものは5-2で作るので、いまは仮のプレースホルダーだけ置きます。

サイドバーとヘッダーは4章から**まるごとコピー**して使い回します。1から作り直しません。

## 完成イメージ

![タスク登録フォーム画面の骨組み。左は4章と同じsidebar、右のmainは4章と同じheaderと薄グレーのcontent。contentの中央に幅560の白いform-cardがあり、見出しと入力欄プレースホルダー5個、下部にボタンプレースホルダー2個が縦に並ぶ](/lessons/5-1/task-form-skeleton.png)

構造は4章のtask-listと同じ3階層です。違いはcontentの中身と整列だけです。

| レイヤー | 役割 | 仕様 |
| --- | --- | --- |
| `task-form` | 画面全体 | Desktop 1440×1024、横Auto Layout、gap 0 |
| ├ `sidebar` | 左ナビ | task-listからコピー。activeを `受信箱` に付け替え |
| └ `main` | 右カラム | 幅Fill・高さFill、縦Auto Layout、gap 0 |
| 　　├ `header` | 上部バー | task-listからコピー |
| 　　└ `content` | 中身 | 幅Fill・高さFill、縦Auto Layout、padding 48、gap 24、整列は上中央、背景 `bg` |
| 　　　　├ `form-header` | 見出しブロック | 縦Auto Layout、幅Fixed 560、gap 8 |
| 　　　　└ `form-card` | 入力欄の器 | 幅Fixed 560・縦Auto Layout、padding 32、gap 20、角丸16、背景 `surface`、枠線1px `border` |

## フォームカードを中央に置く

一覧画面ではcontentの中身を上から順に縦に積むだけでした。フォームでは、見出しと入力欄の器を画面の横中央に置きます。中央寄せは2つの設定の組み合わせでできます。

- `form-header` と `form-card` の幅を **Fixed 560** にして、広がらない状態を作る
- 親の `content`（縦Auto Layout）の整列を **上・中央** にする。整列ボックス（9マス）の上段中央を選ぶ

子の幅をFixedで止めて広がらないようにし、親の整列で中央に寄せます。Auto Layoutで横中央寄せをするときの基本パターンです。

## 作る順序

1. 画面フレーム `task-form` を作り、横Auto Layoutにする
2. task-listから `sidebar` をコピペで持ってきて、activeを `受信箱` に付け替える
3. `main` を作り、`header` もtask-listからコピーで入れる
4. contentを作り、整列を上中央にする
5. `form-header` と `form-card` をcontentに置く
6. form-cardの中に仮のプレースホルダーを並べる

## 演習

### 1. 画面フレームを作る

1. `F` でフレームツールから **Desktop（1440×1024）** を作る。task-listと同じデザインファイルの空いた場所でよい
2. `Shift + A` で**横**のAuto Layout、gap・パディングを 0 にし、名前を `task-form` にする

### 2. サイドバーとヘッダーをコピペする

1. task-listの `sidebar` を選択して `Cmd + C`（Windowsは `Ctrl + C`）でコピー、`task-form` の中にペーストして左に配置する
2. コピーした `sidebar` の中で、いま `今日` に当たっている `bg-active` の背景を、`受信箱` の nav-item に付け替える。`今日` の背景は `surface` か透明に戻し、バッジも消す
3. `task-form` の中に `main`（幅Fill・高さFill、縦Auto Layout、gap 0、padding 0）を作る
4. task-listの `header` を選択してコピー、`main` の中の一番上へペーストする

これでサイドバーとヘッダーはtask-listと完全に同じ状態になり、色・テキストスタイルもそのまま引き継がれます。

### 3. contentを作る

1. `main` の中の `header` の下に、`Shift + A` で空の縦Auto Layoutフレームを作る
2. 仕様どおりに設定する: 幅 **Fill**・高さ **Fill**、フロー縦、gap 24、パディング 48、背景 `bg`
3. 整列ボックス（9マス）で **上段の中央** を選ぶ
4. 名前を `content` にする

### 4. form-headerを置く

1. `content` の中に `Shift + A` で縦Auto Layoutフレームを作り、幅 **Fixed 560**、gap 8、パディング 0、名前を `form-header` にする
2. 中にテキスト `新しいタスクを追加`（24 Bold、`text/main`）と `必要な項目を入力して登録します`（14、`text/sub`）を縦に並べる
3. 見出しに `page-title` スタイルを当てる

### 5. form-cardを置く

1. `content` の中、`form-header` の下に `Shift + A` で縦Auto Layoutフレームを作る
2. 仕様どおりに設定する: 幅 **Fixed 560**・高さ **Hug**、フロー縦、gap 20、パディング 32、角丸 16、背景 `surface`、枠線1px `border`
3. 名前を `form-card` にする

幅を560で止めた瞬間、`content` の整列（上中央）に従って画面の横中央に収まります。

### 6. カードの中身をプレースホルダーで埋める

入力欄とボタンは5-2で作るので、いまは器の中に仮の要素を置いて骨組みを確かめます。

1. `form-card` の中に `R` で四角形を5個作る: 高さ 44、角丸 8、白、枠線1px `border`。幅を **Fill** にして、名前を `input-placeholder` にする
2. 5個のうち、5-2で横並び2列にする2つ分は、いまは縦に並べたままでよい（5-2で並べ替える）
3. カードの一番下に `Shift + A` で横Auto Layoutフレームを作る: gap 12、幅Fill、整列は右、名前 `button-row`
4. `button-row` の中に四角形を2つ作る: 高さ 44、角丸 8、幅Fixed 120。左は白+枠線、右は `brand` 塗り。名前は `button-placeholder-cancel` と `button-placeholder-submit`（四角形には余白やHugは設定できないので、ここは固定幅の仮ボタンにする。5-2で本物のButtonに置き換える）

カードの中で、5つの入力欄の枠とボタン行がgap 20で縦に並び、幅はカードいっぱいにそろうはずです。最後にサイドバーとヘッダーが4章と揃って見えるか、画面全体の高さを変えてもcontentだけが伸縮するかを確認します。

## ゴール確認

- [ ] task-listから `sidebar` と `header` をコピペで持ってきて、activeを `受信箱` に付け替えられた
- [ ] `content` を padding 48・整列上中央にし、`form-header` と `form-card` を幅Fixed 560で横中央に置けた
- [ ] form-cardの中に入力欄5個とボタン行のプレースホルダーを並べて骨組みを確認できた
