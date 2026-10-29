/**
 * 动作库の並べ替え・グルーピング。fs を触らない純粋関数だけを置く。
 */
import { EXERCISE_CATEGORIES, type ExerciseCategory } from '@/config/exercises';

export type ExerciseSummary = {
  slug: string;
  title: string;
  category: ExerciseCategory;
  summary: string;
  /** 回数・時間の目安（例: "15 次 × 3 组"） */
  dosage: string;
  equipment: string[];
  muscles: string[];
  /** カテゴリ内の表示順 */
  order: number;
};

/** 文字列がカテゴリのキーか。frontmatter の手書き値を検証する */
export function isCategory(value: unknown): value is ExerciseCategory {
  return EXERCISE_CATEGORIES.some(c => c.key === value);
}

/** カテゴリ順 → order 順に並べる */
export function sortExercises(list: ExerciseSummary[]): ExerciseSummary[] {
  const rank = (c: ExerciseCategory) => EXERCISE_CATEGORIES.findIndex(x => x.key === c);
  return [...list].sort(
    (a, b) =>
      rank(a.category) - rank(b.category) || a.order - b.order || a.slug.localeCompare(b.slug)
  );
}

/** カテゴリごとにまとめる。動作が 1 つも無いカテゴリは返さない */
export function groupByCategory(list: ExerciseSummary[]) {
  const sorted = sortExercises(list);
  return EXERCISE_CATEGORIES.map(category => ({
    ...category,
    exercises: sorted.filter(e => e.category === category.key),
  })).filter(group => group.exercises.length > 0);
}

/** 同じカテゴリ内の前後の動作 */
export function neighbors(list: ExerciseSummary[], slug: string) {
  const current = list.find(e => e.slug === slug);
  if (!current) return { prev: undefined, next: undefined };
  const same = sortExercises(list).filter(e => e.category === current.category);
  const index = same.findIndex(e => e.slug === slug);
  return { prev: same[index - 1], next: same[index + 1] };
}
