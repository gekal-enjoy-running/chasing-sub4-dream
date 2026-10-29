import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SITE } from '@/config/site';

export function SiteFooter() {
  return (
    <Box component="footer" sx={{ mt: 10, borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="md">
        <Stack direction="row" sx={{ py: 3, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {SITE.author} · {SITE.name}
          </Typography>
          <Link href={SITE.github} variant="body2" color="text.secondary" underline="hover">
            GitHub
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
