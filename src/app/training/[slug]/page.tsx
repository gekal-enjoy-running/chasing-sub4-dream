import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { BackLink } from '@/components/atoms/back-link';
import { Prose } from '@/components/atoms/prose';
import { SectionHeading } from '@/components/atoms/section-heading';
import { Tag } from '@/components/atoms/tag';
import { PaceZoneTable } from '@/components/molecules/pace-zone-table';
import { PointListCard } from '@/components/molecules/point-list-card';
import { SITE } from '@/config/site';
import {
  getAllRaces,
  getAllTrainings,
  getTrainingBySlug,
  type TrainingSummary,
} from '@/lib/content';
import { personalBest } from '@/lib/races';
import { formatDuration } from '@/lib/time';
import { paceZones } from '@/lib/training';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllTrainings().map(training => ({ slug: training.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);
  if (!training) return {};
  return {
    title: training.title,
    description: training.summary,
    alternates: { canonical: `/training/${slug}/` },
    openGraph: {
      type: 'article',
      title: training.title,
      description: training.summary,
      images: [SITE.ogImage],
    },
  };
}

function Neighbor({
  training,
  label,
  align,
}: {
  training?: TrainingSummary;
  label: string;
  align: 'left' | 'right';
}) {
  if (!training) return null;
  return (
    <Link
      href={`/training/${training.slug}/`}
      color="inherit"
      underline="hover"
      sx={{ display: 'block', textAlign: align }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        component="span"
        sx={{ display: 'block' }}
      >
        {label}
      </Typography>
      {training.title}
    </Link>
  );
}

export default async function TrainingDetailPage({ params }: Props) {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);
  if (!training) notFound();
  const all = getAllTrainings();
  const index = all.findIndex(t => t.slug === slug);
  const pb = personalBest(getAllRaces());
  // このトレーニングで使う区间だけを表に出す
  const pick = (seconds: number) => paceZones(seconds).filter(z => training.zones.includes(z.key));

  return (
    <article>
      <BackLink href="/training/" label="训练方法" />
      <Box component="header" sx={{ mt: 3, mb: 4 }}>
        <Tag label={training.frequency} />
        <Typography variant="h1" sx={{ mt: 1 }}>
          {training.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          {training.summary}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PointListCard title="优势" items={training.benefits} icon="check" />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PointListCard title="锻炼到的地方" items={training.trains} icon="muscle" />
        </Grid>
      </Grid>

      {training.zones.length > 0 && (
        <Box component="section" aria-labelledby="pace-heading" sx={{ mb: 5 }}>
          <SectionHeading
            id="pace-heading"
            title="配速与强度"
            more={{ href: '/training/', label: '全部配速区间' }}
          />
          <PaceZoneTable
            target={pick(SITE.goalSeconds)}
            current={pb?.resultSeconds != null ? pick(pb.resultSeconds) : undefined}
            currentLabel={
              pb?.resultSeconds != null
                ? `当前（PB ${formatDuration(pb.resultSeconds)}）`
                : undefined
            }
          />
        </Box>
      )}

      <Prose html={training.html} />

      <Divider sx={{ mt: 8, mb: 3 }} />
      <Grid component="nav" aria-label="上一个 / 下一个训练" container spacing={2}>
        <Grid size={6}>
          <Neighbor training={all[index - 1]} label="上一个" align="left" />
        </Grid>
        <Grid size={6}>
          <Neighbor training={all[index + 1]} label="下一个" align="right" />
        </Grid>
      </Grid>
    </article>
  );
}
