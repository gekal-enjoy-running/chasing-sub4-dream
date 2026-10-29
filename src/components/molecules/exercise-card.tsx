import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ExerciseAnimation } from '@/components/atoms/exercise-animation';
import type { ExerciseSummary } from '@/lib/exercises';

export function ExerciseCard({
  exercise,
  animated,
}: {
  exercise: ExerciseSummary;
  animated: boolean;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea href={`/exercises/${exercise.slug}/`} sx={{ height: '100%' }}>
        {animated && <ExerciseAnimation slug={exercise.slug} title={exercise.title} />}
        <CardContent>
          <Typography variant="h3">{exercise.title}</Typography>
          <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
            {exercise.dosage}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
