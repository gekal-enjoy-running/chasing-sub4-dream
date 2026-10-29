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
import type { RaceDistance, RaceSummary } from './races';
import { parseDuration } from './time';

const CONTENT_DIR = join(process.cwd(), 'content');

export type Race = RaceSummary & { html: string };
export type Page = { title: string; summary: string; html: string };

/** ファイル名先頭の日付を除いて slug にする（2026-10-25-mito.md → mito） */
function slugFromFile(name: string): string {
  return name.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/**
 * gray-matter は YAML の日付を Date にしてしまうため、YYYY-MM-DD の文字列へ戻す。
 * YAML の日付は UTC 0 時なので、toISOString で取り出せばずれない。
 */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? '');
}

function readMarkdownDir(dir: string) {
  const full = join(CONTENT_DIR, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const { data, content } = matter(readFileSync(join(full, name), 'utf8'));
      return { slug: slugFromFile(name), data: data as Record<string, unknown>, content };
    });
}

async function toHtml(markdown: string): Promise<string> {
  // リポジトリ内の自分で書いた Markdown だけを扱うので、サニタイズはしない
  const file = await remark().use(remarkGfm).use(html, { sanitize: false }).process(markdown);
  return String(file);
}

const DISTANCES: RaceDistance[] = ['full', 'half', '10k', 'other'];

function toRaceSummary(slug: string, data: Record<string, unknown>): RaceSummary {
  const distance = DISTANCES.find(d => d === data.distance) ?? 'full';
  const result = typeof data.result === 'string' ? parseDuration(data.result) : null;
  return {
    slug,
    title: String(data.title ?? slug),
    date: toDateString(data.date),
    city: String(data.city ?? ''),
    distance,
    resultSeconds: result,
    summary: String(data.summary ?? ''),
  };
}

/** 大会の一覧（新しい順）。本文は含めない */
export function getAllRaces(): RaceSummary[] {
  return readMarkdownDir('races')
    .map(({ slug, data }) => toRaceSummary(slug, data))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getRaceBySlug(slug: string): Promise<Race | null> {
  const found = readMarkdownDir('races').find(entry => entry.slug === slug);
  if (!found) return null;
  return { ...toRaceSummary(found.slug, found.data), html: await toHtml(found.content) };
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
