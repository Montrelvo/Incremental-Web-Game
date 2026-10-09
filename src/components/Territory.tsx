import { useState } from 'react';
import type { GameState } from '../game/engine';
import { format, passiveRate } from '../game/engine';
import { activateDefense, beginPush, BUNKER_HP, cancelSupport, coilStats, COIL_UPGRADES, fillCapacitor, ownershipLimit, queueSupport, repairBunker, repairCost, SECTORS, sectorEnemy, setRefill, upgradeCoil } from '../game/frontier';

export default function Territory({ state, act }: { state: GameState; act: (fn: (s: GameState) => GameState, message?: string) => void }) {
  const f = state.frontier, coil = coilStats(f);
  const [charge, setCharge] = useState(4), [count, setCount] = useState(1);
  const target = [...f.mobs].sort((a, b) => a.position - b.position || a.id - b.id)[0];
  const frontier = SECTORS[Math.max(0, f.claimed - 1)];
  const validCharge = Number.isSafeInteger(charge) && charge >= 1 && charge <= 1000000;
  const canQueue = f.active && validCharge && state.sparks >= charge * count && f.queue.length + count <= 50;
  return <section className={`territory ${state.reducedMotion ? 'still' : ''}`}>
    <div className="battle-heading"><div><span className="eyebrow">BEYOND THE BUNKER</span><h1>Reclaim the frontier<span>.</span></h1><p>Power the coil. Salvage the fallen. Make room to grow.</p></div><span className="stage-badge">{f.claimed} / 3 SECTORS</span></div>
    <div className="frontier-metrics" aria-label="Defense resources">
      <div><small>WORKSHOP SPARKS</small><strong>{format(state.sparks)}</strong><span>{passiveRate(state).toFixed(1)} generated / sec</span></div>
      <div><small>SALVAGED SCRAP</small><strong>{format(f.scrap)}</strong><span>{f.defeated} enemies defeated</span></div>
      <div><small>CAPACITOR</small><strong>{format(f.capacitor)} / {coil.capacity}</strong><span>{coil.cost} energy / pulse</span></div>
      <div><small>BUNKER INTEGRITY</small><strong>{f.integrity} / {BUNKER_HP}</strong><span>{f.integrity === 0 ? 'Repair needed' : f.active ? 'Defense live' : 'Ready to prepare'}</span></div>
    </div>
    <section className="territory-map" aria-label="Territory map">
      <div className="section-heading"><h2>Your foothold</h2><span>{ownershipLimit(state)} generators / type capacity</span></div>
      <div className="map-path"><div className="map-bunker"><span aria-hidden="true">⌂</span><strong>Bunker</strong><small>Energy & defense</small></div>
      {SECTORS.map((sector, i) => {
        const reclaimed = i < f.claimed, available = i === f.claimed, pushing = f.push?.sector === i;
        return <article key={sector.name} className={`sector-node ${reclaimed ? 'reclaimed' : available ? 'contested' : 'locked'}`}>
          <small>SECTOR 0{i + 1} · {reclaimed ? 'RECLAIMED' : pushing ? 'PUSH IN PROGRESS' : available ? 'CONTESTED' : 'LOCKED'}</small>
          <h3>{sector.name}</h3><p>{sector.description}</p>
          <div className="sector-details"><span>Mobs {sector.hp} HP · boss {sector.hp * 4} HP</span><span>{sector.scrap} scrap / mob · {sector.claim} claim bonus</span></div>
          {reclaimed ? <strong className="claim-label">✓ Secured · capacity {i === 2 ? 100 : (i + 2) * 10}</strong> : <button className="journal-button" disabled={!available || !f.active || !!f.push} onClick={() => act(beginPush, `Push into ${sector.name} begun.`)}>{pushing ? `${f.push!.defeated} / 10 defeated` : available ? 'Push into sector →' : 'Reclaim the previous sector'}</button>}
        </article>;
      })}</div>
      <p className="map-note">Holding {frontier.name} brings repeatable attacks and scrap. A push replaces incoming patrols with 10 sector enemies. Kill every enemy to claim the sector; an escaped campaign enemy fails the push.</p>
      {f.claimed === 3 && <p className="region-complete" role="status">First region reclaimed. Your bunker now supports 100 generators of each type. Hold the relay grounds and keep improving your defenses.</p>}
    </section>
    <section className={`frontier-arena ${f.integrity === 0 ? 'breached' : ''}`} aria-label="Bunker defense">
      <div className="arena-caption">{f.active ? f.push ? `EXPANSION · ${SECTORS[f.push.sector].name.toUpperCase()} · ${f.push.defeated}/10 DEFEATED` : `HOLDING ${frontier.name.toUpperCase()}` : f.integrity === 0 ? 'BUNKER DISABLED — PROGRESS PRESERVED' : 'DEFENSE OFFLINE — PREPARE YOUR RESERVE'}</div>
      <svg viewBox="0 0 900 260" role="img" aria-label={`${f.mobs.length} incoming enemies. Bunker integrity ${f.integrity}.`}>
        <defs><linearGradient id="frontier-ground"><stop stopColor="#476153"/><stop offset="1" stopColor="#253e37"/></linearGradient></defs>
        <path d="M20 218H880" stroke="url(#frontier-ground)" strokeWidth="4"/>
        <path d="M348 40V218" stroke="#88ac9455" strokeDasharray="5 8"/><text x="352" y="35" fill="#aec8af" fontSize="11">COIL RANGE</text>
        <path d="M30 218V152L58 122H155L185 152V218Z" fill="#718573" stroke="#bdd0ab" strokeWidth="3"/><path d="M80 218V174H132V218" fill="#203c34"/><text x="107" y="247" fill="#cfddbc" fontSize="12" textAnchor="middle">BUNKER</text>
        <path d="M230 215V120M216 140H246M216 155H246M216 170H246M216 185H246" stroke="#c49a68" strokeWidth="6"/><ellipse cx="231" cy="109" rx="34" ry="12" fill="#a8d9cc"/>
        {f.active && f.event !== 'idle' && f.capacitor >= 0 && f.mobs.filter(m => m.position <= 8).slice(0, coil.targets).map(m => <path key={`arc${m.id}`} className="frontier-arc" d={`M232 98L285 65L310 140L${45 + m.position * 66} 166`} stroke="#b6fff0" strokeWidth="3" fill="none"/>)}
        {f.mobs.map(m => {
          const definition = sectorEnemy(m.sector, m.encounter), x = 45 + m.position * 66;
          return <g key={m.id} className="frontier-mob" style={{ transform: `translate(${x}px, 151px)` }}>
            <rect x="-16" width="32" height="47" rx="5" fill={m.encounter === 9 ? '#b97b53' : m.encounter === 4 ? '#8d9e79' : '#779797'} stroke="#d2d7b4" strokeWidth="2"/>
            <path d="M-12 48L-16 65M12 48L16 65M-9 14H-3M3 14H9" stroke="#d3dec4" strokeWidth="4"/>
            <rect x="-24" y="-20" width="48" height="4" fill="#53695f"/><rect x="-24" y="-20" width={48 * Math.max(0, m.hp) / definition.hp} height="4" fill="#e7bf7a"/>
            <text textAnchor="middle" y="-28" fill="#f5dfb3" fontSize="12">{format(m.hp)} HP</text>
            <title>{definition.kind}: {m.hp} / {definition.hp} health</title>
          </g>;
        })}
      </svg>
      <div className="defense-readout" role="status">{f.integrity === 0 ? 'The bunker fell. Your territory, machines, scrap, and upgrades are safe.' : !f.active ? 'Fill the capacitor, set automatic refill, then activate defense.' : f.event === 'claim' ? 'Sector reclaimed! A stronger frontier is now active.' : f.mobs.some(m => m.position <= 8) && f.capacitor < coil.cost ? 'Low reserve — fill the capacitor or increase automatic refill.' : `${coil.damage} damage × ${coil.targets} target${coil.targets > 1 ? 's' : ''} per pulse · ${f.push ? 'Clear every enemy to reclaim this sector.' : 'Defeat patrols to earn upgrade scrap.'}`}</div>
    </section>
    <div className="frontier-controls">
      <section><h2>Power & repair</h2><p>Reserve sparks for the coil. Each pulse costs {coil.cost} energy and fires once per second when enemies are in range. No energy is spent between targets.</p>
        <progress aria-label="Capacitor reserve" max={coil.capacity} value={f.capacitor}/>
        <div className="frontier-actions"><button className="journal-button" disabled={state.sparks <= 0 || f.capacitor >= coil.capacity || !f.integrity} onClick={() => act(fillCapacitor)}>Fill capacitor · up to {format(coil.capacity - f.capacitor)}</button>
        <label className="refill-label">Auto refill<select aria-label="Automatic capacitor refill rate" value={f.refill} onChange={e => act(s => setRefill(s, Number(e.target.value)))}>{[0, 1, 2, 4, 8, 20].map(n => <option value={n} key={n}>{n === 0 ? 'Off' : `${n} sparks / sec`}</option>)}</select></label></div>
        <p>Automatic refill uses available workshop sparks, up to the selected rate and capacitor capacity. Output arrives in machine cycles; reserve energy protects against gaps.</p>
        {!f.active && f.integrity > 0 && <button className="primary-button" disabled={f.capacitor < coil.cost} onClick={() => act(activateDefense, 'Bunker defense activated.')}>Activate defense</button>}
        {!f.active && f.integrity < BUNKER_HP && <button className="primary-button" disabled={state.sparks < repairCost(f)} onClick={() => act(repairBunker, 'Bunker repaired. Prepare your reserve before restarting.')}>Repair bunker · {repairCost(f)} sparks</button>}
        {f.active && <p className="defense-live">Defense stays active across game screens. Hidden app time pauses attacks. At zero integrity, attacks stop and your progress is preserved.</p>}
      </section>
      <section><h2>Strengthen the coil</h2><p>Enemy kills drop scrap. Upgrades stay with you after a failed push.</p>
        {COIL_UPGRADES.map(u => { const level = f.upgrades[u.id], price = u.costs[level]; return <button key={u.id} className="coil-upgrade" disabled={price === undefined || f.scrap < price} onClick={() => act(s => upgradeCoil(s, u.id), `${u.name} improved.`)}><span><strong>{u.name} · {level}/{u.costs.length}</strong><small>{u.description}</small></span><b>{price === undefined ? 'Maxed' : `${price} scrap`}</b></button>; })}
      </section>
      <section className="support-panel"><h2>Cannon support</h2><p>Spend workshop sparks to support the coil against the same enemies. Each spark of charge deals 2 damage. Fires one queued shot per second across all game screens when a target is present.</p>
        <div className="charge-inputs"><label>Charge per shot<input aria-label="Cannon charge per shot" type="number" min="1" max="1000000" value={Number.isNaN(charge) ? '' : charge} onChange={e => setCharge(e.target.valueAsNumber)}/></label><label>Shots<select aria-label="Cannon shots to queue" value={count} onChange={e => setCount(Number(e.target.value))}>{[1,5,10].map(n => <option key={n} value={n}>{n}</option>)}</select></label></div>
        <div className="shot-presets">{[4,12,30, ...(target ? [Math.ceil(target.hp / 2)] : [])].filter((n,i,a) => a.indexOf(n) === i).map(n => <button key={n} onClick={() => setCharge(n)}>{n} charge</button>)}</div>
        <button className="primary-button" disabled={!canQueue} onClick={() => act(s => queueSupport(s, charge, count))}>Queue {count} shot{count > 1 ? 's' : ''} · {validCharge ? format(charge * count) : '—'} sparks</button>
        <div className="queue-chips" aria-label="Cannon queue">{f.queue.length ? f.queue.map((n,i) => <span key={i}>ϟ {format(n)}</span>) : <span>No shots queued</span>}</div>
        <button className="journal-button" disabled={!f.queue.length} onClick={() => act(cancelSupport)}>Cancel {f.queue.length}/50 shots & refund</button>
        <p>Unused damage does not carry to another enemy. Unfired shots are refunded on a successful claim or bunker defeat.</p>
      </section>
    </div>
  </section>;
}
