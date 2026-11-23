import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isZoneKey, paceZone, paceZones } from './training';

const SUB4 = 4 * 3600;

describe('paceZones', () => {
  it('破四目標では计划ページと同じペース帯になる', () => {
    const byKey = Object.fromEntries(paceZones(SUB4).map(z => [z.key, z.paceText]));
    assert.equal(byKey.easy, '6\'19"〜6\'50"');
    assert.equal(byKey.marathon, '5\'34"〜5\'41"');
    assert.equal(byKey.threshold, '5\'05"〜5\'15"');
    assert.equal(byKey.interval, '4\'50"〜5\'00"');
  });

  it('速い側が必ず遅い側より小さい', () => {
    for (const zone of paceZones(SUB4)) assert.ok(zone.pace[0] < zone.pace[1], zone.key);
  });

  it('完赛时间が遅いほど各区间も遅くなる', () => {
    const fast = paceZone(SUB4, 'threshold');
    const slow = paceZone(4 * 3600 + 21 * 60 + 24, 'threshold');
    assert.ok(fast && slow && slow.pace[0] > fast.pace[0]);
  });
});

describe('isZoneKey', () => {
  it('定義済みの区间だけを受け付ける', () => {
    assert.equal(isZoneKey('threshold'), true);
    assert.equal(isZoneKey('sprint'), false);
  });
});
