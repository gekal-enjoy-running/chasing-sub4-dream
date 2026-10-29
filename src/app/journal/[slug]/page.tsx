import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BackLink } from '@/components/atoms/back-link';
import { DateLabel } from '@/components/atoms/date-label';
import { Prose } from '@/components/atoms/prose';
import { Tag } from '@/components/atoms/tag';
import { SITE } from '@/config/site';
import { getAllPosts, getPostBySlug } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/journal/${slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      images: [SITE.ogImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <BackLink href="/journal/" label="训练日志" />
      <Box component="header" sx={{ mt: 3, mb: 5 }}>
        <DateLabel date={post.date} />
        <Typography variant="h1" sx={{ mt: 1 }}>
          {post.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          {post.summary}
        </Typography>
        <Stack direction="row" sx={{ mt: 2, gap: 1, flexWrap: 'wrap' }}>
          {post.tags.map(tag => (
            <Tag key={tag} label={tag} />
          ))}
        </Stack>
      </Box>
      <Prose html={post.html} />
    </article>
  );
}
