import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import { PageHeading } from '@/components/atoms/page-heading';
import { PostCard } from '@/components/molecules/post-card';
import { getAllPosts } from '@/lib/content';

const description = '每一次关键训练的数据与感受。';

export const metadata: Metadata = {
  title: '训练日志',
  description,
  alternates: { canonical: '/journal/' },
};

export default function JournalPage() {
  const posts = getAllPosts();
  return (
    <>
      <PageHeading title="训练日志" lead={description} />
      <Grid container spacing={2}>
        {posts.map(post => (
          <Grid key={post.slug} size={{ xs: 12, sm: 6 }}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
