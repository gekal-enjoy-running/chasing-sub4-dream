'use client';

import NextLink from 'next/link';
import { forwardRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

/**
 * MUI の Link / Button / CardActionArea の href を next/link で解決させる。
 * テーマ側で差し込むことで、Server Component から <Button href="/races/"> と書くだけで
 * クライアント遷移になる（関数を props で Server → Client へ渡せないため、ここで束ねる）。
 */
const LinkBehavior = forwardRef<HTMLAnchorElement, React.ComponentProps<typeof NextLink>>(
  function LinkBehavior(props, ref) {
    return <NextLink ref={ref} {...props} />;
  }
);

const theme = createTheme({
  // CSS 変数で配色を切り替える。OS のダークモード設定に追従し、初回描画のちらつきも出ない
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#c2410c' },
        success: { main: '#15803d' },
        background: { default: '#fafaf9', paper: '#ffffff' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#fb923c' },
        success: { main: '#4ade80' },
        background: { default: '#0c0a09', paper: '#1c1917' },
      },
    },
  },
  typography: {
    fontFamily:
      "'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif",
    h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.3 },
    h2: { fontSize: '1.375rem', fontWeight: 700 },
    h3: { fontSize: '1.125rem', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiLink: { defaultProps: { component: LinkBehavior } },
    MuiButtonBase: { defaultProps: { LinkComponent: LinkBehavior } },
    MuiCard: { defaultProps: { variant: 'outlined' } },
  },
});

export function AppTheme({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
