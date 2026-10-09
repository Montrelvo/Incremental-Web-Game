import { describe, expect, it } from 'vitest';
import { advance, buy, cost, freshState, gather, hire, parseSave, prestige, resume, type GameState } from './engine';
import { activateDefense, beginPush, cancelSupport, coilStats, fillCapacitor, ownershipLimit, queueSupport, repairBunker, SECTORS, setRefill, tickFrontier, upgradeCoil } from './frontier';
function prepared(sparks = 100): GameState {
  return activateDefense(setRefill(fillCapacitor({ ...freshState(), sparks }), 2));
}
function second(s: GameState) { return tickFrontier(advance(s, 1)); }

describe('unified bunker frontier', () => {
  it('conserves prepaid energy and refunds unfired support without counting earnings', () => {
    const initial = { ...freshState(), sparks: 100, earned: 100, lifetime: 100 };
    let s = fillCapacitor(initial);
    expect(s.sparks).toBe(70); expect(s.frontier.capacitor).toBe(30);
    s = activateDefense(s); s = queueSupport(s, 4, 5);
    expect(s.sparks).toBe(50); expect(s.frontier.queue).toHaveLength(5);
    s = cancelSupport(s); expect(s.sparks).toBe(70);
    expect(s.earned).toBe(100); expect(s.lifetime).toBe(100);
    expect(fillCapacitor(s)).toBe(s);
    expect(queueSupport(s, 1.5, 1)).toBe(s);
    expect(queueSupport(s, 1000, 1)).toBe(s);
  });
  it('shares targets between Tesla and cannon and awards each kill once', () => {
    let s = prepared(); s.frontier.refill = 0;
    s.frontier.mobs = [{ id: 1, sector: 0, encounter: 0, campaign: false, hp: 8, position: 8 }];
    s.frontier.nextId = 2; s.frontier.spawnIn = 6;
    s = tickFrontier(queueSupport(s, 1, 1));
    expect(s.frontier.defeated).toBe(1); expect(s.frontier.scrap).toBe(2);
    expect(s.frontier.capacitor).toBe(28); expect(s.frontier.queue).toEqual([]);
    s = tickFrontier(s); expect(s.frontier.scrap).toBe(2);
    expect(s.frontier.capacitor).toBe(28); // no idle drain
  });
  it('retains unfired cannon charges when a Tesla pulse kills the only target', () => {
    let s = prepared(); s.frontier.mobs = [{ id: 1, sector: 0, encounter: 0, campaign: false, hp: 6, position: 8 }];
    s.frontier.nextId = 2; s.frontier.spawnIn = 6;
    s = tickFrontier(queueSupport(s, 5, 1));
    expect(s.frontier.scrap).toBe(2); expect(s.frontier.queue).toEqual([5]);
  });
  it('an energy shortage skips pulses; defeat preserves progression and refunds reserves', () => {
    let s = prepared(); s.frontier.claimed = 1; s.frontier.scrap = 20; s.frontier.upgrades.discharge = 2;
    s.machines[0] = { owned: 2, manager: true, remaining: 3 }; s.cores = 3;
    s.frontier.integrity = 6; s.frontier.refill = 0; s.frontier.capacitor = 1;
    s.frontier.mobs = [{ id: 1, sector: 0, encounter: 0, campaign: false, hp: 8, position: 1 }];
    s.frontier.nextId = 2;
    s = queueSupport(s, 3, 2); const prior = s.sparks;
    s = tickFrontier(s);
    expect(s.frontier.active).toBe(false); expect(s.frontier.integrity).toBe(0);
    expect(s.sparks).toBe(prior + 7); expect(s.frontier.capacitor).toBe(0); expect(s.frontier.queue).toEqual([]);
    expect(s.frontier.scrap).toBe(20); expect(s.frontier.claimed).toBe(1);
    expect(s.frontier.upgrades.discharge).toBe(2); expect(s.machines[0].owned).toBe(2); expect(s.cores).toBe(3);
    expect(parseSave(JSON.stringify(s))).toEqual(s);
  });
  it('permits recovery from an empty balance through manual generation', () => {
    let s = freshState(); s.frontier.integrity = 0;
    expect(repairBunker(s)).toBe(s); expect(activateDefense(s)).toBe(s);
    for (let i = 0; i < 50; i++) s = gather(s);
    s = repairBunker(s); expect(s.sparks).toBe(0); expect(s.frontier.integrity).toBe(100);
    expect(s.frontier.active).toBe(false);
    for (let i = 0; i < 2; i++) s = gather(s);
    s = activateDefense(fillCapacitor(s)); expect(s.frontier.active).toBe(true);
  });
  it('fails a push on an escaped enemy without granting a claim or deleting territory', () => {
    let s = beginPush(prepared()); s.frontier.capacitor = 0; s.frontier.refill = 0;
    s.frontier.push!.spawned = 2;
    s.frontier.mobs = [
      { id: 1, sector: 0, encounter: 0, campaign: true, hp: 8, position: 1 },
      { id: 2, sector: 0, encounter: 1, campaign: true, hp: 8, position: 10 },
    ]; s.frontier.nextId = 3;
    s = tickFrontier(s);
    expect(s.frontier.push).toBeNull(); expect(s.frontier.claimed).toBe(0);
    expect(s.frontier.scrap).toBe(0); expect(s.frontier.integrity).toBe(94);
    expect(s.frontier.mobs[0].campaign).toBe(false);
    expect(parseSave(JSON.stringify(s))).toEqual(s); // surviving enemy retains its HP/type
  });
  it('grants each claim reward once and raises capacity only after successful progression', () => {
    let s = prepared(); expect(ownershipLimit(s)).toBe(10);
    s.frontier.push = { sector: 0, spawned: 10, defeated: 9 };
    s.frontier.mobs = [{ id: 1, sector: 0, encounter: 9, campaign: true, hp: 2, position: 8 }]; s.frontier.nextId = 2;
    s = tickFrontier(s);
    expect(s.frontier.claimed).toBe(1); expect(ownershipLimit(s)).toBe(20);
    expect(s.frontier.scrap).toBe(SECTORS[0].claim + SECTORS[0].scrap * 4);
    const reward = s.frontier.scrap; s = tickFrontier(s); expect(s.frontier.scrap).toBe(reward);
    s.machines[0].owned = 20; expect(cost(s, 0)).toBe(Infinity);
    expect(beginPush(s).frontier.push?.sector).toBe(1);
  });
  it('migrates legacy workshop progress and refunds old prepaid shots exactly once', () => {
    const legacy = { ...freshState(), version: 1, sparks: 50, earned: 400, lifetime: 1000, cores: 2 };
    legacy.machines[0] = { owned: 50, manager: true, remaining: 3 };
    legacy.combat.queue = [5, 10]; legacy.tesla.active = true; legacy.discoveries = [0, 1, 2];
    const s = parseSave(JSON.stringify(legacy));
    expect(s.version).toBe(2); expect(s.sparks).toBe(65); expect(s.earned).toBe(400);
    expect(s.frontier.active).toBe(false); expect(s.frontier.claimed).toBe(0);
    expect(s.machines[0].owned).toBe(50); expect(s.cores).toBe(2); expect(s.legacyDiscoveries).toEqual([0,1,2]); expect(s.discoveries).toEqual([0,1]);
    expect(cost(s, 0)).toBe(Infinity); expect(advance(s, 3).sparks).toBeGreaterThan(65);
    expect(parseSave(JSON.stringify(s)).sparks).toBe(65); expect(prestige(s)).toBe(s);
  });
  it('roundtrips active pushes and pauses combat during offline catch-up', () => {
    let s = beginPush(prepared()); s = tickFrontier(s);
    s.machines[0] = { owned: 1, manager: true, remaining: 3 };
    expect(parseSave(JSON.stringify(s))).toEqual(s);
    const resumed = resume(s, s.lastSaved + 60000);
    expect(resumed.state.frontier).toEqual(s.frontier); expect(resumed.gained).toBe(60);
    expect(() => parseSave(JSON.stringify({ ...s, frontier: { ...s.frontier, capacitor: 1000 } }))).toThrow();
    expect(() => parseSave(JSON.stringify({ ...s, frontier: { ...s.frontier, claimed: 4 } }))).toThrow();
    expect(() => parseSave(JSON.stringify({ ...s, frontier: { ...s.frontier, push: { sector: 2, spawned: 1, defeated: 0 } } }))).toThrow();
  });
  it('plays all three sectors from zero using generated energy and earned salvage', () => {
    let s = freshState();
    // A legitimate opening: clicks buy four generators, a manager, and the reserve.
    for (let i = 0; i < 150; i++) s = gather(s);
    s = hire(buy(s, 0, 4), 0); s = activateDefense(setRefill(fillCapacitor(s), 2));
    const targets = [{ discharge: 2, chaining: 0 }, { discharge: 4, chaining: 1 }, { discharge: 7, chaining: 2 }];
    let seconds = 0;
    for (; seconds < 3600 && s.frontier.claimed < 3; seconds++) {
      const wanted = targets[s.frontier.claimed];
      if (s.frontier.upgrades.discharge < wanted.discharge) s = upgradeCoil(s, 'discharge');
      else if (s.frontier.upgrades.chaining < wanted.chaining) s = upgradeCoil(s, 'chaining');
      if (!s.frontier.push && s.frontier.upgrades.discharge >= wanted.discharge && s.frontier.upgrades.chaining >= wanted.chaining) s = beginPush(s);
      s = second(s);
      expect(s.frontier.active).toBe(true);
      expect(s.sparks).toBeGreaterThanOrEqual(0);
      expect(s.frontier.capacitor).toBeGreaterThanOrEqual(0);
    }
    expect(s.frontier.claimed).toBe(3); expect(seconds).toBeLessThan(3600);
    expect(ownershipLimit(s)).toBe(100); expect(s.frontier.defeated).toBeGreaterThanOrEqual(30);
    expect(parseSave(JSON.stringify(s))).toEqual(s);
    expect(beginPush(s)).toBe(s);
  });
});
