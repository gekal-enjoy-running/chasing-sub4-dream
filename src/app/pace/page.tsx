import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { PageHeading } from '@/components/atoms/page-heading';
import { SectionHeading } from '@/components/atoms/section-heading';
import { PaceCalculator } from '@/components/molecules/pace-calculator';
import { SITE } from '@/config/site';
import {
  evenSplits,
  formatDuration,
  formatPace,
  HALF_KM,
  MARATHON_KM,
  paceFromTime,
} from '@/lib/time';

const description = '破四需要的配速与 5km 分段通过时间，以及目标时间 ⇄ 配速计算器。';

export const metadata: Metadata = {
  title: '破四配速表',
  description,
  alternates: { canonical: '/pace/' },
};

/** 比較用に並べる目標タイム（秒） */
const TARGETS = [4 * 3600 + 15 * 60, 4 * 3600 + 5 * 60, SITE.goalSeconds - 1, 3 * 3600 + 50 * 60];

const pointLabel = (km: number) =>
  km === MARATHON_KM ? '终点' : km === HALF_KM ? '半程' : `${km}km`;

export default function PacePage() {
  const splits = evenSplits(SITE.goalSeconds);

  return (
    <>
      <PageHeading title="破四配速表" lead={description} />

      <Box component="section" aria-labelledby="split-heading">
        <SectionHeading
          id="split-heading"
          title={`4:00:00 匀速分段（${formatPace(paceFromTime(SITE.goalSeconds))}/km）`}
        />
        {/* 10 地点を横に並べるとスマホでは収まらないため、md 未満は縦の表にする */}
        <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
          <Table size="small" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            <TableHead>
              <TableRow>
                {splits.map(s => (
                  <TableCell key={s.km} sx={{ whiteSpace: 'nowrap' }}>
                    {pointLabel(s.km)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {splits.map(s => (
                  <TableCell key={s.km} sx={{ fontWeight: 700 }}>
                    {formatDuration(s.elapsed)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Table
          size="small"
          sx={{ display: { xs: 'table', md: 'none' }, fontVariantNumeric: 'tabular-nums' }}
        >
          <TableHead>
            <TableRow>
              <TableCell>地点</TableCell>
              <TableCell align="right">通过时间</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {splits.map(s => (
              <TableRow key={s.km}>
                <TableCell>{pointLabel(s.km)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatDuration(s.elapsed)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
          实际比赛中 GPS 距离通常会多出 0.5〜1%，建议按比表中快 3〜5 秒/km 的配速来跑。
        </Typography>
      </Box>

      <Box component="section" aria-labelledby="compare-heading" sx={{ mt: 6 }}>
        <SectionHeading id="compare-heading" title="目标时间对照" />
        <Grid container spacing={2}>
          {TARGETS.map(t => (
            <Grid key={t} size={{ xs: 6, sm: 3 }}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  <Typography sx={{ fontWeight: 700 }}>{formatDuration(t)}</Typography>
                  <Typography color="primary" sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {formatPace(paceFromTime(t))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    半程 {formatDuration(paceFromTime(t) * HALF_KM)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section" aria-labelledby="calc-heading" sx={{ mt: 6 }}>
        <SectionHeading id="calc-heading" title="配速计算器" />
        <PaceCalculator />
      </Box>
    </>
  );
}
