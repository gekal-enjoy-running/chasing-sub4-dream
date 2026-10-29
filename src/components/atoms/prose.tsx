import Box from '@mui/material/Box';

/**
 * Markdown から生成した HTML の本文。
 * 素の HTML 要素にテーマの色・余白を当てる（sx はオブジェクトのみ。Server Component から渡すため）。
 */
export function Prose({ html }: { html: string }) {
  return (
    <Box
      sx={{
        lineHeight: 1.9,
        '& > * + *': { mt: 2 },
        '& h2': { mt: 5, mb: 1, fontSize: '1.375rem', fontWeight: 700 },
        '& h3': { mt: 3, mb: 1, fontSize: '1.125rem', fontWeight: 700 },
        '& a': { color: 'primary.main' },
        '& ul, & ol': { pl: 3 },
        '& li': { my: 0.5 },
        '& strong': { color: 'primary.main' },
        '& blockquote': {
          m: 0,
          pl: 2,
          borderLeft: 4,
          borderColor: 'divider',
          color: 'text.secondary',
        },
        '& table': {
          display: 'block',
          overflowX: 'auto',
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
          fontVariantNumeric: 'tabular-nums',
        },
        '& th, & td': {
          px: 1.5,
          py: 1,
          textAlign: 'left',
          borderBottom: 1,
          borderColor: 'divider',
          whiteSpace: 'nowrap',
        },
        '& th': { borderBottomWidth: 2 },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
