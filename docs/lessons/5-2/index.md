# 5-2 入力欄・ボタンを作る

5-1で置いた仮のプレースホルダーを、本物の入力欄とボタンに入れ替えます。コンポーネント化してからインスタンスをフォームに並べる、4-2と同じ流れです。

今回はボタンに**バリアントを2つ**用意します。3-2で練習したバリアントを、キャンセルと登録の2つのボタンで初めて本番のデザインに使います。primaryもsecondaryもフォームの中で実際に働きます。

このレッスンでも操作は逐一書きません。仕様を示すので、既習の操作（`Shift + A`、Hug/Fill、コンポーネント化、Assetsパネル、Add variant）で組み立ててください。

## 完成イメージ

<!-- 画像は個人情報漏洩対策で一時削除、再キャプチャ後に復活予定 -->
<!-- ![TextFieldとButtonの構造とform-cardの完成イメージ。TextFieldはラベルと入力欄の縦積み。Buttonはprimaryとsecondaryの2バリアント。form-cardには5つのTextFieldと右下の2ボタンが並ぶ](/lessons/5-2/task-form-components.png) -->

作るのはTextFieldとButtonの2つです。

| 部品 | 役割 | 仕様 |
| --- | --- | --- |
| `TextField` | ラベル付き入力欄 | 縦Auto Layout、gap 8、幅Hug（親でFillにする） |
| └ `label` | ラベルテキスト | 12px、色スタイル `text/sub` |
| └ `input` | 入力ボックス | 高さ44、padding 12、角丸8、背景 `surface`、枠線1px `border`、テキスト14px |
| `Button` | ボタン | 高さ44、padding 20/16、角丸8、幅Hug |
| └ `label` | ボタンラベル | 14px SemiBold |

Buttonのバリアントは、プロパティ名 `variant`、値 `primary` と `secondary` の2つです。

| バリアント | 背景 | 文字 | 枠線 |
| --- | --- | --- | --- |
| `primary` | `brand`（紫） | 白 | なし |
| `secondary` | `surface`（白） | `brand` | `brand` 1px |

form-cardのボタン行には、左に `secondary` の「キャンセル」、右に `primary` の「タスクを登録」を並べます。2つのバリアントが両方フォームで使われるので、3-2のバリアント練習が完成物に反映されます。

## フォームの入力欄5個

5-1でプレースホルダーを5個置きました。ラベルと配置は次のとおりです。

| # | ラベル | 特記 |
| --- | --- | --- |
| 1 | タスク名 | 必須。ラベルの右に `*` を付ける |
| 2 | 説明 | 複数行。inputの高さを 96 に上書き |
| 3 | 期限 | 横並び2列の左 |
| 4 | 優先度 | 横並び2列の右。inputの右端に `▼` を添える |
| 5 | カテゴリ | 通常 |

3と4は横Auto Layoutのフレーム（gap 12、幅Fill）にネストします。

## 作る順序

外側から中身を作った5-1・4-2とは順序が違います。今回は部品を先に作り、あとでフォームに差し込みます。

1. 画面フレームの外の空いた場所で `TextField` を組み、コンポーネント化する
2. 同じ場所で `Button`（primary）を組み、コンポーネント化してから `secondary` バリアントを追加する
3. 5-1のform-cardに戻り、プレースホルダーを削除してインスタンスに置き換える
4. 「説明」の高さ上書きと、「期限」「優先度」の横並び2列を組む

原本は画面フレームの外に置き、画面にはインスタンスだけを並べます。

## 演習

### 1. TextFieldを作る

1. `task-form` フレームの外の空いた場所で、テキスト `タスク名`（12px、`text/sub`）と、`R` で四角形（幅Fixed 320、高さ44、角丸8、背景 `surface`、枠線1px `border`）を用意する
2. 四角形の中にプレースホルダー用のテキスト `例: 会議資料の作成`（14px、`text/sub`）を置いてもよい
3. ラベルと入力ボックスを選択して `Shift + A` で縦Auto Layout。gap 8、パディング 0
4. `Cmd + Option + K`（Windowsは `Ctrl + Alt + K`）でコンポーネント化する
5. `Cmd + R` で名前を付ける: コンポーネントは `TextField`、中の部品は `label` と `input`

### 2. Buttonを作って2バリアントにする

1. 同じ場所でテキスト `タスクを登録`（14px、SemiBold、白）を作り、`Shift + A` でAuto Layoutにする
2. 仕様どおりに設定する: 高さ44、padding 20/16、角丸8、背景 `brand`、幅Fixed 200
3. `Cmd + Option + K` でコンポーネント化する
4. 名前を付ける: コンポーネントは `Button`、中のテキストは `label`
5. コンポーネントを選択して、右サイドバーの **Add variant** をクリックする。同じ見た目の2枚目が紫の破線枠のコンポーネントセットに入る
6. 右サイドバーの Current variant でプロパティ名を `variant`、1枚目の値を `primary`、2枚目の値を `secondary` に変える
7. `secondary` の方の背景を `surface`、枠線1px `brand`、テキスト色を `brand` に変える

`primary` と `secondary` の2バリアントが並んだコンポーネントセットができました。

### 3. form-cardのプレースホルダーをインスタンスに置き換える

5-1で作った `form-card` に戻ります。

1. カード内の `input-placeholder` 5個を選択して `Delete` で消す
2. Assetsパネルから `TextField` を form-card の中へドラッグして5個並べる
3. 5つのインスタンスの幅をそれぞれ **Fill** にする
4. 各インスタンスの `label` をダブルクリックして書き換える: `タスク名 *`、`説明`、`期限`、`優先度`、`カテゴリ`

### 4. 「説明」の高さと「期限・優先度」の横並び

1. 2番目の `説明` のインスタンスを開き、中の `input` の高さを Fixed **96** に上書きする。これで説明欄だけが縦長になる
2. 3番目の `期限` と4番目の `優先度` のインスタンス2つを選択して `Shift + A` で横Auto Layoutにまとめる。gap 12、パディング 0、幅Fill、名前を `field-row` にする
3. 中の2つのTextFieldインスタンスは、それぞれ幅Fillにする
4. 4番目の `優先度` の `input` の中に、テキスト `▼`（12px、`text/sub`）を右端に添える。既存のプレースホルダーテキストの後ろに追加してもよいし、input内のAuto Layoutを横並びにして分けてもよい

これで説明が縦長、期限と優先度が横並び2列、他は縦積み、という並びになります。

### 5. ボタン行を仕上げる

1. 5-1で置いた `button-row` の中の `button-placeholder-cancel` と `button-placeholder-submit` を消す
2. Assetsパネルから `Button` を2つドラッグする
3. 左のButtonのvariantを `secondary` に切り替え、`label` を `キャンセル` に書き換える
4. 右のButtonはvariantが `primary` のまま、`label` を `タスクを登録` にする
5. `button-row` は幅Fill、gap 12、整列を **右** にする。2つのボタンはそれぞれ幅Hug

最後に、原本のTextFieldの角丸を12に変えてみて、5つのインスタンスがまとめて追従することを確認したら、8に戻します。

## ゴール確認

- [ ] `TextField` と `Button` をコンポーネント化し、Buttonは `variant` プロパティで `primary` / `secondary` の2バリアントを持たせられた
- [ ] 「説明」だけinputの高さを96に上書きし、「期限」「優先度」を横並び2列にネストできた
- [ ] `button-row` に secondary「キャンセル」と primary「タスクを登録」を右寄せで並べられた
