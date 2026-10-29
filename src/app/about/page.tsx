import type { Metadata } from 'next';
import { PageHeading } from '@/components/atoms/page-heading';
import { Prose } from '@/components/atoms/prose';
import { getPage } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('about');
  return { title: page.title, description: page.summary, alternates: { canonical: '/about/' } };
}

export default async function AboutPage() {
  const page = await getPage('about');
  return (
    <>
      <PageHeading title={page.title} lead={page.summary} />
      <Prose html={page.html} />
    </>
  );
}
