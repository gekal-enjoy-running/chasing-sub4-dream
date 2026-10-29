import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { PageHeading } from '@/components/atoms/page-heading';
import { PbChart } from '@/components/molecules/pb-chart';
import { SITE } from '@/config/site';
import { getAllRaces } from '@/lib/content';
import { formatDate } from '@/lib/format-date';
import { DISTANCE_LABEL, personalBest, progression } from '@/lib/races';
import { formatDuration } from '@/lib/time';

const description = '参加过的全部比赛成绩与全马 PB 变化。';

export const metadata: Metadata = {
  title: '比赛记录',
  description,
  alternates: { canonical: '/races/' },
};

export default function RacesPage() {
  const races = getAllRaces();
  const pb = personalBest(races);

  return (
    <>
      <PageHeading title="比赛记录" lead={description} />
      <PbChart points={progression(races)} goalSeconds={SITE.goalSeconds} />
      <TableContainer sx={{ mt: 4 }}>
        <Table sx={{ minWidth: 520, fontVariantNumeric: 'tabular-nums' }}>
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell>比赛</TableCell>
              <TableCell>项目</TableCell>
              <TableCell align="right">成绩</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {races.map(race => (
              <TableRow key={race.slug} hover>
                <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                  {formatDate(race.date)}
                </TableCell>
                <TableCell>
                  <Link href={`/races/${race.slug}/`} underline="hover" sx={{ fontWeight: 500 }}>
                    {race.title}
                  </Link>
                </TableCell>
                <TableCell>{DISTANCE_LABEL[race.distance]}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {race.resultSeconds === null ? (
                    <Typography component="span" variant="body2" color="text.secondary">
                      未开赛
                    </Typography>
                  ) : (
                    <Box component="span">
                      {formatDuration(race.resultSeconds)}
                      {race.slug === pb?.slug && (
                        <Chip label="PB" size="small" color="primary" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
