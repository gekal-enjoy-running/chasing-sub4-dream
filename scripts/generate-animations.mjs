/**
 * 训练指南の動作アニメーション（棒人間の SVG）を public/animations/ に生成する。
 *
 * 使い方: npm run gen:exercises
 *
 * 動画や GIF は重く、ダークモードにも追従できないため、SMIL で動く SVG を書き出す。
 * 姿勢は「関節の絶対角度」のキーフレームで定義し、角度を補間してから座標へ変換する。
 * （座標を直接補間すると、途中で手足の長さが縮んで見えるため）
 *
 * 角度の約束: 0 = 真下、90 = 前（右）、180 = 真上、-90 = 後ろ（左）。人物は右を向く。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = join(import.meta.dirname, '..', 'public', 'animations');
const GROUND = 188;
const FPS = 24;

/** 体の各部の長さ（viewBox 単位） */
const LEN = { torso: 50, shoulder: 46, thigh: 42, shin: 40, foot: 13, upper: 28, fore: 26 };
const HEAD_R = 9;

const rad = deg => (deg * Math.PI) / 180;
const dir = deg => [Math.sin(rad(deg)), Math.cos(rad(deg))];
const add = (p, deg, len) => [p[0] + dir(deg)[0] * len, p[1] + dir(deg)[1] * len];
const angleOf = (from, to) => (Math.atan2(to[0] - from[0], to[1] - from[1]) * 180) / Math.PI;

/**
 * 2 リンクの逆運動学。origin から target へ届く 1 本目・2 本目の角度を返す。
 * bend が +1 なら 1 本目を角度の大きい側へ、-1 なら小さい側へ曲げる。
 */
function ik(origin, target, l1, l2, bend) {
  const dx = target[0] - origin[0];
  const dy = target[1] - origin[1];
  const dist = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const base = angleOf(origin, target);
  const cos = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
  const a1 = base + bend * ((Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI);
  const mid = add(origin, a1, l1);
  return [a1, angleOf(mid, target)];
}

/** 姿勢（角度の集合）から各関節の座標を求める */
function solve(pose) {
  const j = {};
  const hip0 = [0, 0];
  const legs = (hip, side) => {
    const s = side;
    let thigh = pose[`thigh${s}`] ?? 0;
    let shin = pose[`shin${s}`] ?? 0;
    const ikTarget = pose[`ik${s}`];
    if (ikTarget) [thigh, shin] = ik(hip, ikTarget.at, LEN.thigh, LEN.shin, ikTarget.bend);
    const knee = add(hip, thigh, LEN.thigh);
    const ankle = add(knee, shin, LEN.shin);
    const footAbs = pose[`foot${s}`] ?? shin + 90;
    j[`knee${s}`] = knee;
    j[`ankle${s}`] = ankle;
    j[`toe${s}`] = add(ankle, footAbs, LEN.foot);
  };
  const arms = (shoulder, side) => {
    const s = side;
    let upper = pose[`arm${s}`] ?? 0;
    let fore = pose[`fore${s}`] ?? 0;
    const ikTarget = pose[`ikArm${s}`];
    if (ikTarget) {
      const at = typeof ikTarget.at === 'string' ? j[ikTarget.at] : ikTarget.at;
      [upper, fore] = ik(shoulder, at, LEN.upper, LEN.fore, ikTarget.bend);
    }
    const elbow = add(shoulder, upper, LEN.upper);
    j[`elbow${s}`] = elbow;
    j[`hand${s}`] = add(elbow, fore, LEN.fore);
  };

  // 1 周目: 腰を原点に置いて組み立て、アンカーの位置から平行移動量を決める
  const build = hip => {
    j.hip = hip;
    j.shoulder = add(hip, pose.torso, LEN.shoulder);
    j.neck = add(hip, pose.torso, LEN.torso);
    j.head = add(j.neck, pose.head ?? pose.torso, HEAD_R + 4);
    // IK の脚は絶対座標が要るので、平行移動後の 2 周目で解く
    if (!pose.ikN) legs(hip, 'N');
    if (!pose.ikF) legs(hip, 'F');
    // 肘や手をアンカーにする姿勢（平板支撑など）のため、腕もここで一度求める
    if (!pose.ikArmN) arms(j.shoulder, 'N');
    if (!pose.ikArmF) arms(j.shoulder, 'F');
  };
  build(hip0);
  const [name, x, y] = pose.anchor;
  const shift = [x - j[name][0], y - j[name][1]];
  build([shift[0], shift[1]]);
  if (pose.ikN) legs(j.hip, 'N');
  if (pose.ikF) legs(j.hip, 'F');
  arms(j.shoulder, 'N');
  arms(j.shoulder, 'F');
  return j;
}

/** 数値・座標（[x, y]）・IK 指定を補間する。文字列などはそのまま from を使う */
function lerp(a, b, t) {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t;
  if (Array.isArray(a) && Array.isArray(b))
    return a.map((v, i) => (typeof v === 'number' ? v + (b[i] - v) * t : v));
  if (a && b && typeof a === 'object') {
    const out = {};
    for (const key of Object.keys(a)) out[key] = lerp(a[key], b[key], t);
    return out;
  }
  return a;
}

const ease = t => (1 - Math.cos(Math.PI * t)) / 2;

/** キーフレーム列 [{ pose, dur }] をフレーム列（関節座標）へ展開する。最後は先頭へ戻る */
function frames(keys) {
  const out = [];
  keys.forEach((key, i) => {
    const next = keys[(i + 1) % keys.length];
    const n = Math.max(1, Math.round(key.dur * FPS));
    for (let f = 0; f < n; f++) {
      const t = ease(f / n);
      const pose = {};
      for (const k of new Set([...Object.keys(key.pose), ...Object.keys(next.pose)])) {
        pose[k] = lerp(key.pose[k] ?? next.pose[k], next.pose[k] ?? key.pose[k], t);
      }
      out.push(solve(pose));
    }
  });
  out.push(out[0]);
  return out;
}

const fmt = n => (Math.round(n * 10) / 10).toString();
const pt = p => `${fmt(p[0])} ${fmt(p[1])}`;
const chain = (j, names) => `M${names.map(n => pt(j[n])).join('L')}`;

const CHAINS = {
  legF: ['hip', 'kneeF', 'ankleF', 'toeF'],
  armF: ['shoulder', 'elbowF', 'handF'],
  torso: ['hip', 'neck'],
  legN: ['hip', 'kneeN', 'ankleN', 'toeN'],
  armN: ['shoulder', 'elbowN', 'handN'],
};
// 奥の手足 → 胴 → 手前の手足の順に描き、手前が上に重なるようにする
const ORDER = [
  ['legF', 'f'],
  ['armF', 'f'],
  ['torso', 'n'],
  ['legN', 'n'],
  ['armN', 'n'],
];

function propSvg(prop, first) {
  switch (prop.type) {
    case 'wall': {
      const x = fmt(first[prop.at][0] + 4);
      return `<line class="p" x1="${x}" y1="20" x2="${x}" y2="${GROUND}" stroke-width="5"/>`;
    }
    case 'bench':
      return `<rect class="b" x="${prop.x}" y="${prop.y}" width="${prop.w}" height="${GROUND - prop.y}" rx="3"/>`;
    case 'step':
      return `<rect class="b" x="${prop.x}" y="${GROUND - prop.h}" width="${prop.w}" height="${prop.h}" rx="2"/>`;
    case 'mat':
      return `<rect class="b" x="${prop.x}" y="${GROUND - 3}" width="${prop.w}" height="4" rx="2"/>`;
    default:
      return '';
  }
}

function render(ex) {
  const fs = frames(ex.keys);
  const total = ex.keys.reduce((s, k) => s + Math.max(1, Math.round(k.dur * FPS)), 0) / FPS;
  const dur = `${fmt(total)}s`;
  const anim = (attr, values) =>
    `<animate attributeName="${attr}" dur="${dur}" repeatCount="indefinite" values="${values}"/>`;
  const paths = ORDER.map(
    ([name, cls]) =>
      `<path class="${cls}" d="${chain(fs[0], CHAINS[name])}">${anim('d', fs.map(j => chain(j, CHAINS[name])).join(';'))}</path>`
  ).join('');
  const head =
    `<circle class="h" r="${HEAD_R}" cx="${fmt(fs[0].head[0])}" cy="${fmt(fs[0].head[1])}">` +
    anim('cx', fs.map(j => fmt(j.head[0])).join(';')) +
    anim('cy', fs.map(j => fmt(j.head[1])).join(';')) +
    '</circle>';
  const props = (ex.props ?? []).map(p => propSvg(p, fs[0])).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" width="240" height="200" role="img" aria-label="${ex.title}">
<title>${ex.title}</title>
<style>
path{fill:none;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
.n{stroke:#c2410c}.f{stroke:#fdba74}.h{fill:#c2410c}
.g{stroke:#d6d3d1}.p{stroke:#a8a29e}.b{fill:#e7e5e4;stroke:#a8a29e;stroke-width:1.5}
@media (prefers-color-scheme:dark){.n{stroke:#fb923c}.f{stroke:#9a3412}.h{fill:#fb923c}.g{stroke:#44403c}.p{stroke:#78716c}.b{fill:#292524;stroke:#57534e}}
</style>
<line class="g" x1="8" y1="${GROUND + 2}" x2="232" y2="${GROUND + 2}" stroke-width="2"/>
${props}${paths}${head}
</svg>
`;
}

// ---- 姿勢の部品 ----------------------------------------------------------

const STAND = {
  torso: 180,
  thighN: 0,
  shinN: 0,
  thighF: 0,
  shinF: 0,
  armN: 0,
  foreN: 10,
  armF: 0,
  foreF: 10,
};
/** 腰に手を当てる */
const HANDS_ON_HIPS = { armN: -25, foreN: 65, armF: -25, foreF: 65 };
/** 走るときの腕振り（N が前） */
const SWING_N = { armN: 40, foreN: 130, armF: -40, foreF: 40 };
const SWING_F = { armN: -40, foreN: 40, armF: 40, foreF: 130 };
/** 仰向けで寝るときの基準。頭が左 */
const LYING_Y = GROUND - 8;

// ---- 動作の定義 ----------------------------------------------------------

const EXERCISES = [
  {
    id: 'leg-swing',
    title: '前后摆腿',
    props: [{ type: 'wall', at: 'handN' }],
    keys: [
      {
        dur: 0.8,
        pose: {
          ...STAND,
          torso: 176,
          thighN: 60,
          shinN: 45,
          armN: 100,
          foreN: 95,
          armF: 10,
          foreF: 20,
          anchor: ['ankleF', 100, GROUND - 3],
        },
      },
      {
        dur: 0.8,
        pose: {
          ...STAND,
          torso: 176,
          thighN: -35,
          shinN: -55,
          armN: 100,
          foreN: 95,
          armF: 10,
          foreF: 20,
          anchor: ['ankleF', 100, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'lunge',
    title: '弓步',
    keys: [
      {
        dur: 1,
        pose: {
          ...STAND,
          ...HANDS_ON_HIPS,
          thighN: 20,
          shinN: 15,
          thighF: -20,
          shinF: -25,
          footF: 45,
          anchor: ['ankleN', 150, GROUND - 3],
        },
      },
      {
        dur: 1,
        pose: {
          ...STAND,
          ...HANDS_ON_HIPS,
          thighN: 88,
          shinN: 0,
          thighF: -12,
          shinF: -95,
          footF: 66,
          anchor: ['ankleN', 150, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'glute-bridge',
    title: '臀桥',
    props: [{ type: 'mat', x: 30, w: 180 }],
    keys: [
      {
        dur: 1,
        pose: {
          torso: -90,
          head: -90,
          ikN: { at: [176, GROUND - 3], bend: 1 },
          ikF: { at: [172, GROUND - 3], bend: 1 },
          footN: 90,
          footF: 90,
          armN: 90,
          foreN: 90,
          armF: 90,
          foreF: 90,
          anchor: ['shoulder', 64, LYING_Y],
        },
      },
      {
        dur: 1,
        pose: {
          torso: -70,
          head: -90,
          ikN: { at: [176, GROUND - 3], bend: 1 },
          ikF: { at: [172, GROUND - 3], bend: 1 },
          footN: 90,
          footF: 90,
          armN: 90,
          foreN: 90,
          armF: 90,
          foreF: 90,
          anchor: ['shoulder', 64, LYING_Y],
        },
      },
    ],
  },
  {
    id: 'high-knees',
    title: '高抬腿',
    keys: [
      {
        dur: 0.3,
        pose: {
          ...STAND,
          ...SWING_F,
          thighN: 90,
          shinN: 0,
          footN: 70,
          anchor: ['hip', 110, 100],
        },
      },
      {
        dur: 0.3,
        pose: {
          ...STAND,
          ...SWING_N,
          thighF: 90,
          shinF: 0,
          footF: 70,
          anchor: ['hip', 110, 100],
        },
      },
    ],
  },
  {
    id: 'quick-steps',
    title: '小步跑',
    keys: [
      {
        dur: 0.18,
        pose: {
          ...STAND,
          ...SWING_F,
          armN: -25,
          armF: 25,
          thighN: 30,
          shinN: -5,
          footN: 75,
          anchor: ['hip', 110, 104],
        },
      },
      {
        dur: 0.18,
        pose: {
          ...STAND,
          ...SWING_N,
          armN: 25,
          armF: -25,
          thighF: 30,
          shinF: -5,
          footF: 75,
          anchor: ['hip', 110, 104],
        },
      },
    ],
  },
  {
    id: 'butt-kicks',
    title: '后踢腿',
    keys: [
      {
        dur: 0.3,
        pose: {
          ...STAND,
          ...SWING_F,
          thighN: -5,
          shinN: -165,
          footN: -110,
          anchor: ['hip', 110, 102],
        },
      },
      {
        dur: 0.3,
        pose: {
          ...STAND,
          ...SWING_N,
          thighF: -5,
          shinF: -165,
          footF: -110,
          anchor: ['hip', 110, 102],
        },
      },
    ],
  },
  {
    id: 'straight-leg-run',
    title: '直腿跑',
    keys: [
      {
        dur: 0.35,
        pose: {
          ...STAND,
          ...SWING_F,
          thighN: 45,
          shinN: 45,
          thighF: -10,
          shinF: -10,
          anchor: ['hip', 110, 106],
        },
      },
      {
        dur: 0.35,
        pose: {
          ...STAND,
          ...SWING_N,
          thighN: -10,
          shinN: -10,
          thighF: 45,
          shinF: 45,
          anchor: ['hip', 110, 106],
        },
      },
    ],
  },
  {
    id: 'calf-stretch',
    title: '小腿拉伸（弓步推墙）',
    props: [{ type: 'wall', at: 'handN' }],
    keys: [
      {
        dur: 1.6,
        pose: {
          torso: 160,
          thighF: 15,
          shinF: -5,
          thighN: -25,
          shinN: -25,
          footN: 90,
          armN: 112,
          foreN: 100,
          armF: 108,
          foreF: 98,
          anchor: ['ankleN', 70, GROUND - 3],
        },
      },
      {
        dur: 1.6,
        pose: {
          torso: 152,
          thighF: 30,
          shinF: -15,
          thighN: -32,
          shinN: -32,
          footN: 90,
          armN: 112,
          foreN: 100,
          armF: 108,
          foreF: 98,
          anchor: ['ankleN', 70, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'quad-stretch',
    title: '大腿前侧拉伸',
    keys: [
      {
        dur: 1.5,
        pose: {
          ...STAND,
          thighN: -10,
          shinN: -158,
          footN: -80,
          ikArmN: { at: 'ankleN', bend: -1 },
          armF: 80,
          foreF: 85,
          anchor: ['ankleF', 110, GROUND - 3],
        },
      },
      {
        dur: 1.5,
        pose: {
          ...STAND,
          thighN: -22,
          shinN: -162,
          footN: -80,
          ikArmN: { at: 'ankleN', bend: -1 },
          armF: 80,
          foreF: 85,
          anchor: ['ankleF', 110, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'hamstring-stretch',
    title: '大腿后侧拉伸',
    keys: [
      {
        dur: 1.5,
        pose: {
          torso: 140,
          thighN: 25,
          shinN: 25,
          footN: 160,
          thighF: -8,
          shinF: -25,
          ikArmN: { at: 'kneeN', bend: -1 },
          ikArmF: { at: 'kneeN', bend: -1 },
          anchor: ['ankleF', 100, GROUND - 3],
        },
      },
      {
        dur: 1.5,
        pose: {
          torso: 122,
          thighN: 25,
          shinN: 25,
          footN: 160,
          thighF: -14,
          shinF: -32,
          ikArmN: { at: 'kneeN', bend: -1 },
          ikArmF: { at: 'kneeN', bend: -1 },
          anchor: ['ankleF', 100, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'hip-flexor-stretch',
    title: '髋屈肌拉伸（半跪弓步）',
    props: [{ type: 'mat', x: 30, w: 170 }],
    keys: [
      {
        dur: 1.5,
        pose: {
          torso: 180,
          thighN: 88,
          shinN: 0,
          thighF: -5,
          shinF: -90,
          footF: -100,
          armN: 40,
          foreN: 85,
          armF: 35,
          foreF: 80,
          anchor: ['ankleN', 150, GROUND - 3],
        },
      },
      {
        dur: 1.5,
        pose: {
          torso: 182,
          thighN: 100,
          shinN: -20,
          thighF: -40,
          shinF: -90,
          footF: -100,
          armN: 50,
          foreN: 95,
          armF: 45,
          foreF: 90,
          anchor: ['ankleN', 150, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'squat',
    title: '深蹲',
    keys: [
      {
        dur: 1,
        pose: {
          ...STAND,
          armN: 90,
          foreN: 90,
          armF: 88,
          foreF: 88,
          anchor: ['ankleN', 120, GROUND - 3],
        },
      },
      {
        dur: 1,
        pose: {
          torso: 145,
          thighN: 82,
          shinN: -30,
          thighF: 82,
          shinF: -30,
          armN: 95,
          foreN: 95,
          armF: 93,
          foreF: 93,
          anchor: ['ankleN', 120, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'split-squat',
    title: '保加利亚分腿蹲',
    props: [{ type: 'bench', x: 22, y: 150, w: 50 }],
    keys: [
      {
        dur: 1.1,
        pose: {
          torso: 172,
          ...HANDS_ON_HIPS,
          thighN: 10,
          shinN: 5,
          ikF: { at: [58, 146], bend: 1 },
          footF: -60,
          anchor: ['ankleN', 140, GROUND - 3],
        },
      },
      {
        dur: 1.1,
        pose: {
          torso: 168,
          ...HANDS_ON_HIPS,
          thighN: 85,
          shinN: -10,
          ikF: { at: [58, 146], bend: 1 },
          footF: -60,
          anchor: ['ankleN', 140, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'single-leg-bridge',
    title: '单腿臀桥',
    props: [{ type: 'mat', x: 30, w: 180 }],
    keys: [
      {
        dur: 1,
        pose: {
          torso: -90,
          head: -90,
          ikN: { at: [176, GROUND - 3], bend: 1 },
          footN: 90,
          thighF: 125,
          shinF: 125,
          armN: 90,
          foreN: 90,
          armF: 90,
          foreF: 90,
          anchor: ['shoulder', 64, LYING_Y],
        },
      },
      {
        dur: 1,
        pose: {
          torso: -70,
          head: -90,
          ikN: { at: [176, GROUND - 3], bend: 1 },
          footN: 90,
          thighF: 110,
          shinF: 110,
          armN: 90,
          foreN: 90,
          armF: 90,
          foreF: 90,
          anchor: ['shoulder', 64, LYING_Y],
        },
      },
    ],
  },
  {
    id: 'calf-raise',
    title: '单腿提踵',
    props: [{ type: 'wall', at: 'handN' }],
    keys: [
      {
        dur: 0.8,
        pose: {
          ...STAND,
          footN: 90,
          thighF: 5,
          shinF: -100,
          footF: -10,
          armN: 100,
          foreN: 95,
          armF: 5,
          foreF: 15,
          anchor: ['toeN', 120, GROUND - 3],
        },
      },
      {
        dur: 0.8,
        pose: {
          ...STAND,
          footN: 40,
          thighF: 5,
          shinF: -100,
          footF: -10,
          armN: 100,
          foreN: 95,
          armF: 5,
          foreF: 15,
          anchor: ['toeN', 120, GROUND - 3],
        },
      },
    ],
  },
  {
    id: 'plank',
    title: '平板支撑',
    props: [{ type: 'mat', x: 20, w: 200 }],
    keys: [
      {
        dur: 1.5,
        pose: {
          torso: 100,
          thighN: -80,
          shinN: -80,
          thighF: -80,
          shinF: -80,
          footN: 2,
          footF: 2,
          armN: 0,
          foreN: 90,
          armF: 0,
          foreF: 90,
          anchor: ['elbowN', 150, GROUND - 4],
        },
      },
      {
        dur: 1.5,
        pose: {
          torso: 99,
          thighN: -81,
          shinN: -81,
          thighF: -81,
          shinF: -81,
          footN: 2,
          footF: 2,
          armN: 0,
          foreN: 90,
          armF: 0,
          foreF: 90,
          anchor: ['elbowN', 150, GROUND - 4],
        },
      },
    ],
  },
  {
    id: 'dead-bug',
    title: '死虫',
    props: [{ type: 'mat', x: 20, w: 200 }],
    keys: [
      {
        dur: 0.6,
        pose: {
          torso: -90,
          head: -90,
          thighN: 180,
          shinN: 90,
          thighF: 180,
          shinF: 90,
          armN: 180,
          foreN: 180,
          armF: 180,
          foreF: 180,
          anchor: ['shoulder', 64, LYING_Y],
        },
      },
      {
        dur: 0.9,
        pose: {
          torso: -90,
          head: -90,
          thighN: 180,
          shinN: 90,
          thighF: 100,
          shinF: 100,
          armN: -100,
          foreN: -100,
          armF: 180,
          foreF: 180,
          anchor: ['shoulder', 64, LYING_Y],
        },
      },
      {
        dur: 0.6,
        pose: {
          torso: -90,
          head: -90,
          thighN: 180,
          shinN: 90,
          thighF: 180,
          shinF: 90,
          armN: 180,
          foreN: 180,
          armF: 180,
          foreF: 180,
          anchor: ['shoulder', 64, LYING_Y],
        },
      },
      {
        dur: 0.9,
        pose: {
          torso: -90,
          head: -90,
          thighN: 100,
          shinN: 100,
          thighF: 180,
          shinF: 90,
          armN: 180,
          foreN: 180,
          armF: -100,
          foreF: -100,
          anchor: ['shoulder', 64, LYING_Y],
        },
      },
    ],
  },
  {
    id: 'bird-dog',
    title: '鸟狗',
    props: [{ type: 'mat', x: 20, w: 200 }],
    keys: [
      {
        dur: 0.9,
        pose: {
          torso: 105,
          head: 110,
          thighN: 0,
          shinN: -90,
          footN: -90,
          thighF: 0,
          shinF: -90,
          footF: -90,
          armN: 0,
          foreN: 0,
          armF: 0,
          foreF: 0,
          anchor: ['kneeN', 90, GROUND - 4],
        },
      },
      {
        dur: 1.3,
        pose: {
          torso: 100,
          head: 105,
          thighN: 0,
          shinN: -90,
          footN: -90,
          thighF: -88,
          shinF: -88,
          footF: -88,
          armN: 98,
          foreN: 98,
          armF: 0,
          foreF: 0,
          anchor: ['kneeN', 90, GROUND - 4],
        },
      },
    ],
  },
];

mkdirSync(OUT_DIR, { recursive: true });
for (const ex of EXERCISES) {
  const svg = render(ex);
  writeFileSync(join(OUT_DIR, `${ex.id}.svg`), svg);
  console.log(`public/animations/${ex.id}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}
