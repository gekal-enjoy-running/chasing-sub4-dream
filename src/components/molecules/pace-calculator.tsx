'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  evenSplits,
  formatDuration,
  formatPace,
  HALF_KM,
  MARATHON_KM,
  paceFromTime,
  parseDuration,
} from '@/lib/time';

/** 目標タイムを入れると、ペースと通過タイムを返す計算機 */
export function PaceCalculator() {
  const [input, setInput] = useState('3:55:00');
  const seconds = parseDuration(input);
  const invalid = seconds === null || seconds === 0;

  return (
    <Card>
      <CardContent>
        <TextField
          id="target"
          label="目标完赛时间（H:MM:SS）"
          value={input}
          onChange={e => setInput(e.target.value)}
          error={invalid}
          helperText={invalid ? '请输入例如 3:59:00 的格式。' : ' '}
          fullWidth
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
        />
        {!invalid && (
          <>
            <Typography sx={{ mt: 1 }}>
              平均配速{' '}
              <Box
                component="strong"
                sx={{
                  fontSize: '1.75rem',
                  color: 'primary.main',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatPace(paceFromTime(seconds))}
              </Box>{' '}
              / km
            </Typography>
            <Box
              component="dl"
              sx={{
                mt: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' },
                columnGap: 3,
                rowGap: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {evenSplits(seconds).map(s => (
                <Box key={s.km} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box component="dt" sx={{ color: 'text.secondary' }}>
                    {s.km === MARATHON_KM ? '终点' : s.km === HALF_KM ? '半程' : `${s.km}km`}
                  </Box>
                  <Box component="dd" sx={{ m: 0 }}>
                    {formatDuration(s.elapsed)}
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
