#!/usr/bin/env node
// サイトテーマ配色のWCAGコントラスト比検証スクリプト
// 使い方: node scripts/check-contrast.mjs

function luminance(hex) {
  const n = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (l1 + 0.05) / (l2 + 0.05)
}

const checks = [
  // [説明, 前景, 背景, 必要比]
  ['light: brand-1 (リンク/テキスト) on 白背景', '#6D28D9', '#ffffff', 4.5],
  ['light: brand-2 (hover) on 白背景', '#5B21B6', '#ffffff', 4.5],
  ['light: ボタン文字(白) on brand-3 (ボタン背景 #7C3AED)', '#ffffff', '#7C3AED', 4.5],
  ['light: ボタン文字(白) on hover背景 #6D28D9', '#ffffff', '#6D28D9', 4.5],
  ['dark: brand-1 (リンク/テキスト) on 背景 #1b1b1f', '#C4A5FF', '#1b1b1f', 4.5],
  ['dark: brand-2 (hover) on 背景 #1b1b1f', '#D4BEFF', '#1b1b1f', 4.5],
  ['dark: ボタン文字(白) on brand-3 (ボタン背景 #7C3AED)', '#ffffff', '#7C3AED', 4.5],
]

let ok = true
for (const [label, fg, bg, need] of checks) {
  const r = ratio(fg, bg)
  const pass = r >= need
  ok &&= pass
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1 (必要 ${need}:1)  ${label}`)
}
process.exit(ok ? 0 : 1)
