import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { daysBetween, formatDate, todayLocal } from './format-date';

describe('formatDate', () => {
  it('YYYY-MM-DD を中国語表記にする（月日のゼロ埋めなし）', () => {
    assert.equal(formatDate('2026-03-01'), '2026年3月1日');
  });

  it('形式外の値はそのまま返す', () => {
    assert.equal(formatDate('2026/03/01'), '2026/03/01');
  });
});

describe('daysBetween', () => {
  it('月・年をまたいでも日数を返す', () => {
    assert.equal(daysBetween('2026-12-30', '2027-01-02'), 3);
    assert.equal(daysBetween('2026-03-10', '2026-03-01'), -9);
  });
});

describe('todayLocal', () => {
  it('ローカル時刻の日付を返す', () => {
    assert.equal(todayLocal(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  });
});
