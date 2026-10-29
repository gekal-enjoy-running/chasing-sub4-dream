import Typography from '@mui/material/Typography';
import { formatDate } from '@/lib/format-date';

export function DateLabel({ date }: { date: string }) {
  return (
    <Typography component="time" dateTime={date} variant="body2" color="text.secondary">
      {formatDate(date)}
    </Typography>
  );
}
