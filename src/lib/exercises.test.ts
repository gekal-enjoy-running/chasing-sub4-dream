import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { groupByCategory, isCategory, neighbors, type ExerciseSummary } from './exercises';

const ex = (over: Partial<ExerciseSummary>): ExerciseSummary => ({
  slug: 'x',
  title: 'x',
  category: 'strength',
  summary: '',
  dosage: '',
  equipment: [],
  muscles: [],
  order: 1,
  ...over,
});

const list = [
  ex({ slug: 'squat', category: 'strength', order: 1 }),
  ex({ slug: 'plank', category: 'strength', order: 6 }),
  ex({ slug: 'bridge', category: 'strength', order: 3 }),
  ex({ slug: 'swing', category: 'warm-up', order: 1 }),
  ex({ slug: 'calf', category: 'stretch', order: 1 }),
];

describe('isCategory', () => {
  it('定義済みのキーだけを受け付ける', () => {
    assert.equal(isCategory('stretch'), true);
    assert.equal(isCategory('yoga'), false);
    assert.equal(isCategory(undefined), false);
  });
});

describe('groupByCategory', () => {
  it('カテゴリの定義順に並べ、空のカテゴリは出さない', () => {
    const groups = groupByCategory(list);
    assert.deepEqual(
      groups.map(g => g.key),
      ['warm-up', 'stretch', 'strength']
    );
    assert.deepEqual(
      groups[2].exercises.map(e => e.slug),
      ['squat', 'bridge', 'plank']
    );
  });
});

describe('neighbors', () => {
  it('同じカテゴリ内の前後を返す', () => {
    const { prev, next } = neighbors(list, 'bridge');
    assert.equal(prev?.slug, 'squat');
    assert.equal(next?.slug, 'plank');
  });

  it('カテゴリの端では片側が undefined', () => {
    assert.equal(neighbors(list, 'swing').prev, undefined);
    assert.equal(neighbors(list, 'swing').next, undefined);
  });

  it('存在しない slug は両方 undefined', () => {
    assert.deepEqual(neighbors(list, 'nope'), { prev: undefined, next: undefined });
  });
});
