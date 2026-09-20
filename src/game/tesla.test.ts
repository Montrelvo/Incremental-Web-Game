import { describe, expect, it } from 'vitest';
import { freshState, parseSave, prestige, resume } from './engine';
import { freshTesla, setTeslaPower, startTesla, teslaThreat, tickTesla } from './tesla';

describe('Tesla survival', () => {
  it('scales strength and spawn frequency with generator count and tier', () => {
    const s = freshState();
    expect(teslaThreat(s)).toEqual({ load: 0, strength: 1, interval: 6 });
    s.machines[0].owned = 20;
    expect(teslaThreat(s)).toEqual({ load: 20, strength: 21, interval: 5 });
    s.machines[1].owned = 10; s.machines[2].owned = 10;
    expect(teslaThreat(s)).toEqual({ load: 180, strength: 181, interval: 1 });
  });
  it('spends allocated sparks every tick and defeats a weaker mob at the coil', () => {
    let s = startTesla(setTeslaPower({ ...freshState(), sparks: 100 }, 2));
    for (let i = 0; i < 8; i++) s = tickTesla(s);
    expect(s.sparks).toBe(84); expect(s.tesla.defeated).toBe(1);
    expect(s.tesla.broken).toBe(false); expect(s.tesla.event).toBe('kill');
  });
  it('equal power breaks the coil, then reaching the edge wipes every progression system', () => {
    let s = freshState();
    s.sparks = 100; s.cores = 20; s.resets = 3; s.lifetime = 20000; s.earned = 1000;
    s.upgrades = ['gloves']; s.discoveries = [0, 1]; s.clicks = 100; s.mastered = true;
    s.combat = { stage: 2, encounter: 0, hp: 20, defeated: 10, queue: [10], complete: false };
    s.sound = false; s.reducedMotion = true;
    s = startTesla(s);
    for (let i = 0; i < 8; i++) s = tickTesla(s);
    expect(s.tesla.broken).toBe(true); expect(s.tesla.event).toBe('break');
    expect(s.cores).toBe(20); expect(s.tesla.mobs[0].position).toBe(3);
    s = tickTesla(s); expect(s.sparks).toBe(92);
    s = tickTesla(s); expect(s.tesla.active).toBe(true);
    s = tickTesla(s);
    expect(s).toEqual({ ...freshState(s.lastSaved), sound: false, reducedMotion: true });
  });
  it('uses actual paid power when sparks run out, without negative balances', () => {
    let s = startTesla(setTeslaPower({ ...freshState(), sparks: 1.5 }, 100));
    s.tesla.mobs = [{ id: 1, strength: 2, position: 4 }]; s.tesla.ticks = 1;
    s = tickTesla(s); expect(s.sparks).toBe(.5); expect(s.tesla.broken).toBe(true);
  });
  it('changes future spawn strength, preserves existing mobs and locks rekindling', () => {
    let s = tickTesla(startTesla({ ...freshState(), sparks: 100, earned: 10000 }));
    s.machines[2].owned = 100; s.tesla.spawnIn = 1;
    s = tickTesla(s);
    expect(s.tesla.mobs.map(m => m.strength)).toEqual([1, 1201]);
    expect(prestige(s)).toBe(s);
  });
  it('roundtrips active saves, pauses offline attacks, and migrates older saves', () => {
    const s = tickTesla(startTesla({ ...freshState(), sparks: 100 }));
    expect(parseSave(JSON.stringify(s))).toEqual(s);
    expect(resume(s, s.lastSaved + 60000).state.tesla).toEqual(s.tesla);
    const old = JSON.parse(JSON.stringify(s)); delete old.tesla;
    expect(parseSave(JSON.stringify(old)).tesla).toEqual(freshTesla());
    expect(() => parseSave(JSON.stringify({ ...s, tesla: { ...s.tesla, power: -1 } }))).toThrow();
    expect(setTeslaPower(s, NaN)).toBe(s);
  });
});
