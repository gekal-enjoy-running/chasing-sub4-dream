import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** セクション見出し。右側に「全部見る」リンクを置ける */
export function SectionHeading({
  id,
  title,
  more,
}: {
  id: string;
  title: string;
  more?: { href: string; label: string };
}) {
  return (
    <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Typography id={id} variant="h2">
        {title}
      </Typography>
      {more && (
        <Link href={more.href} variant="body2" underline="hover">
          {more.label} →
        </Link>
      )}
    </Stack>
  );
}
