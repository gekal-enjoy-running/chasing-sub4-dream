import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import { PageHeading } from '@/components/atoms/page-heading';
import { GuideCard } from '@/components/molecules/guide-card';
import { getAllGuides } from '@/lib/content';

const description = '跑前热身、跑后拉伸、力量训练、技术练习与恢复——跑步之外同样重要的功课。';

export const metadata: Metadata = {
  title: '训练指南',
  description,
  alternates: { canonical: '/guides/' },
};

export default function GuidesPage() {
  const guides = getAllGuides();
  return (
    <>
      <PageHeading title="训练指南" lead={description} />
      <Grid container spacing={2}>
        {guides.map(guide => (
          <Grid key={guide.slug} size={{ xs: 12, sm: 6 }}>
            <GuideCard guide={guide} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
