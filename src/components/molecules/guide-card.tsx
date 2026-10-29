import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { GuideSummary } from '@/lib/content';

export function GuideCard({ guide }: { guide: GuideSummary }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea href={`/guides/${guide.slug}/`} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
            {guide.duration}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            {guide.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {guide.summary}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
