import { describe, expect, it } from 'vitest';
import { activateDefense, beginPush, cancelSupport, fillCapacitor, freshFrontier, ownershipLimit, parseFrontier, queueSupport, repairBunker, setRefill, tickFrontier, upgradeCoil } from './frontier';
function base() { return { sparks: 100, frontier: freshFrontier() }; }
function ready() { return activateDefense(setRefill(fillCapacitor(base()), 2)); }

describe('standalone frontier rules', () => {
  it('reserves and refunds prepaid energy without mutating the input economy', () => {
    const original = base(); const reserved = fillCapacitor(original);
    expect(original.sparks).toBe(100); expect(original.frontier.capacitor).toBe(0);
    expect(reserved.sparks + reserved.frontier.capacitor).toBe(100);
    const queued = queueSupport(activateDefense(reserved), 4, 5);
    expect(queued.sparks).toBe(50); expect(cancelSupport(queued).sparks).toBe(70);
  });
  it('uses both weapons on one health pool and grants exactly one salvage reward', () => {
    let s = ready(); s.frontier.spawnIn = 6; s.frontier.nextId = 2;
    s.frontier.mobs = [{ id: 1, sector: 0, encounter: 0, campaign: false, hp: 8, position: 8 }];
    s = tickFrontier(queueSupport(s, 1, 1));
    expect(s.frontier.defeated).toBe(1); expect(s.frontier.scrap).toBe(2);
    expect(tickFrontier(s).frontier.scrap).toBe(2);
  });
  it('spends scrap on stronger coil equipment, rather than operating energy', () => {
    let s = base(); s.frontier.scrap = 6;
    s = upgradeCoil(s, 'discharge');
    expect(s.frontier.upgrades.discharge).toBe(1); expect(s.frontier.scrap).toBe(0);
    expect(s.sparks).toBe(100); expect(upgradeCoil(s, 'discharge')).toBe(s);
  });
  it('claims a cleared sector once and expands generator capacity', () => {
    let s = beginPush(ready()); expect(ownershipLimit(s)).toBe(10);
    s.frontier.push = { sector: 0, spawned: 10, defeated: 9 };
    s.frontier.nextId = 2;
    s.frontier.mobs = [{ id: 1, sector: 0, encounter: 9, campaign: true, hp: 2, position: 8 }];
    s = tickFrontier(s);
    expect(s.frontier.claimed).toBe(1); expect(s.frontier.scrap).toBe(20);
    expect(ownershipLimit(s)).toBe(20); expect(tickFrontier(s).frontier.scrap).toBe(20);
    expect(parseFrontier(s.frontier)).toEqual(s.frontier);
  });
  it('stops a defeated bunker, refunds remaining charges, and retains permanent equipment', () => {
    let s = ready(); s.frontier.integrity = 6; s.frontier.scrap = 15;
    s.frontier.upgrades.discharge = 2; s.frontier.capacitor = 1; s.frontier.refill = 0;
    s.frontier.nextId = 2;
    s.frontier.mobs = [{ id: 1, sector: 0, encounter: 0, campaign: false, hp: 8, position: 1 }];
    s = queueSupport(s, 3, 2); const balance = s.sparks;
    s = tickFrontier(s); expect(s.sparks).toBe(balance + 7);
    expect(s.frontier.active).toBe(false); expect(s.frontier.scrap).toBe(15);
    expect(s.frontier.upgrades.discharge).toBe(2);
    const repaired = repairBunker({ ...s, sparks: 50 });
    expect(repaired.sparks).toBe(0); expect(repaired.frontier.integrity).toBe(100);
    expect(repaired.frontier.active).toBe(false);
  });
  it('validates active state and rejects impossible campaign progress', () => {
    const s = tickFrontier(beginPush(ready()));
    expect(parseFrontier(s.frontier)).toEqual(s.frontier);
    expect(() => parseFrontier({ ...s.frontier, capacitor: 10000 })).toThrow();
    expect(() => parseFrontier({ ...s.frontier, push: { sector: 0, spawned: 8, defeated: 0 } })).toThrow();
  });
});
