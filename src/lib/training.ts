/**
 * 训练配速区间。马拉松完赛时间（秒）から各強度のペース帯を求める。
 *
 * 係数は「马拉松配速 × 倍率」の経験則で、16 周计划・能力カードに書いている値
 * （破四なら E 6'20"〜6'50"、阈值 5'05"〜5'15"、间歇 4'50"〜5'00"）と揃えてある。
 * 個人差があるため、表示側では「参考値」と明記すること。
 */
import { formatPace, paceFromTime } from './time';

export type ZoneKey = 'easy' | 'marathon' | 'threshold' | 'interval' | 'repetition';

type ZoneDef = {
  key: ZoneKey;
  label: string;
  /** 马拉松配速に掛ける倍率（小さいほど速い）。[速い側, 遅い側] */
  ratio: [number, number];
  /** 最大心拍数に対する割合の目安 */
  heartRate: string;
  /** 主観的きつさ（RPE 1〜10）と体感 */
  feel: string;
};

export const ZONES: ZoneDef[] = [
  {
    key: 'easy',
    label: '轻松跑 / LSD（E）',
    ratio: [1.11, 1.2],
    heartRate: '65〜79%',
    feel: 'RPE 3〜4，能完整地聊天',
  },
  {
    key: 'marathon',
    label: '马拉松配速（M）',
    ratio: [0.98, 1.0],
    heartRate: '80〜85%',
    feel: 'RPE 5〜6，能说短句',
  },
  {
    key: 'threshold',
    label: '乳酸阈值（T）',
    ratio: [0.895, 0.922],
    heartRate: '86〜90%',
    feel: 'RPE 7，“舒服的累”，只能说几个词',
  },
  {
    key: 'interval',
    label: '最大摄氧量间歇（I）',
    ratio: [0.85, 0.88],
    heartRate: '95〜100%（每组末段）',
    feel: 'RPE 8〜9，说不出话',
  },
  {
    key: 'repetition',
    label: '加速跑 / 短冲（R）',
    ratio: [0.8, 0.83],
    heartRate: '不看心率（时间太短）',
    feel: 'RPE 8，快而放松',
  },
];

export type PaceZone = ZoneDef & {
  /** 1km あたりの秒数。[速い側, 遅い側] */
  pace: [number, number];
  /** 表示用（例: 5'05"〜5'15"） */
  paceText: string;
};

/** 马拉松完赛时间（秒）から全区间のペース帯を返す */
export function paceZones(marathonSeconds: number): PaceZone[] {
  const mp = paceFromTime(marathonSeconds);
  return ZONES.map(zone => {
    const pace: [number, number] = [mp * zone.ratio[0], mp * zone.ratio[1]];
    return { ...zone, pace, paceText: `${formatPace(pace[0])}〜${formatPace(pace[1])}` };
  });
}

/** 指定した区间だけを返す。未知のキーなら undefined */
export function paceZone(marathonSeconds: number, key: ZoneKey): PaceZone | undefined {
  return paceZones(marathonSeconds).find(zone => zone.key === key);
}

export function isZoneKey(value: unknown): value is ZoneKey {
  return ZONES.some(zone => zone.key === value);
}
