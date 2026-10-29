import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SectionHeading } from '@/components/atoms/section-heading';
import { AbilityCard } from '@/components/molecules/ability-card';
import { GuideCard } from '@/components/molecules/guide-card';
import { ABILITIES } from '@/config/abilities';
import { SITE } from '@/config/site';
import { getAllGuides } from '@/lib/content';
import { formatPace, paceFromTime } from '@/lib/time';

export default function Home() {
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
