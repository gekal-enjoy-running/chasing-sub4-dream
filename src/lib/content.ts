/**
 * content/ 配下の Markdown を読む。fs を触るのはこのファイルだけ。
 *
 * frontmatter は手書きで必ず崩れるため、unknown として受けて正規化してから返す。
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

const CONTENT_DIR = join(process.cwd(), 'content');

export type Page = { title: string; summary: string; html: string };

function readMarkdownDir(dir: string) {
  const full = join(CONTENT_DIR, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const { data, content } = matter(readFileSync(join(full, name), 'utf8'));
      return { slug: name.replace(/\.md$/, ''), data: data as Record<string, unknown>, content };
    });
}

async function toHtml(markdown: string): Promise<string> {
  // リポジトリ内の自分で書いた Markdown だけを扱うので、サニタイズはしない
  const file = await remark().use(remarkGfm).use(html, { sanitize: false }).process(markdown);
  return String(file);
}

/** content/pages/<name>.md の固定ページ */
export async function getPage(name: string): Promise<Page> {
  const { data, content } = matter(readFileSync(join(CONTENT_DIR, 'pages', `${name}.md`), 'utf8'));
  return {
    title: String(data.title ?? name),
    summary: String(data.summary ?? ''),
    html: await toHtml(content),
  };
}

export type GuideSummary = {
  slug: string;
  title: string;
  summary: string;
  /** 所要時間の目安（例: "10〜15 分钟"） */
  duration: string;
  /** 一覧の表示順。小さいほど先 */
  order: number;
};

export type Guide = GuideSummary & { html: string };

function toGuideSummary(slug: string, data: Record<string, unknown>): GuideSummary {
  const order = Number(data.order);
  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ''),
    duration: String(data.duration ?? ''),
    order: Number.isFinite(order) ? order : 999,
  };
}

/** 训练指南の一覧（order 順）。本文は含めない */
export function getAllGuides(): GuideSummary[] {
  return readMarkdownDir('guides')
    .map(({ slug, data }) => toGuideSummary(slug, data))
    .sort((a, b) => a.order - b.order);
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const found = readMarkdownDir('guides').find(entry => entry.slug === slug);
  if (!found) return null;
  return { ...toGuideSummary(found.slug, found.data), html: await toHtml(found.content) };
}
