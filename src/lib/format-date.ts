/**
 * frontmatter の YYYY-MM-DD を表示用に整形する。
 *
 * new Date('2026-08-06') は UTC として解釈され、タイムゾーンによって前日に表示されることがある。
 * 日付だけを扱うので Date を介さず、文字列のまま整形する。
 */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, y, m, d] = match;
  return `${y}年${Number(m)}月${Number(d)}日`;
}

/**
 * from から to までの日数（to が後なら正）。どちらも YYYY-MM-DD。
 * UTC の 0 時同士で比べ、夏時間やタイムゾーンの影響を受けないようにする。
 */
export function daysBetween(from: string, to: string): number {
  const toUtc = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000);
}

/** 実行環境のローカル日付を YYYY-MM-DD で返す（toISOString は UTC になるため使わない） */
export function todayLocal(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
