import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evenSplits, formatDuration, formatPace, parseDuration, paceFromTime } from './time';

describe('parseDuration', () => {
  it('H:MM:SS と MM:SS を秒にする', () => {
    assert.equal(parseDuration('3:59:59'), 14399);
    assert.equal(parseDuration('45:30'), 2730);
  });

  it('不正な値は null', () => {
    assert.equal(parseDuration(''), null);
    assert.equal(parseDuration('4:60:00'), null);
    assert.equal(parseDuration('abc'), null);
    assert.equal(parseDuration('1:2:3:4'), null);
  });
});

describe('formatDuration', () => {
  it('1 時間以上は H:MM:SS、未満は MM:SS', () => {
    assert.equal(formatDuration(14399), '3:59:59');
    assert.equal(formatDuration(2730), '45:30');
  });
});

describe('formatPace', () => {
  it('破四ペースは 5\'41"', () => {
    assert.equal(formatPace(paceFromTime(4 * 3600)), '5\'41"');
  });

  it('59.6 秒は繰り上げて分に反映する', () => {
    assert.equal(formatPace(359.6), '6\'00"');
  });
});

describe('evenSplits', () => {
  it('5km ごと＋中間点＋ゴールを昇順で返し、ゴールは目標タイムと一致する', () => {
    const splits = evenSplits(4 * 3600);
    assert.deepEqual(
      splits.map(s => s.km),
      [5, 10, 15, 20, 21.0975, 25, 30, 35, 40, 42.195]
    );
    assert.equal(splits.at(-1)?.elapsed, 14400);
    assert.equal(splits[0].elapsed, 1706);
  });
});
