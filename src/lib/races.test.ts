import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { gapToGoal, nextRace, personalBest, progression, type RaceSummary } from './races';

const race = (over: Partial<RaceSummary>): RaceSummary => ({
  slug: 'x',
  title: 'x',
  date: '2026-01-01',
  city: '',
  distance: 'full',
  resultSeconds: null,
  summary: '',
  ...over,
});

const races: RaceSummary[] = [
  race({ slug: 'b', date: '2025-03-01', resultSeconds: 15000 }),
  race({ slug: 'a', date: '2024-11-01', resultSeconds: 16000 }),
  race({ slug: 'c', date: '2025-11-01', resultSeconds: 15200 }),
  race({ slug: 'h', date: '2025-06-01', distance: 'half', resultSeconds: 6600 }),
  race({ slug: 'next', date: '2026-12-01' }),
];

describe('personalBest', () => {
  it('フルマラソンの最速記録を返し、ハーフは無視する', () => {
    assert.equal(personalBest(races)?.slug, 'b');
  });

  it('完走記録が無ければ null', () => {
    assert.equal(personalBest([race({})]), null);
  });
});

describe('progression', () => {
  it('日付順に並べ、PB 更新した大会に印を付ける', () => {
    assert.deepEqual(
      progression(races).map(p => [p.slug, p.isPb]),
      [
        ['a', true],
        ['b', true],
        ['c', false],
      ]
    );
  });
});

describe('nextRace', () => {
  it('今日以降で最も近い大会を返す', () => {
    assert.equal(nextRace(races, '2026-10-29')?.slug, 'next');
    assert.equal(nextRace(races, '2026-12-01')?.slug, 'next');
    assert.equal(nextRace(races, '2026-12-02'), null);
  });
});

describe('gapToGoal', () => {
  it('目標より遅ければ正', () => {
    assert.equal(gapToGoal(14500, 14400), 100);
  });
});
