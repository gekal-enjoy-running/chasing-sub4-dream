import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SectionHeading } from '@/components/atoms/section-heading';
import { AbilityCard } from '@/components/molecules/ability-card';
import { Countdown } from '@/components/molecules/countdown';
import { GuideCard } from '@/components/molecules/guide-card';
import { PbChart } from '@/components/molecules/pb-chart';
import { Stat } from '@/components/molecules/stat';
import { ABILITIES } from '@/config/abilities';
import { SITE } from '@/config/site';
import { getAllGuides, getAllRaces } from '@/lib/content';
import { formatDate, todayLocal } from '@/lib/format-date';
import { gapToGoal, nextRace, personalBest, progression } from '@/lib/races';
import { formatDuration, formatPace, MARATHON_KM, paceFromTime } from '@/lib/time';

export default function Home() {
  const races = getAllRaces();
  const pb = personalBest(races);
  const gap = pb?.resultSeconds != null ? gapToGoal(pb.resultSeconds, SITE.goalSeconds) : null;
  // ビルド日時点の「次の大会」。日数のカウントだけはブラウザで行う
  const upcoming = nextRace(races, todayLocal());
  const guides = getAllGuides().slice(0, 3);

  return (
    <Stack spacing={8}>
      <Box component="section">
        <Typography
          variant="overline"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: '0.2em' }}
        >
          Chasing Sub-4 Dream
        </Typography>
        <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: '2.25rem', sm: '3rem' } }}>
          全程马拉松
          <br />
          <Box component="span" sx={{ color: 'primary.main' }}>
            4 小时以内
          </Box>
          ，是我正在追的梦。
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 3, maxWidth: 640 }}>
          破四意味着 42.195km 全程保持{' '}
          <Box component="strong" sx={{ color: 'text.primary' }}>
            {formatPace(paceFromTime(SITE.goalSeconds))}
          </Box>
          /km。要做到这一点，需要的不只是意志力，而是下面这些可以一点点练出来的能力。
        </Typography>
      </Box>

      <Box component="section" aria-labelledby="progress-heading">
        <SectionHeading
          id="progress-heading"
          title="破四进度"
          more={{ href: '/races/', label: '全部比赛' }}
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stat
              label="全马 PB"
              value={pb?.resultSeconds != null ? formatDuration(pb.resultSeconds) : '—'}
              note={pb ? `${pb.title}（${formatDate(pb.date)}）` : undefined}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stat
              label="距离破四"
              value={gap === null ? '—' : gap < 0 ? '已破四！' : formatDuration(gap)}
              note={
                gap !== null && gap > 0
                  ? `每公里还需快 ${Math.ceil(gap / MARATHON_KM)} 秒`
                  : undefined
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stat
              label="下一场比赛"
              note={upcoming ? <Countdown date={upcoming.date} /> : undefined}
            >
              {upcoming ? (
                <>
                  <Link
                    href={`/races/${upcoming.slug}/`}
                    color="inherit"
                    underline="hover"
                    sx={{ display: 'block', mt: 0.5, fontSize: '1.25rem', fontWeight: 700 }}
                  >
                    {upcoming.title}
                  </Link>
                  <Typography variant="body2">{formatDate(upcoming.date)}</Typography>
                </>
              ) : (
                <Typography sx={{ mt: 0.5, fontSize: '1.25rem', fontWeight: 700 }}>未定</Typography>
              )}
            </Stat>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <PbChart points={progression(races)} goalSeconds={SITE.goalSeconds} />
        </Box>
      </Box>

      <Box component="section" aria-labelledby="abilities-heading">
        <SectionHeading id="abilities-heading" title="破四需要的能力" />
        <Grid container spacing={2}>
          {ABILITIES.map(ability => (
            <Grid key={ability.key} size={{ xs: 12, sm: 6, md: 4 }}>
              <AbilityCard ability={ability} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1.5 }}>
          目标数值为一般换算的参考，个人差异较大。
        </Typography>
      </Box>

      <Box component="section" aria-labelledby="guides-heading">
        <SectionHeading
          id="guides-heading"
          title="训练指南"
          more={{ href: '/guides/', label: '全部指南' }}
        />
        <Grid container spacing={2}>
          {guides.map(guide => (
            <Grid key={guide.slug} size={{ xs: 12, sm: 4 }}>
              <GuideCard guide={guide} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
