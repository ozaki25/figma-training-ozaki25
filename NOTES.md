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
