import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { PaceZone } from '@/lib/training';

type Props = {
  target: PaceZone[];
  current?: PaceZone[];
  currentLabel?: string;
};

/**
 * 配速区间。破四目標と、現在の自己ベストから換算した値を並べる。
 * current が無い（全马の記録が無い）ときはその列を出さない。
 * 5 列の表はスマホでは区间名が 1〜2 文字ずつ折り返すため、sm 未満はカードの縦並びにする。
 */
export function PaceZoneTable(props: Props) {
  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <ZoneTable {...props} />
      </Box>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <ZoneCards {...props} />
      </Box>
    </>
  );
}

function ZoneTable({ target, current, currentLabel }: Props) {
  return (
    <TableContainer>
      <Table size="small" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        <TableHead>
          <TableRow>
            <TableCell>区间</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>破四目标</TableCell>
            {current && (
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentLabel ?? '当前水平'}</TableCell>
            )}
            <TableCell>心率（最大心率 %）</TableCell>
            <TableCell>体感</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {target.map((zone, i) => (
            <TableRow key={zone.key}>
              <TableCell>{zone.label}</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
                {zone.paceText}
              </TableCell>
              {current && (
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{current[i]?.paceText ?? '—'}</TableCell>
              )}
              <TableCell>{zone.heartRate}</TableCell>
              <TableCell>{zone.feel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ZoneCards({ target, current, currentLabel }: Props) {
  return (
    <Stack spacing={1.5}>
      {target.map((zone, i) => (
        <Card key={zone.key}>
          <CardContent sx={{ fontVariantNumeric: 'tabular-nums' }}>
            <Typography sx={{ fontWeight: 700 }}>{zone.label}</Typography>
            <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  破四目标
                </Typography>
                <Typography color="primary" sx={{ fontWeight: 700 }}>
                  {zone.paceText}
                </Typography>
              </Box>
              {current && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {currentLabel ?? '当前水平'}
                  </Typography>
                  <Typography>{current[i]?.paceText ?? '—'}</Typography>
                </Box>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              心率 {zone.heartRate} · {zone.feel}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
