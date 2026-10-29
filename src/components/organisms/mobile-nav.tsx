'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { NAV } from '@/config/site';

/**
 * スマホ幅でのナビゲーション。ヘッダの横並びが 2 段に折り返さないよう、
 * md 未満ではメニューボタン + ドロワーに切り替える（開閉の状態があるため、この部品だけクライアント）。
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      <IconButton
        aria-label="打开菜单"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(true)}
        edge="end"
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box id="mobile-nav" component="nav" aria-label="主导航" sx={{ width: 240 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton aria-label="关闭菜单" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {[{ href: '/', label: '首页' }, ...NAV].map(item => (
              <ListItemButton
                key={item.href}
                href={item.href}
                selected={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                onClick={() => setOpen(false)}
                sx={{ py: 1.5 }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
