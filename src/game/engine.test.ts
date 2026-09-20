import { describe, it, expect } from 'vitest';
import { freshState, advance, gather, buy, hire, cost, cycleYield, startCycle, upgrade, prestige, prestigeReward, parseSave, resume, OFFLINE_CAP } from './engine';

describe('shared workshop simulation', () => {
  it('plays the opening loop without granting unaffordable purchases', () => {
    let s = freshState(); expect(buy(s, 0)).toBe(s);
    for (let n = 0; n < 12; n++) s = gather(s);
    s = buy(s, 0); expect(s.sparks).toBe(0); expect(s.machines[0].owned).toBe(1);
    s = startCycle(s, 0); s = advance(s, 3); expect(s.sparks).toBe(3);
    expect(advance(s, 100).sparks).toBe(3); // manual machines do not restart
  });
  it('automated machines produce the same result in one offline jump or small ticks', () => {
    let s = freshState(); s.sparks = 100; s = hire(buy(s, 0), 0);
    const whole = advance(s, 1000); let stepped = s;
    for (let n = 0; n < 5000; n++) stepped = advance(stepped, .2);
    expect(stepped.sparks).toBeCloseTo(whole.sparks, 6);
    expect(stepped.machines[0].remaining).toBeCloseTo(whole.machines[0].remaining, 6);
  });
  it('milestones and upgrades multiply, and bulk purchases match singles', () => {
    let s = freshState(); s.sparks = 10000;
    const bulk = buy(s, 0, 10); let singles = s;
    for (let n = 0; n < 10; n++) singles = buy(singles, 0);
    expect(bulk.sparks).toBe(singles.sparks); expect(cycleYield(bulk, 0)).toBe(60);
    expect(cycleYield(upgrade(bulk, 'wiring'), 0)).toBe(120);
    expect(cost(bulk, 0, 0)).toBe(Infinity);
  });
  it('caps offline time and ignores clocks moving backwards', () => {
    const s = freshState(100000); s.machines[0] = { owned: 1, manager: true, remaining: 3 };
    expect(resume(s, 0).gained).toBe(0);
    expect(resume(s, 100000 + 1000 * 86400).gained).toBe(OFFLINE_CAP);
  });
  it('rekindles with a previewable reward and keeps permanent progress', () => {
    const s = freshState(); s.earned = 40000; s.lifetime = 50000; s.cores = 2; s.mastered = true;
    s.machines[0] = { owned: 10, manager: true, remaining: 3 };
    expect(prestigeReward(s)).toBe(2);
    const p = prestige(s); expect(p.cores).toBe(4); expect(p.sparks).toBe(0);
    expect(p.lifetime).toBe(50000); expect(p.mastered).toBe(true); expect(p.resets).toBe(1);
    expect(p.discoveries).toEqual(expect.arrayContaining([0, 1, 2, 4]));
    expect(p.machines.every(m => !m.manager && !m.owned)).toBe(true);
  });
  it('completes the chapter only after reaching the goal with all managers', () => {
    let s = freshState(); s.lifetime = 24999;
    s = gather(s); expect(s.mastered).toBe(false);
    s.machines = s.machines.map(() => ({ owned: 1, manager: true, remaining: 1 }));
    s = advance(s, 1); expect(s.mastered).toBe(true);
  });
  it('rejects corrupted and unsupported saves', () => {
    const s = freshState(); expect(parseSave(JSON.stringify(s))).toEqual(s);
    expect(() => parseSave('{')).toThrow(); expect(() => parseSave(JSON.stringify({ ...s, version: 2 }))).toThrow();
    expect(() => parseSave(JSON.stringify({ ...s, sparks: -1 }))).toThrow();
    expect(() => parseSave(JSON.stringify({ ...s, upgrades: ['nope'] }))).toThrow();
    s.machines[0].owned = 1000; expect(() => parseSave(JSON.stringify(s))).toThrow();
  });
});
