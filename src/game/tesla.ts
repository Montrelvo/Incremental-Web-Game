import { freshState, type GameState } from './engine';

export interface TeslaMob { id: number; strength: number; position: number }
export interface TeslaState { active: boolean; power: number; broken: boolean; ticks: number; spawnIn: number; defeated: number; mobs: TeslaMob[]; event: 'idle' | 'pulse' | 'kill' | 'break' }
export function freshTesla(): TeslaState { return { active: false, power: 1, broken: false, ticks: 0, spawnIn: 1, defeated: 0, mobs: [], event: 'idle' }; }
export function teslaThreat(s: GameState) {
  const load = s.machines.reduce((sum, m, i) => sum + m.owned * [1, 4, 12][i], 0);
  return { load, strength: 1 + load, interval: Math.max(1, 6 - Math.floor(load / 20)) };
}
export function setTeslaPower(s: GameState, power: number): GameState {
  if (!Number.isSafeInteger(power) || power < 1 || power > 1000000) return s;
  return { ...s, tesla: { ...s.tesla, power } };
}
export function startTesla(s: GameState): GameState {
  if (s.tesla.active) return s;
  return { ...s, tesla: { ...freshTesla(), power: s.tesla.power, active: true } };
}
/** One visible-play second. Workshop production is settled by the caller first. */
export function tickTesla(s: GameState): GameState {
  if (!s.tesla.active) return s;
  const t = structuredClone(s.tesla);
  t.ticks++; t.event = 'idle';
  // A partial charge produces only the power actually paid for this tick.
  const paid = t.broken ? 0 : Math.min(t.power, Math.floor(s.sparks));
  const next = { ...s, sparks: s.sparks - paid, tesla: t };
  if (paid) t.event = 'pulse';
  t.mobs = t.mobs.flatMap(mob => {
    const m = { ...mob, position: mob.position - 1 };
    if (m.position === 3 && !t.broken) {
      if (paid > m.strength) { t.defeated++; t.event = 'kill'; return []; }
      t.broken = true; t.event = 'break';
    }
    return [m];
  });
  if (t.mobs.some(m => m.position <= 0)) {
    return { ...freshState(), sound: s.sound, reducedMotion: s.reducedMotion };
  }
  if (!t.broken && --t.spawnIn <= 0) {
    const threat = teslaThreat(s);
    t.mobs.push({ id: t.ticks, strength: threat.strength, position: 10 });
    t.spawnIn = threat.interval;
  }
  return next;
}
export function parseTesla(value: unknown): TeslaState {
  if (value === undefined) return freshTesla();
  const t = value as TeslaState;
  const integer = (v: number, min: number, max: number) => Number.isSafeInteger(v) && v >= min && v <= max;
  if (!t || typeof t.active !== 'boolean' || typeof t.broken !== 'boolean' || !integer(t.power, 1, 1000000) || !integer(t.ticks, 0, 1e12) || !integer(t.spawnIn, 0, 6) || !integer(t.defeated, 0, t.ticks) || !['idle', 'pulse', 'kill', 'break'].includes(t.event) || !Array.isArray(t.mobs) || t.mobs.length > 10 || t.mobs.some(m => !m || !integer(m.id, 1, t.ticks) || !integer(m.strength, 1, 1701) || !integer(m.position, 1, 10)) || new Set(t.mobs.map(m => m.id)).size !== t.mobs.length || (!t.active && (t.broken || t.mobs.length || t.ticks || t.defeated))) throw new Error('Invalid Tesla save.');
  return { active: t.active, power: t.power, broken: t.broken, ticks: t.ticks, spawnIn: t.spawnIn, defeated: t.defeated, mobs: t.mobs.map(m => ({ id: m.id, strength: m.strength, position: m.position })), event: t.event };
}
