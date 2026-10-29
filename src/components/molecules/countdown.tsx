'use client';

import { useSyncExternalStore } from 'react';
import Box from '@mui/material/Box';
import { daysBetween, todayLocal } from '@/lib/format-date';

// 日数は閲覧した日によって変わるため、ビルド時ではなくブラウザで数える。
// サーバ描画では null を返し、ハイドレーション不一致を避ける。
const subscribe = () => () => {};

export function Countdown({ date }: { date: string }) {
  const days = useSyncExternalStore(
    subscribe,
    () => daysBetween(todayLocal(), date),
    () => null
  );

  if (days === null) return <span>—</span>;
  if (days === 0) return <span>就是今天！</span>;
  return (
    <span>
      还有{' '}
      <Box component="strong" sx={{ color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>
        {days}
      </Box>{' '}
      天
    </span>
  );
}
