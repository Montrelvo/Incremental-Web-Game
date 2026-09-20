import type { GameState } from './engine';

export interface CombatState { stage: number; encounter: number; hp: number; queue: number[]; defeated: number; complete: boolean }
export function enemy(stage: number, encounter: number) {
  const kind = encounter === 9 ? 'Stage boss' : encounter === 4 ? 'Mini boss' : 'Metal mob';
  const base = 10 + (stage - 1) * 10;
  return { kind, hp: base * (encounter === 9 ? 4 : encounter === 4 ? 2 : 1), name: encounter === 9 ? 'Iron Colossus' : encounter === 4 ? 'Steel Sentinel' : 'Scrap Walker' };
}
export function freshCombat(): CombatState { return { stage: 1, encounter: 0, hp: 10, queue: [], defeated: 0, complete: false }; }
export function queueShots(s: GameState, charge: number, count: number): GameState {
  if (!Number.isSafeInteger(charge) || charge < 1 || charge > 1000000 || !Number.isInteger(count) || count < 1 || count > 10 || s.combat.complete || s.combat.queue.length + count > 50 || s.sparks < charge * count) return s;
  return { ...s, sparks: s.sparks - charge * count, combat: { ...s.combat, queue: [...s.combat.queue, ...Array<number>(count).fill(charge)] } };
}
export function cancelShots(s: GameState): GameState {
  return { ...s, sparks: s.sparks + s.combat.queue.reduce((a, b) => a + b, 0), combat: { ...s.combat, queue: [] } };
}
export function fireShot(s: GameState): GameState {
  if (!s.combat.queue.length || s.combat.complete) return s;
  const c = { ...s.combat, queue: s.combat.queue.slice(1), hp: Math.max(0, s.combat.hp - s.combat.queue[0] * 2) };
  if (!c.hp) {
    c.defeated++;
    if (c.encounter === 9) { if (c.stage === 10) c.complete = true; else { c.stage++; c.encounter = 0; } }
    else c.encounter++;
    if (!c.complete) c.hp = enemy(c.stage, c.encounter).hp;
  }
  const next = { ...s, combat: c };
  return c.complete ? cancelShots(next) : next;
}
export function parseCombat(value: unknown): CombatState {
  if (value === undefined) return freshCombat();
  const c = value as CombatState;
  if (!c || !Number.isInteger(c.stage) || c.stage < 1 || c.stage > 10 || !Number.isInteger(c.encounter) || c.encounter < 0 || c.encounter > 9 || typeof c.complete !== 'boolean' || !Number.isFinite(c.hp) || c.hp < 0 || c.hp > enemy(c.stage, c.encounter).hp || !Number.isInteger(c.defeated) || c.defeated !== (c.stage - 1) * 10 + c.encounter + (c.complete ? 1 : 0) || (c.complete ? c.stage !== 10 || c.encounter !== 9 || c.hp !== 0 : c.hp === 0) || !Array.isArray(c.queue) || c.queue.length > 50 || c.queue.some(n => !Number.isSafeInteger(n) || n < 1 || n > 1000000) || (c.complete && c.queue.length)) throw new Error('Invalid combat save.');
  return { stage: c.stage, encounter: c.encounter, hp: c.hp, queue: [...c.queue], defeated: c.defeated, complete: c.complete };
}
