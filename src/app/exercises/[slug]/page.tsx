import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BackLink } from '@/components/atoms/back-link';
import { ExerciseAnimation } from '@/components/atoms/exercise-animation';
import { Prose } from '@/components/atoms/prose';
import { Tag } from '@/components/atoms/tag';
import { EXERCISE_CATEGORIES } from '@/config/exercises';
import { SITE } from '@/config/site';
import { getAllExercises, getExerciseBySlug, hasAnimation } from '@/lib/content';
import { neighbors, type ExerciseSummary } from '@/lib/exercises';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllExercises().map(exercise => ({ slug: exercise.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exercise = await getExerciseBySlug(slug);
  if (!exercise) return {};
  return {
    title: exercise.title,
    description: exercise.summary,
    alternates: { canonical: `/exercises/${slug}/` },
    openGraph: {
      type: 'article',
      title: exercise.title,
      description: exercise.summary,
      images: [SITE.ogImage],
    },
  };
}

/** 次数・用具・目标部位の 1 項目 */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  );
}

function Neighbor({
  exercise,
  label,
  align,
}: {
  exercise?: ExerciseSummary;
  label: string;
  align: 'left' | 'right';
}) {
  if (!exercise) return null;
  return (
    <Link
      href={`/exercises/${exercise.slug}/`}
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
      {exercise.title}
    </Link>
  );
}

export default async function ExercisePage({ params }: Props) {
  const { slug } = await params;
  const exercise = await getExerciseBySlug(slug);
  if (!exercise) notFound();
  const category = EXERCISE_CATEGORIES.find(c => c.key === exercise.category);
  const { prev, next } = neighbors(getAllExercises(), slug);

  return (
    <article>
      <BackLink href="/exercises/" label="动作库" />
      <Box component="header" sx={{ mt: 3, mb: 4 }}>
        {category && <Tag label={category.label} />}
        <Typography variant="h1" sx={{ mt: 1 }}>
          {exercise.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          {exercise.summary}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {hasAnimation(slug) && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <ExerciseAnimation slug={slug} title={exercise.title} priority />
            </Card>
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2.5}>
                <Fact label="次数 / 时间">
                  <Typography sx={{ fontWeight: 700 }} color="primary">
                    {exercise.dosage}
                  </Typography>
                </Fact>
                <Fact label="需要的用具">
                  <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
                    {exercise.equipment.map(item => (
                      <Tag key={item} label={item} />
                    ))}
                  </Stack>
                </Fact>
                <Fact label="主要锻炼部位">
                  <Typography variant="body2">{exercise.muscles.join('、')}</Typography>
                </Fact>
                {category && (
                  <Link href={category.guide} variant="body2" underline="hover">
                    查看{category.label}指南 →
                  </Link>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Prose html={exercise.html} />

      <Divider sx={{ mt: 8, mb: 3 }} />
      <Grid component="nav" aria-label="上一个 / 下一个动作" container spacing={2}>
        <Grid size={6}>
          <Neighbor exercise={prev} label="上一个动作" align="left" />
        </Grid>
        <Grid size={6}>
          <Neighbor exercise={next} label="下一个动作" align="right" />
        </Grid>
      </Grid>
    </article>
  );
}
