import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { TrainingSummary } from '@/lib/content';

export function TrainingCard({ training }: { training: TrainingSummary }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea href={`/training/${training.slug}/`} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
            {training.frequency}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            {training.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {training.summary}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
