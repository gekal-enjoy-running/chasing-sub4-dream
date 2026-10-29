/**
 * 动作库のカテゴリ。順序がそのまま一覧の表示順になる。
 * guide は、そのカテゴリを詳しく説明している训练指南のページ。
 */
export const EXERCISE_CATEGORIES = [
  { key: 'warm-up', label: '热身', guide: '/guides/warm-up/' },
  { key: 'stretch', label: '拉伸', guide: '/guides/cool-down-stretch/' },
  { key: 'strength', label: '力量', guide: '/guides/strength-training/' },
  { key: 'drills', label: '跑步技术', guide: '/guides/running-drills/' },
] as const;

export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number]['key'];
