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
import { ExerciseCard } from '@/components/molecules/exercise-card';
import { SITE } from '@/config/site';
import {
  getAllExercises,
  getAllGuides,
  getGuideBySlug,
  hasAnimation,
  type GuideSummary,
} from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGuides().map(guide => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.summary,
    alternates: { canonical: `/guides/${slug}/` },
    openGraph: {
      type: 'article',
      title: guide.title,
      description: guide.summary,
      images: [SITE.ogImage],
    },
  };
}

function Neighbor({
  guide,
  label,
  align,
}: {
  guide?: GuideSummary;
  label: string;
  align: 'left' | 'right';
}) {
  if (!guide) return null;
  return (
    <Link
      href={`/guides/${guide.slug}/`}
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
      {guide.title}
    </Link>
  );
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();
  // 前後の指南へ辿れるようにする（一覧へ戻らずに順に読める）
  const guides = getAllGuides();
  const index = guides.findIndex(g => g.slug === slug);
  // frontmatter の exercises の順に並べる。存在しない slug は黙って落とす
  const all = getAllExercises();
  const exercises = guide.exercises.flatMap(s => all.filter(e => e.slug === s));

  return (
    <article>
      <BackLink href="/guides/" label="训练指南" />
      <Box component="header" sx={{ mt: 3, mb: 5 }}>
        <Tag label={guide.duration} />
        <Typography variant="h1" sx={{ mt: 1 }}>
          {guide.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          {guide.summary}
        </Typography>
      </Box>
      {exercises.length > 0 && (
        <Box component="section" aria-labelledby="moves-heading" sx={{ mb: 6 }}>
          <SectionHeading
            id="moves-heading"
            title="本篇动作"
            more={{ href: '/exercises/', label: '动作库' }}
          />
          <Grid container spacing={2}>
            {exercises.map(exercise => (
              <Grid key={exercise.slug} size={{ xs: 6, sm: 4, md: 3 }}>
                <ExerciseCard exercise={exercise} animated={hasAnimation(exercise.slug)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Prose html={guide.html} />
      <Divider sx={{ mt: 8, mb: 3 }} />
      <Grid component="nav" aria-label="上一篇 / 下一篇" container spacing={2}>
        <Grid size={6}>
          <Neighbor guide={guides[index - 1]} label="上一篇" align="left" />
        </Grid>
        <Grid size={6}>
          <Neighbor guide={guides[index + 1]} label="下一篇" align="right" />
        </Grid>
      </Grid>
    </article>
  );
}
