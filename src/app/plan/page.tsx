import type { Metadata } from 'next';
import { PageHeading } from '@/components/atoms/page-heading';
import { Prose } from '@/components/atoms/prose';
import { getPage } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('plan');
  return { title: page.title, description: page.summary, alternates: { canonical: '/plan/' } };
}

export default async function PlanPage() {
  const page = await getPage('plan');
  return (
    <>
      <PageHeading title={page.title} lead={page.summary} />
      <Prose html={page.html} />
    </>
  );
}
