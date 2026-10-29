/**
 * 破四（フルマラソン 4 時間切り）に必要な能力の定義。トップページのカードに使う。
 *
 * 目安の数値は一般的な換算（10km・ハーフの記録からの推定、時計の VO2max 推定など）による参考値。
 * 個人差が大きいので「到達の目安」として書き、断定しない。
 */
export type Ability = {
  key: 'aerobic' | 'threshold' | 'endurance' | 'strength' | 'economy' | 'recovery';
  title: string;
  /** なぜ必要か（1〜2 文） */
  why: string;
  /** 到達の目安 */
  targets: string[];
  /** 鍛え方 */
  training: string;
  /** 関連する指南・計画ページ */
  link?: { href: string; label: string };
};

export const ABILITIES: Ability[] = [
  {
    key: 'aerobic',
    title: '心肺能力（有氧基础）',
    why: '马拉松 99% 的能量来自有氧系统。心肺越强，同样配速下心率越低、越省力。',
    targets: ['最大摄氧量（手表估算）约 45 以上', '6\'30"/km 轻松跑时心率稳定在 Z2'],
    training: '每周 70〜80% 的跑量用轻松跑完成，每周一次 LSD。',
    link: { href: '/plan/', label: '训练计划' },
  },
  {
    key: 'threshold',
    title: '乳酸阈值（速度耐力）',
    why: '阈值越高，5\'41"/km 的破四配速就越“轻松”，越不容易在后半程堆积疲劳。',
    targets: ['10km 约 52 分钟以内', '半程马拉松约 1:53 以内', '阈值配速约 5\'05"〜5\'15"/km'],
    training: '每周一次节奏跑（20〜40 分钟）或 1000m 间歇。',
    link: { href: '/plan/', label: '训练计划' },
  },
  {
    key: 'endurance',
    title: '马拉松专项耐力',
    why: '撞墙多发生在 30km 之后。需要让身体习惯长时间以目标配速输出、并有效利用脂肪供能。',
    targets: ['能以 5\'40"/km 完成 25〜30km 配速跑', '巅峰期周跑量 50〜70km'],
    training: 'LSD 逐步延长到 30km，马拉松配速跑从 10km 拉长到 25km 以上。',
    link: { href: '/plan/', label: '训练计划' },
  },
  {
    key: 'strength',
    title: '肌肉力量与耐力',
    why: '后半程掉速常常是腿先撑不住：骨盆下沉、步幅变小。力量训练让跑姿撑到终点，也能减少伤病。',
    targets: ['单腿提踵左右各 20 次以上', '平板支撑 60 秒以上', '30km 之后跑姿不明显变形'],
    training: '每周 2 次、每次 30 分钟的臀腿与核心训练。',
    link: { href: '/guides/strength-training/', label: '力量训练' },
  },
  {
    key: 'economy',
    title: '跑步经济性',
    why: '同样的心肺，跑姿越高效，每公里消耗的能量越少，能跑得更远。',
    targets: ['步频约 170〜180 步/分钟', '着地点靠近身体重心正下方', '上身放松，摆臂前后不交叉'],
    training: '热身后做 5〜10 分钟技术练习，并加入 4〜6 组加速跑。',
    link: { href: '/guides/running-drills/', label: '跑步技术练习' },
  },
  {
    key: 'recovery',
    title: '恢复与伤病预防',
    why: '训练只是刺激，进步发生在恢复中。能连续 16 周不受伤地练下来，本身就是一种能力。',
    targets: ['每晚睡眠 7 小时以上', '周跑量增幅不超过 10%', '每 3〜4 周一个减量周'],
    training: '跑前热身、跑后拉伸，关注晨起静息心率的变化。',
    link: { href: '/guides/recovery/', label: '恢复与伤病预防' },
  },
];
