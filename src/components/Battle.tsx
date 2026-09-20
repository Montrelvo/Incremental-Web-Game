import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../game/engine';
import { format } from '../game/engine';
import { cancelShots, enemy, fireShot, queueShots } from '../game/combat';
import { zap } from '../platform/sound';

export default function Battle({ state, act }: { state: GameState; act: (fn: (s: GameState) => GameState) => void }) {
  const [charge, setCharge] = useState(1), [count, setCount] = useState(1);
  const [shot, setShot] = useState(0), [impact, setImpact] = useState('');
  const latest = useRef({ state, act }); latest.current = { state, act };
  const c = state.combat, target = enemy(c.stage, c.encounter);
  useEffect(() => {
    const timer = window.setInterval(() => {
      const { state: s, act: commit } = latest.current;
      if (document.hidden || !s.combat.queue.length || s.combat.complete) return;
      const damage = s.combat.queue[0] * 2;
      setImpact(`${Math.min(damage, s.combat.hp)} damage${damage >= s.combat.hp ? ' · defeated!' : ''}`);
      setShot(n => n + 1); zap(s.sound); commit(fireShot);
    }, 700);
    return () => clearInterval(timer);
  }, []);
  const valid = Number.isSafeInteger(charge) && charge >= 1 && charge <= 1000000;
  const canQueue = valid && state.sparks >= charge * count && c.queue.length + count <= 50 && !c.complete;
  return <section className={`battle ${state.reducedMotion ? 'still' : ''}`}>
    <div className="battle-heading"><div><span className="eyebrow">THE SCRAPYARD CIRCUIT</span><h1>Mobs and Bosses<span>.</span></h1><p>Turn workshop sparks into firepower. One spark charges 2 damage.</p></div><span className="stage-badge">STAGE {c.stage} / 10</span></div>
    <div className="stage-track" aria-label={`Stage ${c.stage} of 10`}>{Array.from({ length: 10 }, (_, i) => <span key={i} className={i + 1 < c.stage || c.complete ? 'cleared' : i + 1 === c.stage ? 'current' : ''}>{i + 1}</span>)}</div>
    <div className="battle-arena" role="img" aria-label={`Cannon aimed at ${target.name}. ${c.hp} of ${target.hp} health.`}>
      <div className="arena-grid" />
      <span className="arena-caption">SPARK ARTILLERY / ENEMY {c.encounter + 1} OF 10</span>
      <svg className="battle-art" viewBox="0 0 800 320" aria-hidden="true">
        <defs><linearGradient id="steel" x2="1" y2="1"><stop stopColor="#a8b9b8"/><stop offset=".5" stopColor="#657d80"/><stop offset="1" stopColor="#344e55"/></linearGradient></defs>
        <path d="M35 265H765" stroke="#718b7b" strokeWidth="2"/>
        <g className={shot ? 'cannon recoil' : 'cannon'} key={`c${shot}`}>
          <path d="M95 238L120 187H183L214 238Z" fill="#496458" stroke="#acc6ad" strokeWidth="3"/>
          <path d="M134 188V152H280V193H134Z" fill="url(#steel)" stroke="#b2c4bf" strokeWidth="4"/>
          <path d="M265 147H284V199H265Z" fill="#bd8d50"/>
          <circle cx="119" cy="241" r="25" fill="#263e37" stroke="#a3b69d" strokeWidth="7"/><circle cx="192" cy="241" r="25" fill="#263e37" stroke="#a3b69d" strokeWidth="7"/>
          <path d="M155 160L145 175H159L151 187L174 169H160L167 160Z" fill="#ffe2a0"/>
        </g>
        {!c.complete && <g className={`metal-enemy ${target.kind === 'Stage boss' ? 'boss' : target.kind === 'Mini boss' ? 'mini-boss' : ''}`}>
          <path d="M600 215L592 260H620L633 218M656 218L668 260H696L683 213" fill="#738b8c" stroke="#b2c2b5" strokeWidth="4"/>
          <path d="M592 147L570 202L589 214L614 165M680 147L711 199L693 215L666 170" fill="url(#steel)" stroke="#bdc7b9" strokeWidth="4"/>
          <path d="M605 127H676L687 218H593Z" fill="url(#steel)" stroke="#d1c9a2" strokeWidth="4"/>
          <rect x="612" y="91" width="57" height="47" rx="9" fill="#879b96" stroke="#d1c9a2" strokeWidth="4"/>
          <path d="M622 113H633M647 113H658" stroke={target.kind === 'Metal mob' ? '#ffe4a3' : '#ff9673'} strokeWidth="6"/>
          <circle cx="640" cy="171" r="15" fill="#293f3e" stroke="#d7aa65" strokeWidth="5"/>
          {target.kind !== 'Metal mob' && <path d="M610 88L605 65L631 78L642 57L652 78L675 65L670 88Z" fill="#d7aa65"/>}
        </g>}
        {shot > 0 && <g key={`s${shot}`} className="shot-effect"><circle className="muzzle-flash" cx="289" cy="173" r="24" fill="#ffdf7a"/><path className="shot-beam" d="M286 173L363 166L422 183L486 162L538 176L624 171" fill="none" stroke="#ffe7a0" strokeWidth="7"/><g className="hit-burst" stroke="#ffda83" strokeWidth="5"><path d="M619 150L599 126M646 146L660 120M657 171L689 166M640 190L653 219M617 187L594 206"/></g></g>}
      </svg>
      <div className="enemy-health"><div><strong>{c.complete ? 'Circuit complete!' : target.name}</strong><span>{c.complete ? 'All 10 stages cleared' : `${target.kind} · ${c.hp} / ${target.hp} HP`}</span></div><progress max={target.hp} value={c.hp} /></div>
      <div className="damage-readout" key={shot} role="status">{impact || 'Charge the cannon to begin.'}</div>
    </div>
    <div className="battle-controls"><section><h2>Charge & queue</h2><p>Each shot costs its charge in sparks. Unused damage does not carry to the next enemy.</p><div className="charge-inputs"><label>Charge per shot<input type="number" min="1" max="1000000" step="1" value={Number.isNaN(charge) ? '' : charge} onChange={e => setCharge(e.target.valueAsNumber)}/></label><label>Shots to queue<select aria-label="Shots to queue" value={count} onChange={e => setCount(Number(e.target.value))}>{[1, 5, 10].map(n => <option key={n} value={n}>{n} shot{n > 1 ? 's' : ''}</option>)}</select></label></div><div className="shot-presets">{[1, 5, 10, Math.ceil(c.hp / 2)].filter((v, i, a) => v > 0 && a.indexOf(v) === i).map(n => <button key={n} onClick={() => setCharge(n)}>{n} charge</button>)}</div><button className="primary-button" disabled={!canQueue} onClick={() => { zap(state.sound); act(s => queueShots(s, charge, count)); }}>{c.complete ? 'All stages cleared' : `Queue ${count} shot${count > 1 ? 's' : ''} · ${valid ? format(charge * count) : '—'} sparks`}</button><p className="shot-summary">{valid ? format(charge * 2) : '—'} damage per shot · {format(state.sparks)} sparks available</p></section>
    <section><h2>Firing queue <span>{c.queue.length}/50</span></h2><p>Fires every 0.7 seconds while this tab is open. Queued charges are paid upfront and saved. Returning to the workshop pauses firing.</p><div className="queue-chips">{c.queue.length ? c.queue.map((n, i) => <span key={i}>ϟ {format(n)}</span>) : <span>No shots queued</span>}</div><button className="journal-button" disabled={!c.queue.length} onClick={() => act(cancelShots)}>Cancel queue & refund sparks</button><p className="battle-rule">Four mobs → mini boss → four mobs → stage boss.<br/>Stage {c.stage}: mobs {enemy(c.stage, 0).hp} HP · mini boss {enemy(c.stage, 4).hp} HP · boss {enemy(c.stage, 9).hp} HP.</p><strong>{c.defeated} / 100 enemies defeated</strong>{c.complete && <p>All ten stages conquered. Remaining queued charges have been refunded.</p>}</section></div>
  </section>;
}
