/**
 * タイム・ペースの換算。
 *
 * 計算はすべて「秒」の整数で行い、表示用の文字列へはこのファイルの関数だけで変換する。
 * 浮動小数の秒を持ち回ると、5km ごとの通過タイムで 1 秒ずれる表示が出るため。
 */

/** フルマラソンの距離（km） */
export const MARATHON_KM = 42.195;
/** ハーフマラソンの距離（km） */
export const HALF_KM = 21.0975;

/**
 * "H:MM:SS" / "MM:SS" を秒へ。解釈できなければ null。
 * frontmatter は手書きなので、不正値で例外を投げずに呼び出し側で扱えるようにする。
 */
export function parseDuration(value: string): number | null {
  const parts = value.trim().split(':');
  if (parts.length < 2 || parts.length > 3) return null;
  if (!parts.every(part => /^\d+$/.test(part))) return null;
  const nums = parts.map(Number);
  const [h, m, s] = nums.length === 3 ? nums : [0, nums[0], nums[1]];
  if (m >= 60 || s >= 60) return null;
  return h * 3600 + m * 60 + s;
}

/** 秒を "H:MM:SS" へ。1 時間未満は "MM:SS" */
export function formatDuration(totalSeconds: number): string {
  const sec = Math.round(Math.abs(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** 秒/km を "M'SS\"" 形式へ（日本・中国のランナーに馴染みのある表記） */
export function formatPace(secondsPerKm: number): string {
  const sec = Math.round(secondsPerKm);
  return `${Math.floor(sec / 60)}'${String(sec % 60).padStart(2, '0')}"`;
}

/** 完走タイムから 1km あたりの秒数 */
export function paceFromTime(totalSeconds: number, distanceKm: number = MARATHON_KM): number {
  return totalSeconds / distanceKm;
}

export type Split = {
  /** 地点（km） */
  km: number;
  /** その地点までの累計タイム（秒・整数） */
  elapsed: number;
};

/**
 * 一定ペースで走ったときの通過タイム表。
 * 5km ごと＋中間点＋ゴールを返す（大会の計測地点に合わせる）。
 */
export function evenSplits(totalSeconds: number, stepKm = 5): Split[] {
  const pace = paceFromTime(totalSeconds);
  const points: number[] = [];
  for (let km = stepKm; km < MARATHON_KM; km += stepKm) points.push(km);
  points.push(HALF_KM, MARATHON_KM);
  return [...new Set(points)]
    .sort((a, b) => a - b)
    .map(km => ({ km, elapsed: km === MARATHON_KM ? totalSeconds : Math.round(km * pace) }));
}
