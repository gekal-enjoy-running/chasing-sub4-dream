import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import Container from '@mui/material/Container';
import { SiteFooter } from '@/components/organisms/site-footer';
import { SiteHeader } from '@/components/organisms/site-header';
import { AppTheme } from '@/components/providers/app-theme';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | ${SITE.nameZh}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: SITE.locale, siteName: SITE.name, images: [SITE.ogImage] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        {/* 初回描画でスタイルが崩れないよう、AppRouterCacheProvider を最外周に置く */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AppTheme>
            <SiteHeader />
            <Container component="main" maxWidth="md" sx={{ py: 5, minHeight: '70vh' }}>
              {children}
            </Container>
            <SiteFooter />
          </AppTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
