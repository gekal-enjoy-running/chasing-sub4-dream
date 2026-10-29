import type { NextConfig } from 'next';

// 独自ドメイン（chasing-sub4-dream.gekal.cn）でルート配信するため、既定は空。
// プロジェクトページ（/<repo>/）で配信する場合だけ環境変数で渡す。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  // 静的ホストは /about → /about/index.html を引くため、末尾スラッシュに揃える
  trailingSlash: true,
  // 画像最適化はサーバが要る。静的書き出しでは使えない
  images: { unoptimized: true },
  basePath,
  experimental: {
    // 型検査は TS6 の JS API を使う（tsc は TS7 側にあり Next から見つからないため）
    useTypeScriptCli: false,
  },
};

export default nextConfig;
