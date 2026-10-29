/**
 * 大会記録の集計。fs を触らない純粋関数だけを置き、node:test で検証する。
 */
import { daysBetween } from './format-date';

export type RaceDistance = 'full' | 'half' | '10k' | 'other';

export type RaceSummary = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  city: string;
  distance: RaceDistance;
  /** 完走タイム（秒）。未出走・DNF は null */
  resultSeconds: number | null;
  summary: string;
};

/** フルマラソンの完走記録だけを日付昇順で */
function finishedFulls(races: RaceSummary[]): (RaceSummary & { resultSeconds: number })[] {
  return races
    .filter((r): r is RaceSummary & { resultSeconds: number } => {
      return r.distance === 'full' && r.resultSeconds !== null;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** フルマラソンの自己ベスト。記録が無ければ null */
export function personalBest(races: RaceSummary[]): RaceSummary | null {
  const fulls = finishedFulls(races);
  if (fulls.length === 0) return null;
  return fulls.reduce((best, r) => (r.resultSeconds < best.resultSeconds ? r : best));
}

export type PbPoint = {
  slug: string;
  date: string;
  resultSeconds: number;
  /** その時点で自己ベストを更新したか */
  isPb: boolean;
};

/** フルマラソンの記録推移。グラフ描画用に、各大会が PB 更新だったかを付ける */
export function progression(races: RaceSummary[]): PbPoint[] {
  let best = Infinity;
  return finishedFulls(races).map(r => {
    const isPb = r.resultSeconds < best;
    if (isPb) best = r.resultSeconds;
    return { slug: r.slug, date: r.date, resultSeconds: r.resultSeconds, isPb };
  });
}

/** today 以降で最も近い大会。当日の大会も含める */
export function nextRace(races: RaceSummary[], today: string): RaceSummary | null {
  const upcoming = races
    .filter(r => daysBetween(today, r.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? null;
}

/** 目標との差（秒）。正なら目標より遅い */
export function gapToGoal(resultSeconds: number, goalSeconds: number): number {
  return resultSeconds - goalSeconds;
}

/** 距離区分の表示名 */
export const DISTANCE_LABEL: Record<RaceDistance, string> = {
  full: '全马',
  half: '半马',
  '10k': '10km',
  other: '其他',
};
