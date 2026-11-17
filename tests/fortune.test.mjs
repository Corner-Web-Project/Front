import test from 'node:test';
import assert from 'node:assert/strict';
import { formatHour, hourDelta, skyAt, wrapHour } from '../src/utils/sky.ts';
import { kstDate, pickWeighted, seededRandom } from '../src/utils/fortuneSeed.ts';

const WEIGHTS = { 대길: 8, 중길: 20, 소길: 27, 길: 22, 말길: 13, 흉: 10 };

test('same name and KST date always give the same sequence', () => {
  const a = seededRandom('홍길동|2026-11-17');
  const b = seededRandom('홍길동|2026-11-17');
  const c = seededRandom('홍길동|2026-11-18');
  const seqA = [a(), a(), a()];
  assert.deepEqual(seqA, [b(), b(), b()]);
  assert.notDeepEqual(seqA, [c(), c(), c()]);
  for (const value of seqA) assert.ok(value >= 0 && value < 1);
});

test('KST date rolls over at 15:00 UTC', () => {
  assert.equal(kstDate(new Date('2026-11-17T14:59:00Z')), '2026-11-17');
  assert.equal(kstDate(new Date('2026-11-17T15:00:00Z')), '2026-11-18');
});

test('grade distribution follows the weights', () => {
  const random = seededRandom('distribution');
  const counts = Object.fromEntries(Object.keys(WEIGHTS).map((k) => [k, 0]));
  const n = 100_000;
  for (let i = 0; i < n; i++) counts[pickWeighted(random, WEIGHTS)] += 1;
  for (const [grade, weight] of Object.entries(WEIGHTS)) {
    assert.ok(Math.abs(counts[grade] / n - weight / 100) < 0.01, `${grade}: ${counts[grade]}`);
  }
});

test('sky is continuous across the day and wraps at midnight', () => {
  assert.deepEqual(skyAt(0), skyAt(24));
  assert.equal(skyAt(23.999).top, skyAt(0).top);
  assert.equal(skyAt(2).label, '밤');
  assert.equal(skyAt(5).label, '새벽');
  assert.equal(skyAt(8).label, '아침');
  assert.equal(skyAt(13).label, '낮');
  assert.equal(skyAt(17).label, '저녁');
  assert.equal(skyAt(21).label, '밤');
});

test('day is light with sun and clouds; night is dark with stars, moon and lanterns', () => {
  const noon = skyAt(12);
  assert.equal(noon.isLight, true);
  assert.ok(noon.sun.visible > 0.9 && noon.moon.visible === 0);
  assert.ok(noon.clouds > 0.9 && noon.stars === 0 && noon.lanterns === 0);

  const night = skyAt(23);
  assert.equal(night.isLight, false);
  assert.ok(night.moon.visible > 0.9 && night.sun.visible === 0);
  assert.ok(night.stars > 0.9 && night.lanterns === 1);

  assert.ok(skyAt(17.5).silhouette > 0.7, 'sunset turns the torii into a silhouette');
});

test('hour helpers', () => {
  assert.equal(formatHour(18.5), '18:30');
  assert.equal(formatHour(23.999), '00:00');
  assert.equal(wrapHour(-1), 23);
  assert.equal(hourDelta(23, 1), 2);
  assert.equal(hourDelta(1, 23), -2);
});
