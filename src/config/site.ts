/**
 * サイト全体の定義。
 *
 * メタデータ、sitemap、OGP、フッターで同じ値を使うため、名称やURLを各ファイルへ直接書かない。
 * ブラウザへ配信される設定なので、秘密情報は置かないこと。
 */
export const SITE = {
  name: 'Chasing Sub-4 Dream',
  nameZh: '全马破四追梦者',
  description: '冲击全程马拉松 4 小时以内的比赛记录，以及破四需要的能力、配速与训练方法。',
  /** 本番の公開URL。末尾スラッシュなし。metadataBase と sitemap が使う */
  url: 'https://chasing-sub4-dream.gekal.cn',
  locale: 'zh_CN',
  author: 'gekal',
  ogImage: '/og/default.png',
  /** フッターに出す口号 */
  slogan: '每一步，都离破四更近一点。',
  /** 目標タイム（秒）。3:59:59 ではなく 4:00:00 未満を「破四」とする */
  goalSeconds: 4 * 3600,
} as const;

/** ヘッダ・フッタのナビゲーション。順序がそのまま表示順になる */
export const NAV = [
  { href: '/races/', label: '比赛' },
  { href: '/guides/', label: '指南' },
  { href: '/exercises/', label: '动作' },
  { href: '/pace/', label: '配速' },
  { href: '/plan/', label: '计划' },
  { href: '/about/', label: '关于' },
] as const;
