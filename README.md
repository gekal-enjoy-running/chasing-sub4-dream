# Chasing Sub-4 Dream（全马破四追梦者）

フルマラソン 4 時間切り（サブ4 / 破四）を目指す市民ランナーの記録サイト。
大会記録・練習日誌・ペース表・トレーニング指南を、Next.js の静的書き出しで配信する。
企画の背景とページ構成は [docs/proposal.md](docs/proposal.md)（中国語）を参照。

- 公開 URL: https://chasing-sub4-dream.gekal.cn

## 前提条件

- Node.js 24（LTS）

## セットアップ

```bash
npm ci
npm run dev          # http://localhost:3000
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバ（Turbopack） |
| `npm run typecheck` | 型チェック（TypeScript 7） |
| `npm run lint` | ESLint + Prettier |
| `npm test` | `src/lib/` の単体テスト（node:test） |
| `npm run build` | `out/` へ静的書き出し |
| `npm run preview` | `out/` をローカル配信。**公開前に必ず確認する** |

## コンテンツの追加方法

本文はすべて `content/` の Markdown。追加して main へ push すれば公開される。

### 練習日誌 `content/posts/YYYY-MM-DD-<slug>.md`

```markdown
---
title: 30km 马拉松配速跑
date: 2026-09-14
summary: 一覧と description に使う 1〜2 文。
tags: [长距离, 马拉松配速]
draft: false        # true にすると本番ビルドで除外（開発では表示）
---

本文
```

URL は `/journal/<slug>/`（ファイル名の日付は除く）。

### 大会記録 `content/races/YYYY-MM-DD-<slug>.md`

```markdown
---
title: 秋季马拉松
date: 2025-11-23
city: 东京
distance: full      # full / half / 10k / other
result: '4:05:21'   # H:MM:SS。未出走の大会は省略（トップの「次の大会」に出る）
summary: 一覧と description に使う 1〜2 文。
---
```

フルマラソンの自己ベスト・目標との差・記録推移グラフは `result` から自動で計算される。

### 训练指南 `content/guides/<slug>.md`

```markdown
---
title: 跑前热身
summary: 一覧と description に使う 1〜2 文。
duration: 10〜15 分钟
order: 1            # 一覧の並び順
---
```

### 固定ページ

`content/pages/about.md`（关于）と `content/pages/plan.md`（训练计划）。

> 現在の大会記録・日誌・自己紹介はサンプルデータ。実際の内容に置き換えること。

## 公開

main へ push すると GitHub Actions（`.github/workflows/ci.yml`）が検証 → 書き出し → GitHub Pages 配信を行う。

初回だけ必要な設定:

1. DNS に CNAME `chasing-sub4-dream.gekal.cn` → `gekal-enjoy-running.github.io` を追加
2. リポジトリの Settings → Pages → Source を **GitHub Actions** にし、Custom domain に上記ドメインを設定して HTTPS を有効化
3. 独自ドメインのルートで配信するため `basePath` は空（`public/CNAME` でドメインを指定）

## ディレクトリ構成

| パス | 内容 |
| --- | --- |
| `content/posts/` | 練習日誌 |
| `content/races/` | 大会記録・レースレポート |
| `content/guides/` | 训练指南（热身・拉伸・力量・技术・恢复） |
| `content/pages/` | 固定ページ（about / plan） |
| `src/app/` | ルーティング（`/` `/races/` `/journal/` `/guides/` `/pace/` `/plan/` `/about/`、sitemap / robots） |
| `src/components/` | Atomic Design（atoms / molecules / organisms）と MUI テーマ（providers） |
| `src/lib/` | Markdown 読み込み（`content.ts`）、タイム換算、大会集計、日付整形とテスト |
| `src/config/site.ts` | サイト名・URL・目標タイム・ナビゲーションの唯一の定義 |
| `public/` | CNAME、OG 画像 |
| `docs/proposal.md` | サイト企画書 |

## 技術スタック

Next.js 16（App Router / `output: 'export'`）、React 19、MUI v9 + Emotion、
gray-matter + remark、TypeScript 7（型検査）/ 6（ESLint 用）、node:test。
