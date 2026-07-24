# 5-2 入力欄・ボタンを作る

フォームの本物の部品、TextFieldとButtonをコンポーネント化して、5-1で置いた仮のプレースホルダーと差し替えます。Buttonの `variant=primary/secondary` は、4章の `priority`・`active`・`done` と同じバリアントの作り方です。

進め方は5-1と同じです。まず仕様だけを見て自力で作り、詰まったら下部の折りたたみの手順を開いてください。

## 完成イメージ

![TextFieldとButtonの構造とform-cardの完成イメージ。TextFieldはラベルと入力欄の縦積み。Buttonはprimaryとsecondaryの2バリアント。form-cardには5つのTextFieldと右下の2ボタンが並ぶ](/lessons/5-2/task-form-components.png)

## 仕様

```
TextField
├─ label
└─ input

Button
└─ label
```

| 部品 | 仕様 |
| --- | --- |
| `TextField` | 縦オートレイアウト、間隔 `space/8`、幅は固定320（フォームに置くインスタンスは拡大にする） |
| `label` | `caption` + `text/sub` |
| `input` | 横オートレイアウト、高さ44、パディング `space/12`、配置は左中央、角丸 `radius/8`、背景 `surface`、枠線1px `border`。中の例文テキストは `body` + `text/sub` |
| `Button` | 高さ44、左右パディング `space/20`、配置は中央、角丸 `radius/8`、幅は内包。`variant=primary/secondary` の2バリアント |
| `label`（Button内） | `button-label` |

| バリアント | 背景 | 文字 | 枠線 |
| --- | --- | --- | --- |
| `primary` | `brand` | `text/inverse` | なし |
| `secondary` | `surface` | `brand` | `brand` 1px |

フォームへの置き換えはこうします。

- `input-placeholder` 5個を消し、TextFieldインスタンス5個（幅は拡大）に置き換える。ラベルは上から `タスク名 *`・`説明`・`期限`・`優先度`・`カテゴリ`
- `説明` だけ、中の `input` の高さを**固定96**に上書きして縦長にする
- `期限` と `優先度` は `field-row`（横オートレイアウト、間隔 `space/12`、幅は拡大）にまとめて2列にする
- `優先度` の例文テキストは `選択する ▼` に書き換えて、プルダウンらしく見せる
- 仮ボタン2個を消し、左に `secondary` の `キャンセル`、右に `primary` の `タスクを登録` を置く

::: details 手順を開く

テキストはどれも、`t` を押したら**キャンバスをクリックしてから**入力してください。

### 1. TextFieldを作る

1. `task-form` フレームの外の空いた場所に、`t` でテキスト `タスク名`（`caption` + `text/sub`）を作る
2. 入力ボックスを作る。四角形ではなくオートレイアウトフレームで作るのは、中に文字を入れられるようにするため
   1. `t` でテキスト `例: 会議資料の作成`（`body` + `text/sub`）を作り、`Shift + A` で包む
      - パディング `space/12`、配置は左中央
      - 角丸 `radius/8`、背景 `surface`、枠線1px `border`
      - 高さは**固定44**
   2. 名前を `input` にする。幅はまだ触らない（この時点では親がオートレイアウトではないので拡大を選べない）
3. `タスク名` のテキストと `input` の2つを選択して `Shift + A` で縦に包む
4. 間隔 `space/8`、パディング 0、幅は**固定320**にする
5. 中の `input` の幅を**拡大**にする。2-3でやった「外側から順に拡大」と同じ理屈で、こうしておくと後でインスタンスの幅を変えたとき入力欄も一緒に伸びる
6. `Cmd + Option + K`（Windowsは `Ctrl + Alt + K`）でコンポーネント化する
7. コンポーネントの名前を `TextField`、中の部品を `label` と `input` にする

### 2. Buttonを作って2バリアントにする

1. TextFieldを作ったのと同じ場所に、`t` でテキスト `タスクを登録`（`button-label` + `text/inverse`）を作り、`Shift + A` で包む
   - 左右パディング `space/20`、配置は中央
   - 角丸 `radius/8`、背景 `brand`
   - 高さは**固定44**、幅は**内包**
2. `Cmd + Option + K` でコンポーネント化して、名前を `Button` にする
3. 中のテキストの名前を `label` にする
4. 右サイドバー上部の「バリアントの追加」アイコンをクリックする
5. 「現在のバリアント」で `プロパティ1` を `variant` に、1枚目の値を `primary`、2枚目を `secondary` にする。値を変えるときは、変えたいボタン自身を選び直してから書き換える
6. `secondary` の方を、背景 `surface`、枠線1px `brand`、`label` の色を `brand` にする

レイヤーパネルで `Button` の下に `variant=primary` と `variant=secondary` が並んでいれば完成です。

### 3. form-cardのプレースホルダーを置き換える

1. form-cardの中の `input-placeholder` 5個を選択して `Delete` で消す
2. アセットパネルから `TextField` をform-cardの中へ入れ、幅を**拡大**にして、`Cmd + D` で5個にする
3. 各インスタンスの `label` を書き換える: 上から `タスク名 *`・`説明`・`期限`・`優先度`・`カテゴリ`

### 4. 説明の高さと、期限・優先度の2列

1. `説明` のインスタンスの中の `input` を選び、高さを**固定96**に上書きする。説明欄だけが縦長になる
2. `期限` と `優先度` のインスタンス2つを選択して `Shift + A` で横に包み、名前を `field-row` にする
3. `field-row` を間隔 `space/12`、パディング 0、幅は**拡大**にする
4. 中の2つのTextFieldの幅をそれぞれ**拡大**にする
5. `優先度` の例文テキストを `選択する ▼` に書き換えて、プルダウンらしく見せる（インスタンスには要素を追加できないので、テキストの書き換えで表現する）

### 5. ボタン行を仕上げる

1. `button-row` の中の `button-placeholder-cancel` と `button-placeholder-submit` を消す
2. アセットパネルから `Button` を2つ、`button-row` の中へ入れる
3. 左のButtonの `variant` ドロップダウンを `secondary` に切り替え、`label` を `キャンセル` に書き換える
4. 右のButtonは `primary` のまま、`label` を `タスクを登録` にする

最後に、原本のTextFieldの角丸を `radius/12` に変えてみて、5つのインスタンスがまとめて追従することを確認したら、`radius/8` に戻します。

:::

## ゴール確認

- [ ] `TextField` と `Button`（2バリアント）をトークンとスタイルだけでコンポーネント化できた
- [ ] 説明の高さ上書きと、期限・優先度の2列ネストができた
- [ ] `button-row` に secondary「キャンセル」と primary「タスクを登録」を右寄せで並べられた
