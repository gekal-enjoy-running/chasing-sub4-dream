import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BackLink } from '@/components/atoms/back-link';
import { DateLabel } from '@/components/atoms/date-label';
import { Prose } from '@/components/atoms/prose';
import { Tag } from '@/components/atoms/tag';
import { SITE } from '@/config/site';
import { getAllRaces, getRaceBySlug } from '@/lib/content';
import { DISTANCE_LABEL } from '@/lib/races';
import { formatDuration, formatPace, HALF_KM, MARATHON_KM, paceFromTime } from '@/lib/time';

type Props = { params: Promise<{ slug: string }> };

const DISTANCE_KM = { full: MARATHON_KM, half: HALF_KM, '10k': 10, other: null } as const;

export function generateStaticParams() {
  return getAllRaces().map(race => ({ slug: race.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const race = await getRaceBySlug(slug);
  if (!race) return {};
  return {
    title: race.title,
    description: race.summary,
    alternates: { canonical: `/races/${slug}/` },
    openGraph: {
      type: 'article',
      title: race.title,
      description: race.summary,
      publishedTime: race.date,
      images: [SITE.ogImage],
    },
  };
}

export default async function RacePage({ params }: Props) {
  const { slug } = await params;
  const race = await getRaceBySlug(slug);
  if (!race) notFound();
  const km = DISTANCE_KM[race.distance];

  return (
    <article>
      <BackLink href="/races/" label="比赛记录" />
      <Box component="header" sx={{ mt: 3, mb: 5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <DateLabel date={race.date} />
          <Tag label={DISTANCE_LABEL[race.distance]} />
        </Stack>
        <Typography variant="h1" sx={{ mt: 1 }}>
          {race.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          {race.summary}
        </Typography>
        {race.resultSeconds !== null && (
          <Typography
            color="primary"
            sx={{ mt: 2, fontSize: '2.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
          >
            {formatDuration(race.resultSeconds)}
            {km && (
              <Typography component="span" color="text.secondary" sx={{ ml: 2 }}>
                平均 {formatPace(paceFromTime(race.resultSeconds, km))}/km
              </Typography>
            )}
          </Typography>
        )}
      </Box>
      <Prose html={race.html} />
    </article>
  );
}
