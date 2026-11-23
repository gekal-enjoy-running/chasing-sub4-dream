import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PageHeading } from '@/components/atoms/page-heading';
import { Prose } from '@/components/atoms/prose';
import { SectionHeading } from '@/components/atoms/section-heading';
import { PaceZoneTable } from '@/components/molecules/pace-zone-table';
import { TrainingCard } from '@/components/molecules/training-card';
import { SITE } from '@/config/site';
import { getAllRaces, getAllTrainings, getPage } from '@/lib/content';
import { personalBest } from '@/lib/races';
import { formatDuration } from '@/lib/time';
import { paceZones } from '@/lib/training';

const GROUPS = [
  {
    key: 'core',
    title: '核心训练',
    lead: '破四训练的四根支柱，各自锻炼一种能力。每个训练周期都围绕它们安排。',
  },
  {
    key: 'supplementary',
    title: '补充训练',
    lead: '在核心训练之外，用来练比赛配速、促进恢复、增加变化或降低受伤风险。',
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('training');
  return { title: page.title, description: page.summary, alternates: { canonical: '/training/' } };
}

export default async function TrainingPage() {
  const page = await getPage('training');
  const trainings = getAllTrainings();
  const pb = personalBest(getAllRaces());

  return (
    <>
      <PageHeading title={page.title} lead={page.summary} />

      {GROUPS.map(group => (
        <Box
          key={group.key}
          component="section"
          aria-labelledby={`${group.key}-heading`}
          sx={{ mb: 6 }}
        >
          <SectionHeading id={`${group.key}-heading`} title={group.title} />
          <Typography color="text.secondary" sx={{ mt: -1, mb: 2 }}>
            {group.lead}
          </Typography>
          <Grid container spacing={2}>
            {trainings
              .filter(training => training.group === group.key)
              .map(training => (
                <Grid key={training.slug} size={{ xs: 12, sm: 6 }}>
                  <TrainingCard training={training} />
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}

      <Box component="section" aria-labelledby="zones-heading" sx={{ mb: 6 }}>
        <SectionHeading id="zones-heading" title="配速区间" />
        <PaceZoneTable
          target={paceZones(SITE.goalSeconds)}
          current={pb?.resultSeconds != null ? paceZones(pb.resultSeconds) : undefined}
          currentLabel={
            pb?.resultSeconds != null ? `当前（PB ${formatDuration(pb.resultSeconds)}）` : undefined
          }
        />
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
          由马拉松完赛时间按经验比例换算的参考值，单位为 /km。“当前”按全马 PB
          计算，随比赛记录自动更新。
        </Typography>
      </Box>

      <Prose html={page.html} />
    </>
  );
}
