import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SpeedIcon from '@mui/icons-material/Speed';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Ability } from '@/config/abilities';

const ICONS: Record<Ability['key'], typeof SpeedIcon> = {
  aerobic: FavoriteBorderIcon,
  threshold: SpeedIcon,
  endurance: DirectionsRunIcon,
  strength: FitnessCenterIcon,
  economy: AccessibilityNewIcon,
  recovery: BedtimeOutlinedIcon,
};

export function AbilityCard({ ability }: { ability: Ability }) {
  const Icon = ICONS[ability.key];
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Icon color="primary" />
          <Typography variant="h3">{ability.title}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          {ability.why}
        </Typography>
        <Typography variant="caption" color="primary" sx={{ mt: 2, fontWeight: 700 }}>
          到达目标
        </Typography>
        <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5, typography: 'body2' }}>
          {ability.targets.map(t => (
            <li key={t}>{t}</li>
          ))}
        </Box>
        <Typography variant="caption" color="primary" sx={{ mt: 2, fontWeight: 700 }}>
          怎么练
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, flexGrow: 1 }}>
          {ability.training}
        </Typography>
        {ability.link && (
          <Link href={ability.link.href} variant="body2" underline="hover" sx={{ mt: 2 }}>
            {ability.link.label} →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
