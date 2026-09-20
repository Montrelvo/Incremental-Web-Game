import { useState } from 'react';
import { zap } from '../platform/sound';
import { format, type GameState } from '../game/engine';
import { setTeslaPower, startTesla, teslaThreat } from '../game/tesla';

export default function Tesla({ state, act }: { state: GameState; act: (fn: (s: GameState) => GameState) => void }) {
  const [accepted, setAccepted] = useState(false);
  const t = state.tesla, threat = teslaThreat(state);
  const paid = Math.min(t.power, Math.floor(state.sparks));
  return <section className={`tesla-game ${state.reducedMotion ? 'still' : ''}`}>
    <div className="battle-heading"><div><span className="eyebrow">HIGH VOLTAGE / HIGH STAKES</span><h1>Tesla perimeter<span>.</span></h1><p>Power the coil. Hold the line. Protect everything you have built.</p></div></div>
    <div className="tesla-metrics"><span><small>SPARKS</small><strong>{format(state.sparks)}</strong></span><span><small>NEXT MOB STRENGTH</small><strong>{threat.strength}</strong></span><span><small>SPAWN INTERVAL</small><strong>{threat.interval}s</strong></span><span><small>DEFEATED</small><strong>{t.defeated}</strong></span></div>
    <div className={`tesla-arena ${t.broken ? 'broken' : ''}`}>
      <span className="arena-caption">{t.broken ? 'COIL BREACHED — RESET IMMINENT' : t.active ? 'PERIMETER LIVE' : 'PERIMETER OFFLINE'} · MOBS APPROACH FROM THE RIGHT</span>
      <svg viewBox="0 0 800 290" role="img" aria-label={`Tesla coil ${t.broken ? 'broken' : 'intact'}, ${t.mobs.length} approaching mobs.`}>
        <path d="M35 245H775" stroke="#718b7b" strokeWidth="2"/><path d="M45 50V245" stroke="#d77c60" strokeWidth="3" strokeDasharray="5 7"/>
        <text x="25" y="275" fill="#e8aa88" fontSize="12">RESET LINE</text>
        <g className={t.broken ? 'coil-broken' : ''}>
          <path d="M220 242L230 215H290L302 242Z" fill="#91a8a0"/><path d="M247 213V125H274V213" fill="#b28a54"/>
          {[135,150,165,180,195].map(y => <path key={y} d={`M236 ${y}H285`} stroke="#dec496" strokeWidth="7"/>)}
          <ellipse cx="260" cy="111" rx="44" ry="18" fill="#a8c5c5" stroke="#e2efcf" strokeWidth="4"/>
        </g>
        {t.active && !t.broken && t.event !== 'idle' && <path key={t.ticks} className="tesla-arc" d="M260 97L287 53L273 79L321 66L305 97L350 135L331 122L360 172" fill="none" stroke="#a0f5ed" strokeWidth="5"/>}
        {t.broken && <g key={t.ticks} className="tesla-break" stroke="#ffba65" strokeWidth="5"><path d="M260 105L210 58M274 119L331 65M277 140L336 156M245 133L195 170M260 97L258 42"/></g>}
        {t.mobs.map(m => <g key={m.id} className="tesla-mob" style={{ transform: `translate(${45 + m.position * 71.5}px, 180px)` }}><path d="M-19 0H19V42H-19Z" fill={m.position <= 3 ? '#a76248' : '#708a8a'} stroke="#d1c9a2" strokeWidth="3"/><path d="M-14 43L-18 63M14 43L18 63" stroke="#abbcb3" strokeWidth="8"/><path d="M-11 13H-4M4 13H11" stroke="#ffe6aa" strokeWidth="4"/><text y="-13" textAnchor="middle" fill="#fce4ae" fontSize="15">{m.strength}</text></g>)}
      </svg>
      <p className="tesla-status" role="status">{t.broken ? 'The coil shattered. A breached mob is heading for the reset line.' : t.active ? `Tick ${t.ticks} · ${t.event === 'kill' ? 'Mob vaporized!' : 'Coil charging.'}` : 'Choose your power allocation, then start when ready.'}</p>
    </div>
    <div className="battle-controls"><section><h2>Sparks per tick</h2><p>One tick is one second. Each spark spent supplies one power. Power must be <strong>strictly greater</strong> than the mob’s strength when it reaches the coil. Equal power loses.</p><div className="charge-inputs"><label>Coil allocation<input type="number" min="1" max="1000000" step="1" value={t.power} disabled={t.broken} onChange={e => act(s => setTeslaPower(s, e.target.valueAsNumber))}/></label></div><div className="shot-presets">{[1, threat.strength + 1, (threat.strength + 1) * 2].map(n => <button key={n} disabled={t.broken} onClick={() => act(s => setTeslaPower(s, n))}>{n} sparks / tick</button>)}</div><p>Available power with your current balance: <strong>{paid}</strong>. Insufficient funds supply only the whole sparks remaining. An intact coil consumes power even between mobs.</p></section>
      <section><h2>Generator pressure</h2><p>Copper coils contribute 1 threat each, induction wheels 4, and arc dynamos 12. Mob strength is 1 + total threat. Spawn interval falls from 6 seconds to 1 second as threat rises (one second faster per 20 threat).</p><p>Generator purchases affect newly spawned mobs. Existing mobs keep their strength. A broken coil cannot recover; a mob reaching the left edge resets sparks, generators, upgrades, cores, journal, cannon stages, and Tesla progress.</p><p>Active defense continues while you use other game tabs. Hidden browser/app time is paused, with no offline attacks. Rekindling is unavailable during a run.</p>
        {!t.active && <><label className="tesla-consent"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}/>I understand a breach will erase all game progress.</label><button className="primary-button" disabled={!accepted} onClick={() => { zap(state.sound); act(startTesla); }}>Start Tesla survival</button></>}
        {t.active && <strong>{t.broken ? 'Perimeter lost' : 'Survival active — defend the coil'}</strong>}
      </section></div>
  </section>;
}
