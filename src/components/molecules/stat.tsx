import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

/** 数字 1 つを大きく見せるタイル。children を渡すと value の代わりに表示する */
export function Stat({
  label,
  value,
  note,
  children,
}: {
  label: string;
  value?: string;
  note?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {children ?? (
          <Typography
            sx={{ mt: 0.5, fontSize: '2rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
          >
            {value}
          </Typography>
        )}
        {note && (
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
            {note}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
