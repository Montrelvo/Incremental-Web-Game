import { describe, expect, it } from 'vitest';
import { freshState, parseSave, prestige, resume } from './engine';
import { enemy, queueShots, fireShot, cancelShots } from './combat';

describe('spark artillery', () => {
  it('charges once up front, deals 2 HP per spark, and refunds only unfired shots', () => {
    let s = { ...freshState(), sparks: 20 };
    s = queueShots(s, 2, 5); expect(s.sparks).toBe(10);
    s = fireShot(s); expect(s.combat.hp).toBe(6);
    s = cancelShots(s); expect(s.sparks).toBe(18); expect(s.combat.queue).toEqual([]);
    expect(s.earned).toBe(0);
  });
  it('rejects overspending, fractional charges, and queue overflow', () => {
    const s = { ...freshState(), sparks: 100 };
    expect(queueShots(s, 101, 1)).toBe(s);
    expect(queueShots(s, 1.5, 1)).toBe(s);
    expect(queueShots(s, NaN, 1)).toBe(s);
    let full = s; for (let i = 0; i < 5; i++) full = queueShots(full, 1, 10);
    expect(queueShots(full, 1, 1)).toBe(full);
  });
  it('plays exactly eight mobs, one mini boss, and one boss in every stage', () => {
    let s = { ...freshState(), sparks: 100000 };
    for (let stage = 1; stage <= 10; stage++) {
      const kinds: string[] = [];
      for (let i = 0; i < 10; i++) {
        expect(s.combat.stage).toBe(stage); expect(s.combat.encounter).toBe(i);
        const target = enemy(stage, i); kinds.push(target.kind);
        expect(s.combat.hp).toBe(target.hp);
        s = fireShot(queueShots(s, Math.ceil(target.hp / 2), 1));
      }
      expect(kinds.filter(k => k === 'Metal mob')).toHaveLength(8);
      expect(kinds[4]).toBe('Mini boss'); expect(kinds[9]).toBe('Stage boss');
    }
    expect(s.combat.complete).toBe(true); expect(s.combat.defeated).toBe(100);
    expect(parseSave(JSON.stringify(s))).toEqual(s);
  });
  it('does not spill damage and refunds excess queued shots at completion', () => {
    let s = { ...freshState(), sparks: 1000 };
    s = fireShot(queueShots(s, 100, 1)); expect(s.combat.hp).toBe(10); expect(s.combat.defeated).toBe(1);
    s.combat = { stage: 10, encounter: 9, defeated: 99, hp: 2, complete: false, queue: [1, 5, 10] };
    s = fireShot(s); expect(s.sparks).toBe(915); expect(s.combat.queue).toEqual([]);
  });
  it('migrates old saves and preserves paid queue across reload, offline time, and prestige', () => {
    const old = JSON.parse(JSON.stringify(freshState())); delete old.combat; delete old.sound;
    expect(parseSave(JSON.stringify(old)).combat.hp).toBe(10);
    let s = queueShots({ ...freshState(), sparks: 100, earned: 10000 }, 5, 5);
    s = parseSave(JSON.stringify(s));
    expect(resume(s, s.lastSaved + 600000).state.combat).toEqual(s.combat);
    expect(prestige(s).combat).toEqual(s.combat);
    expect(() => parseSave(JSON.stringify({ ...s, combat: { ...s.combat, queue: [-1] } }))).toThrow();
  });
});
