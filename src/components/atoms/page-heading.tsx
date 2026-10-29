import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/** 各ページ先頭の h1 と説明文 */
export function PageHeading({ title, lead }: { title: string; lead?: string }) {
  return (
    <Box component="header" sx={{ mb: 5 }}>
      <Typography variant="h1">{title}</Typography>
      {lead && (
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          {lead}
        </Typography>
      )}
    </Box>
  );
}
