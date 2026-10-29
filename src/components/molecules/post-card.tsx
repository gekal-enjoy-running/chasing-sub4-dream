import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DateLabel } from '@/components/atoms/date-label';
import { Tag } from '@/components/atoms/tag';
import type { PostSummary } from '@/lib/content';

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Card component="article" sx={{ height: '100%' }}>
      <CardActionArea href={`/journal/${post.slug}/`} sx={{ height: '100%' }}>
        <CardContent>
          <DateLabel date={post.date} />
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {post.summary}
          </Typography>
          {post.tags.length > 0 && (
            <Stack direction="row" sx={{ mt: 2, gap: 1, flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <Tag key={tag} label={tag} />
              ))}
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
