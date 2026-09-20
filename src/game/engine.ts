import { freshCombat, parseCombat, type CombatState } from './combat';
/** Pure simulation shared by web, mobile and desktop. All durations are seconds. */
export const MACHINES = [
  { id: 'coil', name: 'Copper coil', description: 'A little wire. A lot of potential.', cost: 12, seconds: 3, yield: 3, manager: 35, role: 'Coil keeper', color: '#b77542' },
  { id: 'wheel', name: 'Induction wheel', description: 'Turn a steady rhythm into energy.', cost: 70, seconds: 5, yield: 25, manager: 160, role: 'Wheel tender', color: '#668572' },
  { id: 'dynamo', name: 'Arc dynamo', description: 'Small lightning, carefully contained.', cost: 320, seconds: 8, yield: 192, manager: 650, role: 'Arc engineer', color: '#667f92' },
] as const;
export const UPGRADES = [
  { id: 'gloves', name: 'Conductive gloves', text: 'Hand-generated sparks increase from 1 to 3.', cost: 75 },
  { id: 'wiring', name: 'Better wiring', text: 'All machines produce twice as many sparks.', cost: 500 },
  { id: 'lenses', name: 'Focusing lenses', text: 'Double machine production again.', cost: 3000 },
] as const;
export type UpgradeId = typeof UPGRADES[number]['id'];
export interface MachineState { owned: number; manager: boolean; remaining: number }
export interface GameState {
  combat: CombatState; sound: boolean;
  version: 1; sparks: number; earned: number; lifetime: number; cores: number; resets: number;
  machines: MachineState[]; upgrades: UpgradeId[]; lastSaved: number;
  clicks: number; mastered: boolean; reducedMotion: boolean; discoveries: number[];
}
export const OFFLINE_CAP = 8 * 60 * 60;
export function freshState(now = Date.now()): GameState {
  return { combat: freshCombat(), sound: true, version: 1, sparks: 0, earned: 0, lifetime: 0, cores: 0, resets: 0,
    machines: MACHINES.map(() => ({ owned: 0, manager: false, remaining: 0 })),
    upgrades: [], lastSaved: now, clicks: 0, mastered: false, reducedMotion: false, discoveries: [] };
}
export function recordDiscoveries(s: GameState): GameState {
  const unlocked = [s.machines[0].owned > 0, s.machines.some(m => m.manager), s.machines.some(m => m.owned >= 10), s.upgrades.includes('wiring'), s.resets > 0];
  return { ...s, discoveries: [...new Set([...s.discoveries, ...unlocked.flatMap((yes, i) => yes ? [i] : [])])] };
}
export function multiplier(s: GameState) {
  return (1 + s.cores * 0.25) * (s.upgrades.includes('wiring') ? 2 : 1) * (s.upgrades.includes('lenses') ? 2 : 1);
}
export function milestone(owned: number) { return 2 ** Math.floor(owned / 10); }
export function cycleYield(s: GameState, i: number) { return MACHINES[i].yield * s.machines[i].owned * milestone(s.machines[i].owned) * multiplier(s); }
export function passiveRate(s: GameState) { return MACHINES.reduce((sum, m, i) => sum + (s.machines[i].manager ? cycleYield(s, i) / m.seconds : 0), 0); }
export function clickYield(s: GameState) { return (s.upgrades.includes('gloves') ? 3 : 1) * (1 + s.cores * .25); }
function award(s: GameState, amount: number) {
  s.sparks += amount; s.earned += amount; s.lifetime += amount;
  if (s.lifetime >= 25000 && s.machines.every(m => m.manager)) s.mastered = true;
}
export function gather(s: GameState): GameState {
  const next = structuredClone(s); award(next, clickYield(s)); next.clicks++; return next;
}
export function advance(s: GameState, elapsed: number): GameState {
  const next = structuredClone(s);
  const dt = Math.min(OFFLINE_CAP, Math.max(0, Number.isFinite(elapsed) ? elapsed : 0));
  next.machines.forEach((machine, i) => {
    if (!machine.owned || (!machine.manager && machine.remaining <= 0)) return;
    const duration = MACHINES[i].seconds;
    const first = machine.remaining > 0 ? machine.remaining : duration;
    if (dt + 1e-9 < first) { machine.remaining = first - dt; return; }
    const extra = Math.max(0, dt - first);
    const cycles = machine.manager ? 1 + Math.floor((extra + 1e-9) / duration) : 1;
    award(next, cycles * cycleYield(next, i));
    machine.remaining = machine.manager ? duration - (extra % duration) : 0;
    if (machine.manager && machine.remaining < 1e-8) machine.remaining = duration;
  });
  return next;
}
export function cost(s: GameState, i: number, quantity = 1) {
  const owned = s.machines[i].owned;
  if (quantity < 1 || quantity > 100 - owned) return Infinity;
  let sum = 0;
  for (let n = 0; n < quantity; n++) sum += Math.ceil(MACHINES[i].cost * 1.15 ** (owned + n));
  return sum;
}
export function affordable(s: GameState, i: number) {
  let quantity = 0, total = 0;
  while (s.machines[i].owned + quantity < 100) {
    const next = Math.ceil(MACHINES[i].cost * 1.15 ** (s.machines[i].owned + quantity));
    if (total + next > s.sparks) break;
    total += next; quantity++;
  }
  return quantity;
}
export function buy(s: GameState, i: number, quantity = 1): GameState {
  if (!Number.isInteger(quantity) || quantity < 1 || s.sparks < cost(s, i, quantity)) return s;
  const next = structuredClone(s); next.sparks -= cost(s, i, quantity); next.machines[i].owned += quantity; return next;
}
export function startCycle(s: GameState, i: number): GameState {
  if (!s.machines[i].owned || s.machines[i].manager || s.machines[i].remaining > 0) return s;
  const next = structuredClone(s); next.machines[i].remaining = MACHINES[i].seconds; return next;
}
export function hire(s: GameState, i: number): GameState {
  if (!s.machines[i].owned || s.machines[i].manager || s.sparks < MACHINES[i].manager) return s;
  const next = structuredClone(s); next.sparks -= MACHINES[i].manager; next.machines[i].manager = true;
  if (!next.machines[i].remaining) next.machines[i].remaining = MACHINES[i].seconds;
  if (next.lifetime >= 25000 && next.machines.every(m => m.manager)) next.mastered = true;
  return next;
}
export function upgrade(s: GameState, id: UpgradeId): GameState {
  const item = UPGRADES.find(x => x.id === id)!;
  if (s.upgrades.includes(id) || s.sparks < item.cost) return s;
  const next = structuredClone(s); next.sparks -= item.cost; next.upgrades.push(id); return next;
}
export function prestigeReward(s: GameState) { return Math.floor(Math.sqrt(s.earned / 10000)); }
export function prestige(s: GameState): GameState {
  const reward = prestigeReward(s); if (!reward) return s;
  return recordDiscoveries({ ...freshState(), combat: s.combat, sound: s.sound, lifetime: s.lifetime, cores: s.cores + reward, resets: s.resets + 1, mastered: s.mastered, reducedMotion: s.reducedMotion, clicks: s.clicks, discoveries: recordDiscoveries(s).discoveries });
}
export function format(value: number) {
  if (!Number.isFinite(value)) return '—';
  if (value < 1000) return Math.floor(value).toLocaleString('en-US');
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
export function rateFormat(value: number) { return value < 100 ? value.toFixed(1) : format(value); }
export function parseSave(raw: string): GameState {
  if (raw.length > 50000) throw new Error('This save is too large.');
  const s = JSON.parse(raw);
  if (!s || typeof s !== 'object' || s.version !== 1) throw new Error('Unsupported save version.');
  const valid = (v: unknown, max = 1e30) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max;
  for (const field of ['sparks', 'earned', 'lifetime', 'cores', 'resets', 'clicks']) {
    if (!valid(s[field])) throw new Error('Invalid save values.');
  }
  if (!Number.isInteger(s.cores) || !Number.isInteger(s.resets) || !Number.isInteger(s.clicks) || !valid(s.lastSaved, 9e15)) throw new Error('Invalid save metadata.');
  if (!Array.isArray(s.machines) || s.machines.length !== 3) throw new Error('Invalid machine data.');
  s.machines.forEach((m: MachineState, i: number) => {
    if (!m || !valid(m.owned, 100) || !Number.isInteger(m.owned) || typeof m.manager !== 'boolean' || !valid(m.remaining, MACHINES[i].seconds) || (!m.owned && (m.manager || m.remaining))) throw new Error('Invalid machine data.');
  });
  if (!Array.isArray(s.upgrades) || s.upgrades.length > 3 || new Set(s.upgrades).size !== s.upgrades.length || s.upgrades.some((id: string) => !UPGRADES.some(u => u.id === id))) throw new Error('Invalid upgrades.');
  if (typeof s.mastered !== 'boolean' || typeof s.reducedMotion !== 'boolean') throw new Error('Invalid settings.');
  if (s.discoveries !== undefined && (!Array.isArray(s.discoveries) || s.discoveries.length > 5 || s.discoveries.some((v: unknown) => !Number.isInteger(v) || (v as number) < 0 || (v as number) > 4))) throw new Error('Invalid discoveries.');
  if (s.sound !== undefined && typeof s.sound !== 'boolean') throw new Error('Invalid sound setting.');
  // Reconstruct known fields, never merge arbitrary imported properties.
  return { combat: parseCombat(s.combat), sound: s.sound ?? true, version: 1, sparks: s.sparks, earned: s.earned, lifetime: s.lifetime, cores: s.cores, resets: s.resets, clicks: s.clicks,
    machines: s.machines.map((m: MachineState) => ({ owned: m.owned, manager: m.manager, remaining: m.remaining })),
    upgrades: s.upgrades, lastSaved: s.lastSaved, mastered: s.mastered, reducedMotion: s.reducedMotion, discoveries: s.discoveries ?? [] };
}
export function resume(s: GameState, now = Date.now()) {
  const seconds = Math.min(OFFLINE_CAP, Math.max(0, (now - s.lastSaved) / 1000));
  const next = advance(s, seconds); next.lastSaved = now;
  return { state: next, seconds, gained: next.sparks - s.sparks };
}
