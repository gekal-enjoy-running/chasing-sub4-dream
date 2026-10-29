import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import { NAV, SITE } from '@/config/site';

export function SiteHeader() {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
          <Link href="/" underline="none" color="inherit" sx={{ fontWeight: 700, mr: 'auto' }}>
            <Box component="span" sx={{ color: 'primary.main' }}>
              Sub-4
            </Box>{' '}
            Dream
            <Box
              component="span"
              sx={{ ml: 1, fontWeight: 400, fontSize: '0.875rem', color: 'text.secondary' }}
            >
              {SITE.nameZh}
            </Box>
          </Link>
          <Box component="nav" aria-label="主导航" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {NAV.map(item => (
              <Button key={item.href} href={item.href} color="inherit" size="small">
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
