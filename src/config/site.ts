/**
 * サイト全体の定義。
 *
 * メタデータ、sitemap、OGP、フッターで同じ値を使うため、名称やURLを各ファイルへ直接書かない。
 * ブラウザへ配信される設定なので、秘密情報は置かないこと。
 */
export const SITE = {
  name: 'Chasing Sub-4 Dream',
  nameZh: '全马破四追梦者',
  description: '一名业余跑者冲击全程马拉松 4 小时以内的训练、比赛与配速记录。',
  /** 本番の公開URL。末尾スラッシュなし。metadataBase と sitemap が使う */
  url: 'https://chasing-sub4-dream.gekal.cn',
  locale: 'zh_CN',
  author: 'gekal',
  ogImage: '/og/default.png',
  github: 'https://github.com/gekal-enjoy-running/chasing-sub4-dream',
  /** 目標タイム（秒）。3:59:59 ではなく 4:00:00 未満を「破四」とする */
  goalSeconds: 4 * 3600,
} as const;

/** ヘッダ・フッタのナビゲーション。順序がそのまま表示順になる */
export const NAV = [
  { href: '/races/', label: '比赛' },
  { href: '/journal/', label: '日志' },
  { href: '/guides/', label: '指南' },
  { href: '/pace/', label: '配速' },
  { href: '/plan/', label: '计划' },
  { href: '/about/', label: '关于' },
] as const;
