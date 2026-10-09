export interface FrontierEconomy { sparks: number; frontier: FrontierState }

export const BUNKER_HP = 100;
export const SECTORS = [
  { name: 'Perimeter', hp: 8, scrap: 2, damage: 6, interval: 6, claim: 12, description: 'Clear the fence line and secure your first foothold.' },
  { name: 'Scrapyard', hp: 24, scrap: 4, damage: 10, interval: 5, claim: 30, description: 'Recover machinery from the metal graveyard.' },
  { name: 'Relay grounds', hp: 60, scrap: 8, damage: 16, interval: 4, claim: 60, description: 'Reclaim the outer relay and finish the first expedition.' },
] as const;
export const CAPACITY_LIMITS = [10, 20, 30, 100] as const;
export const COIL_UPGRADES = [
  { id: 'discharge', name: 'Discharge strength', description: '+4 damage per pulse', costs: [6, 12, 24, 42, 70, 110, 165, 240] },
  { id: 'capacity', name: 'Capacitor capacity', description: '+30 reserved energy', costs: [8, 16, 32, 64, 128] },
  { id: 'chaining', name: 'Arc chaining', description: '+1 target per pulse', costs: [18, 45] },
] as const;
export type CoilUpgrade = typeof COIL_UPGRADES[number]['id'];
export interface FrontierEnemy { id: number; sector: number; encounter: number; campaign: boolean; hp: number; position: number }
export interface FrontierState {
  scrap: number; active: boolean; integrity: number; claimed: number;
  capacitor: number; refill: number; upgrades: Record<CoilUpgrade, number>;
  mobs: FrontierEnemy[]; nextId: number; spawnIn: number; ticks: number;
  push: { sector: number; spawned: number; defeated: number } | null;
  queue: number[]; defeated: number; event: 'idle' | 'pulse' | 'kill' | 'claim' | 'loss' | 'shot';
}
export function freshFrontier(): FrontierState {
  return { scrap: 0, active: false, integrity: BUNKER_HP, claimed: 0, capacitor: 0, refill: 0,
    upgrades: { discharge: 0, capacity: 0, chaining: 0 }, mobs: [], nextId: 1,
    spawnIn: 1, ticks: 0, push: null, queue: [], defeated: 0, event: 'idle' };
}
export function coilStats(f: FrontierState) {
  return { damage: 6 + 4 * f.upgrades.discharge, capacity: 30 + 30 * f.upgrades.capacity, targets: 1 + f.upgrades.chaining, cost: 2 };
}
export function sectorEnemy(sector: number, encounter = 0) {
  const definition = SECTORS[sector];
  const scale = encounter === 9 ? 4 : encounter === 4 ? 2 : 1;
  return { hp: definition.hp * scale, scrap: definition.scrap * scale, damage: definition.damage * scale,
    name: encounter === 9 ? 'Iron Colossus' : encounter === 4 ? 'Steel Sentinel' : 'Scrap Walker',
    kind: encounter === 9 ? 'Sector boss' : encounter === 4 ? 'Mini boss' : 'Metal mob' };
}
export function ownershipLimit(s: FrontierEconomy) { return CAPACITY_LIMITS[s.frontier.claimed]; }
function edit<T extends FrontierEconomy>(s: T) { return { ...s, frontier: structuredClone(s.frontier) }; }
export function fillCapacitor<T extends FrontierEconomy>(s: T): T {
  const amount = Math.min(s.sparks, coilStats(s.frontier).capacity - s.frontier.capacitor);
  if (amount <= 0 || s.frontier.integrity === 0) return s;
  const next = edit(s); next.sparks -= amount; next.frontier.capacitor += amount; return next;
}
export function setRefill<T extends FrontierEconomy>(s: T, rate: number): T {
  if (!Number.isInteger(rate) || rate < 0 || rate > 20) return s;
  return { ...s, frontier: { ...s.frontier, refill: rate } };
}
export function upgradeCoil<T extends FrontierEconomy>(s: T, id: CoilUpgrade): T {
  const item = COIL_UPGRADES.find(u => u.id === id)!;
  const price = item.costs[s.frontier.upgrades[id]];
  if (price === undefined || s.frontier.scrap < price) return s;
  const next = edit(s); next.frontier.scrap -= price; next.frontier.upgrades[id]++; return next;
}
export function activateDefense<T extends FrontierEconomy>(s: T): T {
  if (s.frontier.active || s.frontier.integrity === 0 || s.frontier.capacitor < coilStats(s.frontier).cost) return s;
  const next = edit(s); next.frontier.active = true; next.frontier.spawnIn = 1; next.frontier.event = 'idle'; return next;
}
export function beginPush<T extends FrontierEconomy>(s: T): T {
  if (!s.frontier.active || s.frontier.push || s.frontier.claimed >= SECTORS.length) return s;
  const next = edit(s); next.frontier.push = { sector: next.frontier.claimed, spawned: 0, defeated: 0 };
  next.frontier.spawnIn = 1; return next;
}
export function repairCost(f: FrontierState) { return Math.ceil((BUNKER_HP - f.integrity) / 2); }
export function repairBunker<T extends FrontierEconomy>(s: T): T {
  const price = repairCost(s.frontier);
  if (s.frontier.active || !price || s.sparks < price) return s;
  const next = edit(s); next.sparks -= price; next.frontier.integrity = BUNKER_HP; next.frontier.event = 'idle'; return next;
}
export function queueSupport<T extends FrontierEconomy>(s: T, charge: number, count: number): T {
  if (!s.frontier.active || !Number.isSafeInteger(charge) || charge < 1 || charge > 1000000 ||
    !Number.isInteger(count) || count < 1 || count > 10 || s.frontier.queue.length + count > 50 || s.sparks < charge * count) return s;
  const next = edit(s); next.sparks -= charge * count; next.frontier.queue.push(...Array<number>(count).fill(charge)); return next;
}
export function cancelSupport<T extends FrontierEconomy>(s: T): T {
  if (!s.frontier.queue.length) return s;
  const next = edit(s); next.sparks += next.frontier.queue.reduce((a, b) => a + b, 0); next.frontier.queue = []; return next;
}
/** One visible-play second; production must be settled by the caller first. */
export function tickFrontier<T extends FrontierEconomy>(s: T): T {
  if (!s.frontier.active) return s;
  let next = edit(s); const f = next.frontier, stats = coilStats(f);
  f.ticks++; f.event = 'idle';
  const refill = Math.min(next.sparks, f.refill, stats.capacity - f.capacitor);
  next.sparks -= refill; f.capacitor += refill;
  f.mobs.forEach(m => m.position--);
  const inRange = f.mobs.filter(m => m.position > 0 && m.position <= 8).sort((a, b) => a.position - b.position || a.id - b.id);
  if (inRange.length && f.capacitor >= stats.cost) {
    f.capacitor -= stats.cost; f.event = 'pulse';
    inRange.slice(0, stats.targets).forEach(m => m.hp -= stats.damage);
  }
  const cannonTarget = f.mobs.filter(m => m.hp > 0 && m.position > 0).sort((a, b) => a.position - b.position || a.id - b.id)[0];
  if (cannonTarget && f.queue.length) { cannonTarget.hp -= f.queue.shift()! * 2; f.event = 'shot'; }
  for (const mob of f.mobs.filter(m => m.hp <= 0)) {
    f.scrap += sectorEnemy(mob.sector, mob.encounter).scrap; f.defeated++; f.event = 'kill';
    // Only campaign mobs count toward a claim; pre-existing frontier mobs have campaign=false.
    if (f.push && mob.campaign && mob.sector === f.push.sector) f.push.defeated++;
  }
  f.mobs = f.mobs.filter(m => m.hp > 0);
  const breaches = f.mobs.filter(m => m.position <= 0);
  for (const mob of breaches) f.integrity = Math.max(0, f.integrity - sectorEnemy(mob.sector, mob.encounter).damage);
  // Any escaped campaign enemy fails the push. Surviving attacks become routine frontier enemies.
  if (breaches.some(m => m.campaign) && f.push) {
    f.push = null; next.sparks += f.queue.reduce((a, b) => a + b, 0); f.queue = []; f.mobs.forEach(m => { m.campaign = false; }); f.spawnIn = SECTORS[Math.max(0, f.claimed - 1)].interval;
  }
  f.mobs = f.mobs.filter(m => m.position > 0);
  if (!f.integrity) {
    f.active = false; f.push = null; f.mobs = []; f.event = 'loss';
    next.sparks += f.capacitor; f.capacitor = 0; next = cancelSupport(next); return next;
  }
  if (f.push?.defeated === 10) {
    f.scrap += SECTORS[f.push.sector].claim; f.claimed++; f.push = null; f.event = 'claim';
    f.spawnIn = SECTORS[f.claimed - 1].interval;
    next = cancelSupport(next);
  }
  const current = next.frontier;
  if (--current.spawnIn <= 0) {
    if (!current.push || current.push.spawned < 10) {
      const sector = current.push?.sector ?? Math.max(0, current.claimed - 1);
      const encounter = current.push ? current.push.spawned++ : 0;
      current.mobs.push({ id: current.nextId++, sector, encounter, campaign: !!current.push, hp: sectorEnemy(sector, encounter).hp, position: 12 });
      current.spawnIn = current.push ? Math.max(3, SECTORS[sector].interval - 2) : SECTORS[sector].interval;
    } else current.spawnIn = 1;
  }
  return next;
}
export function parseFrontier(value: unknown): FrontierState {
  const f = value as FrontierState;
  const integer = (n: unknown, min: number, max: number) => typeof n === 'number' && Number.isSafeInteger(n) && n >= min && n <= max;
  const nonnegative = (n: unknown, max = 1e30) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= max;
  if (!f || typeof f.active !== 'boolean' || !integer(f.integrity, 0, BUNKER_HP) || !integer(f.claimed, 0, 3) ||
    !nonnegative(f.scrap) || !nonnegative(f.capacitor) || !integer(f.refill, 0, 20) || !integer(f.nextId, 1, 1e12) ||
    !integer(f.ticks, 0, 1e12) || !integer(f.defeated, 0, 1e12) || !integer(f.spawnIn, 1, 6) ||
    !f.upgrades || COIL_UPGRADES.some(u => !integer(f.upgrades[u.id], 0, u.costs.length)) ||
    f.capacitor > coilStats(f).capacity || !['idle', 'pulse', 'kill', 'claim', 'loss', 'shot'].includes(f.event) ||
    !Array.isArray(f.queue) || f.queue.length > 50 || f.queue.some(n => !integer(n, 1, 1000000)) ||
    !Array.isArray(f.mobs) || f.mobs.length > 20 || f.mobs.some(m => !m || !integer(m.id, 1, f.nextId - 1) ||
      !integer(m.sector, 0, 2) || !integer(m.encounter, 0, 9) || typeof m.campaign !== 'boolean' || !nonnegative(m.hp, sectorEnemy(m.sector, m.encounter).hp) ||
      m.hp <= 0 || !integer(m.position, 1, 12)) || new Set(f.mobs.map(m => m.id)).size !== f.mobs.length ||
    (f.active && f.integrity === 0) || (!f.active && (f.mobs.length || f.push || f.queue.length)) ||
    (f.integrity === 0 && f.capacitor !== 0) ||
    (f.push !== null && (!f.push || !integer(f.push.sector, 0, 2) || f.push.sector !== f.claimed ||
      !integer(f.push.spawned, 0, 10) || !integer(f.push.defeated, 0, 9) || f.push.defeated > f.push.spawned))) throw new Error('Invalid frontier save.');
  if (f.push && (f.mobs.filter(m => m.campaign).length !== f.push.spawned - f.push.defeated ||
      f.mobs.some(m => m.campaign && (m.sector !== f.push!.sector || m.encounter >= f.push!.spawned)) ||
      new Set(f.mobs.filter(m => m.campaign).map(m => m.encounter)).size !== f.mobs.filter(m => m.campaign).length)) throw new Error('Invalid push progress.');
  if (!f.push && f.mobs.some(m => m.campaign)) throw new Error('Orphaned campaign enemies.');
  return { scrap: f.scrap, active: f.active, integrity: f.integrity, claimed: f.claimed,
    capacitor: f.capacitor, refill: f.refill, upgrades: { discharge: f.upgrades.discharge, capacity: f.upgrades.capacity, chaining: f.upgrades.chaining },
    mobs: f.mobs.map(m => ({ id: m.id, sector: m.sector, encounter: m.encounter, campaign: m.campaign, hp: m.hp, position: m.position })),
    nextId: f.nextId, spawnIn: f.spawnIn, ticks: f.ticks, push: f.push ? { ...f.push } : null,
    queue: [...f.queue], defeated: f.defeated, event: f.event };
}
