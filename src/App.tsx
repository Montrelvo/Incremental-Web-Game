import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as NativeApp } from '@capacitor/app';
import { MACHINES, UPGRADES, type GameState, freshState, gather, advance, buy, hire, startCycle, upgrade, cost, affordable, cycleYield, passiveRate, clickYield, parseSave, resume, format, rateFormat, recordDiscoveries } from './game/engine';
import { storage } from './platform/storage';
import Workshop from './components/Workshop';
import Modal from './components/Modal';
import Territory from './components/Territory';
import { tickFrontier, ownershipLimit } from './game/frontier';
import { zap } from './platform/sound';

type Panel = 'journal' | 'settings' | 'prestige' | 'reset' | 'complete' | 'defense-loss' | null;
const lessons = [
  { title: 'Power your bunker', id: '01', text: 'Generate sparks and build your first coil generator. Machines supply the energy that keeps the bunker alive.', check: (s: GameState) => s.machines[0].owned > 0 },
  { title: 'A steady supply', id: '02', text: 'Managers run generators automatically and work offline for up to eight hours. Combat pauses while the app is hidden.', check: (s: GameState) => s.machines.some(m => m.manager) },
  { title: 'Salvage the fallen', id: '03', text: 'Defeat frontier enemies to recover scrap. Energy fuels combat; scrap improves your defense equipment.', check: (s: GameState) => s.frontier.defeated > 0 },
  { title: 'Strengthen the coil', id: '04', text: 'Spend scrap on stronger discharges, a larger capacitor, and chaining arcs. Upgrades survive a failed push.', check: (s: GameState) => Object.values(s.frontier.upgrades).some(n => n > 0) },
  { title: 'Room to grow', id: '05', text: 'Clear a sector to reclaim territory, unlock generator capacity, and face a tougher frontier with better salvage.', check: (s: GameState) => s.frontier.claimed > 0 },
];
function Bolt({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 2-9 12h7l-2 8 9-13h-7l2-7Z" fill="currentColor" /></svg>; }

export default function App() {
  const [state, setState] = useState<GameState>(freshState);
  const current = useRef(state), clock = useRef(Date.now());
  const [ready, setReady] = useState(false), [saveStatus, setSaveStatus] = useState('Loading save…');
  const [notice, setNotice] = useState(''), [panel, setPanel] = useState<Panel>(null);
  const [view, setView] = useState<'workshop' | 'battle'>('workshop');
  const [burst, setBurst] = useState<{ x: number; y: number; id: number } | null>(null);
  const [quantity, setQuantity] = useState<1 | 10 | 'max'>(1);
  const [transfer, setTransfer] = useState(''), [transferError, setTransferError] = useState('');
  const [offline, setOffline] = useState<{ seconds: number; gained: number } | null>(null);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const blocked = useRef(false), saveQueue = useRef(Promise.resolve());
  const completeShown = useRef(false), combatPaused = useRef(document.hidden);
  const update = useCallback((fn: (s: GameState) => GameState) => {
    const now = Date.now();
    const settled = advance(current.current, Math.max(0, (now - clock.current) / 1000));
    clock.current = now;
    const next = recordDiscoveries(fn(settled)); next.lastSaved = now;
    current.current = next; setState(next); return next;
  }, []);
  const persist = useCallback(() => {
    if (blocked.current) return;
    const data = JSON.stringify(update(s => s));
    saveQueue.current = saveQueue.current.then(() => storage.write(data)).then(() => setSaveStatus('Progress saved')).catch(() => setSaveStatus('Save unavailable · export a backup'));
  }, [update]);
  useEffect(() => {
    let cancelled = false;
    storage.read().then(raw => {
      if (cancelled) return;
      try {
        const loaded = raw ? parseSave(raw) : freshState();
        if (!raw) loaded.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const result = resume(loaded);
        current.current = result.state; clock.current = Date.now(); setState(result.state);
        completeShown.current = loaded.frontier.claimed === 3;
        if (loaded.frontier.active) setView('battle');
        if (result.seconds >= 30 && result.gained > 0) setOffline(result);
        setSaveStatus('Progress saved');
      } catch {
        blocked.current = true; setStorageBlocked(true);
        setSaveStatus('Unreadable save · backup preserved');
        setNotice('Your previous save could not be loaded. It has been preserved. Open Settings to export it or start fresh.');
      }
      setReady(true);
    }).catch(() => { if (!cancelled) { setSaveStatus('Storage unavailable · export a backup'); setReady(true); } });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const tick = window.setInterval(() => { if (!document.hidden) update(s => s); }, 200);
    const save = window.setInterval(persist, 5000);
    const visibility = () => { combatPaused.current = document.hidden; update(s => s); persist(); };
    window.addEventListener('pagehide', persist); document.addEventListener('visibilitychange', visibility);
    const native = Capacitor.isNativePlatform() ? NativeApp.addListener('appStateChange', ({ isActive }) => { combatPaused.current = !isActive || document.hidden; update(s => s); persist(); }) : null;
    return () => { clearInterval(tick); clearInterval(save); window.removeEventListener('pagehide', persist); document.removeEventListener('visibilitychange', visibility); void native?.then(handle => handle.remove()); };
  }, [ready, persist, update]);
  useEffect(() => {
    if (!ready) return;
    const timer = window.setInterval(() => {
      if (document.hidden || combatPaused.current || !current.current.frontier.active) return;
      const before = current.current.frontier;
      const next = update(tickFrontier);
      if (!next.frontier.active) {
        setView('battle'); setPanel('defense-loss'); setNotice('');
      } else if (next.frontier.event === 'claim') {
        zap(next.sound); setNotice('Sector reclaimed. Production capacity increased!');
      } else if (before.push && !next.frontier.push && before.claimed === next.frontier.claimed) {
        setNotice('An enemy escaped. The push failed; your claimed territory is safe.');
      } else if (next.frontier.event === 'kill' || next.frontier.event === 'shot') zap(next.sound);
      persist();
    }, 1000);
    return () => clearInterval(timer);
  }, [ready, update, persist]);
  useEffect(() => { if (ready && state.frontier.claimed === 3 && !completeShown.current) { completeShown.current = true; setPanel('complete'); } }, [state.frontier.claimed, ready]);
  useEffect(() => { if (!notice) return; const timeout = setTimeout(() => setNotice(''), 6500); return () => clearTimeout(timeout); }, [notice]);
  const act = (fn: (s: GameState) => GameState, message?: string) => { update(fn); if (message) setNotice(message); persist(); };
  useEffect(() => { if (!burst) return; const timer = setTimeout(() => setBurst(null), 650); return () => clearTimeout(timer); }, [burst]);
  const close = () => { setPanel(null); setTransferError(''); };
  const isDiscovered = (i: number) => state.discoveries.includes(i) || lessons[i].check(state);
  const completed = lessons.filter((_, i) => isDiscovered(i)).length;
  const nextGoal = !state.machines[0].owned ? ['Power the bunker', 'Generate 12 sparks, then build a coil generator.'] : !state.machines[0].manager ? ['Automate your supply', 'Hire a coil keeper for 35 sparks.'] : !state.frontier.active ? [state.frontier.integrity === 0 ? 'Repair and regroup' : 'Prepare your defense', 'Open the frontier, fill your capacitor, and set automatic refill.'] : !state.frontier.defeated ? ['Salvage the fallen', 'Hold the perimeter and defeat incoming enemies for scrap.'] : !state.frontier.upgrades.discharge ? ['Strengthen the coil', 'Spend 6 scrap on your first discharge upgrade.'] : ['Reclaim the frontier', 'Prepare your reserves, then push into the next sector.'];

  function exportSave() { persist(); setTransfer(JSON.stringify(current.current, null, 2)); setTransferError(''); }
  function importSave() {
    try {
      const parsed = parseSave(transfer); const result = resume(parsed);
      blocked.current = false; setStorageBlocked(false); current.current = result.state; clock.current = Date.now(); setState(result.state);
      completeShown.current = result.state.frontier.claimed === 3; setView(result.state.frontier.active ? 'battle' : 'workshop'); persist(); setTransferError(''); setNotice('Save imported. Welcome back.'); close();
    } catch (error) { setTransferError(error instanceof Error ? error.message : 'Invalid save.'); }
  }
  if (!ready) return <div className="loading"><Bolt size={40} /><h1>Opening the workshop…</h1></div>;
  return <div className="app-shell">
    <a className="skip-link" href="#workshop">Skip to workshop</a>
    <aside className="sidebar">
      <a className="brand" href="#workshop"><span className="brand-mark"><Bolt size={23} /></span><span>THE INCREMENTAL<span className="brand-atlas">ATLAS</span></span></a>
      <div className="sidebar-label">YOUR EXPLORATION</div>
      <nav aria-label="Main navigation">
        <button className={`nav-item ${view === "workshop" ? "selected" : ""}`} onClick={() => setView("workshop")}><span>◈</span> Spark Workshop <span className="nav-number">01</span></button>
        <button className="nav-item" onClick={() => setPanel('journal')}><span>▤</span> Field journal <span className="nav-number">{completed}/5</span></button>
        <button className={`nav-item ${view === "battle" ? "selected" : ""}`} onClick={() => setView("battle")}><span>◎</span> Bunker frontier</button>
      </nav>
      <div className="sidebar-note"><span className="small-label">A LITTLE EXPERIMENT</span><p>Start with a spark.<br />See what grows.</p><span>Discover the systems behind<br />the numbers going up.</span></div>
      <div className="sidebar-bottom"><div className="chapter-progress"><span>CHAPTER DISCOVERY</span><strong>{completed}/5</strong></div><div className="thin-progress"><span style={{ width: `${completed / 5 * 100}%` }} /></div><button className="nav-item" onClick={() => setPanel('settings')}><span>⚙</span> Settings & saves</button><span className="version">V 1.1 · BUNKER FRONTIER</span></div>
    </aside>
    <main id="workshop">
      <header className="topbar"><span className="breadcrumb">THE ATLAS <span>/</span> CHAPTER 01</span><span className="save-state"><i />{saveStatus}</span><button className="mobile-settings" aria-label="Settings and saves" onClick={() => setPanel('settings')}>⚙</button></header>
      {state.frontier.active && <div className="tesla-alert" role="status"><span>Defense live · {state.frontier.integrity}/100 integrity · {format(state.frontier.capacitor)} reserve · {state.frontier.claimed}/3 sectors</span><button onClick={() => setView('battle')}>View frontier →</button></div>}
      {view === "workshop" && <><section className="page-heading"><div><div className="eyebrow">AN EXERCISE IN SMALL BEGINNINGS</div><h1>Spark Workshop<span>.</span></h1><p>A little effort. A clever machine. Something that keeps on growing.</p></div><button className="journal-button" onClick={() => setPanel('journal')}>▤ <span>Field journal</span> <span>↗</span></button></section>
      <section className="stats" aria-label="Workshop statistics">
        <div className="stat primary-stat"><span className="stat-icon"><Bolt size={24} /></span><div><span className="small-label">SPARKS AVAILABLE</span><strong data-testid="balance">{format(state.sparks)}<small> sparks</small></strong></div></div>
        <div className="stat"><span className="stat-outline">↗</span><div><span className="small-label">AUTOMATED OUTPUT</span><strong>{rateFormat(passiveRate(state))}<small> / sec</small></strong></div></div>
        <div className="stat"><span className="stat-outline">◇</span><div><span className="small-label">SALVAGED SCRAP</span><strong>{format(state.frontier.scrap)}<small> coil upgrades</small></strong></div></div>
      </section>
      {offline && <div className="offline-banner" role="status"><span>Welcome back. Your workshop made <strong>{format(offline.gained)} sparks</strong> during {Math.floor(offline.seconds / 60)} minutes away.</span><button onClick={() => setOffline(null)} aria-label="Dismiss offline earnings">×</button></div>}
      <section className="workshop-panel">
        <div className="panel-heading"><div><span className="status-dot" /> THE WORKBENCH</div><span>{state.machines.filter(m => m.manager).length}/3 SYSTEMS AUTOMATED</span></div>
        <Workshop state={state} />
        <div className="spark-control"><div><h2>Every idea starts somewhere.</h2><p>Make a spark. Put it to work.</p></div><button className="generate" onClick={() => act(gather)} aria-label={`Generate ${clickYield(state)} sparks`}><Bolt size={19} /> Generate spark <span>+{new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(clickYield(state))}</span></button></div>
      </section>
      <div className="content-grid"><section className="machines-section" aria-labelledby="machines-title">
        <div className="section-heading"><h2 id="machines-title">Your machines <span>03</span></h2><div className="buy-controls" aria-label="Purchase quantity"><span>BUY</span>{([1, 10, 'max'] as const).map(n => <button key={n} aria-pressed={quantity === n} className={quantity === n ? 'active' : ''} onClick={() => setQuantity(n)}>{n === 'max' ? 'MAX' : `×${n}`}</button>)}</div></div>
        <div className="machine-list">{MACHINES.map((machine, i) => {
          const m = state.machines[i], count = quantity === 'max' ? affordable(state, i) : quantity;
          const price = cost(state, i, Math.max(1, count)); const producing = m.remaining > 0;
          return <article className={`machine-card ${m.owned ? 'owned' : ''}`} key={machine.id}>
            <div className={`machine-emblem machine-${i}`} aria-hidden="true">{['≋', '☷', 'ϟ'][i]}</div>
            <div className="machine-info"><div className="machine-title"><h3>{machine.name}</h3><span className="owned-count">{m.owned} owned</span></div><p>{machine.description}</p><div className="machine-metrics"><strong>{rateFormat(cycleYield(state, i) / machine.seconds)} <span>sparks/s when running</span></strong><span>{machine.seconds}s cycle</span></div></div>
            <button className="buy-button" disabled={count === 0 || state.sparks < price || m.owned + Math.max(1, count) > ownershipLimit(state)} onClick={() => act(s => buy(s, i, count), `${count} ${machine.name}${count > 1 ? 's' : ''} added.`)} aria-label={`Buy ${count || 1} ${machine.name}`}><span>{m.owned >= ownershipLimit(state) ? 'At capacity' : `Build ${count > 1 ? `×${count}` : ''}`}</span><strong><Bolt size={12} /> {format(price)}</strong></button>
            <div className="machine-operation"><button className="run-button" disabled={!m.owned || producing || m.manager} onClick={() => act(s => startCycle(s, i))}><span className="cycle-progress" style={{ width: `${producing ? (1 - m.remaining / machine.seconds) * 100 : 0}%` }} /><span>{m.manager ? '↻ Automated' : producing ? 'Producing…' : '▷ Run cycle'} <small>+{format(cycleYield(state, i))}</small></span></button><button className={`manager-button ${m.manager ? 'hired' : ''}`} disabled={!m.owned || m.manager || state.sparks < machine.manager} onClick={() => act(s => hire(s, i), `${machine.role} hired. This machine now runs itself.`)}>{m.manager ? '✓ Manager hired' : `Hire manager · ${format(machine.manager)}`}</button></div>
            <div className="milestone"><div><span style={{ width: `${m.owned >= 100 ? 100 : m.owned % 10 * 10}%`, backgroundColor: machine.color }} /></div><span>{m.owned >= ownershipLimit(state) ? 'Reclaim territory for more capacity' : `${m.owned % 10}/10 to next ×2 output`}</span></div>
          </article>;
        })}</div>
      </section>
      <aside className="workshop-aside"><section className="next-step"><div className="small-label">{state.frontier.claimed === 3 ? 'REGION RECLAIMED' : 'YOUR NEXT STEP'} <span>↗</span></div><h2>{state.frontier.claimed === 3 ? 'A foothold beyond the bunker.' : nextGoal[0]}</h2><p>{state.frontier.claimed === 3 ? 'All three sectors are secured. Hold the relay grounds and keep strengthening your coil.' : nextGoal[1]}</p><div className="goal-progress"><span style={{ width: `${state.frontier.claimed / 3 * 100}%` }} /></div><div className="goal-caption"><span>{state.frontier.claimed} / 3 sectors reclaimed</span><span>{ownershipLimit(state)} generators / type</span></div><button className="journal-button" onClick={() => setView('battle')}>Open bunker frontier →</button></section>
        <section className="upgrades"><div className="section-heading"><h2>Fine-tune your craft</h2><span>↗</span></div>{UPGRADES.map(u => <button key={u.id} className="upgrade" disabled={state.upgrades.includes(u.id) || state.sparks < u.cost} onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); const before = current.current.upgrades.length; const next = update(s => upgrade(s, u.id)); if (next.upgrades.length > before) { setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, id: Date.now() }); zap(next.sound); setNotice(`${u.name} installed.`); persist(); } }}><span className="upgrade-symbol">{u.id === 'gloves' ? '✧' : u.id === 'wiring' ? '⌁' : '◉'}</span><span><strong>{u.name}</strong><small>{u.text}</small></span><span className="upgrade-price">{state.upgrades.includes(u.id) ? '✓' : format(u.cost)}</span></button>)}</section>
        <section className="rekindle"><span className="small-label">ROOM TO GROW</span><h2>Build your supply.<br />Reclaim the frontier.</h2><p>Enemy salvage strengthens the coil.<br />Territory makes room for more generators.</p><button onClick={() => setView('battle')}>Prepare your next push <span>↗</span></button><small>{format(state.earned)} sparks generated this run</small></section>
      </aside></div>
      </>}
      {view === "battle" && <Territory state={state} act={act} />}
      <footer><span>Generate. Defend. Salvage. Reclaim.</span><button onClick={() => setPanel('journal')}>{completed} of 5 discoveries made <span>↗</span></button></footer>
    </main>
    {burst && <div key={burst.id} className={`upgrade-burst ${state.reducedMotion ? 'still' : ''}`} style={{ left: burst.x, top: burst.y }} aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 30}deg)` }}><b /></i>)}<span>ϟ</span></div>}
    <div className="toast" role="status" aria-live="polite">{notice}</div>
    {panel === 'defense-loss' && <Modal title="Regroup at the bunker" close={close}><p>Your bunker integrity reached zero. Attacks have stopped. Machines, upgrades, scrap, ember cores, and reclaimed sectors are preserved.</p><p>Unused cannon charges and capacitor energy have returned to your spark balance. Generate sparks to repair, refill your reserve, then restart when ready.</p><button className="primary-button" onClick={close}>Prepare the next defense</button></Modal>}
    {panel === 'journal' && <Modal title="Your field journal" close={close}><p className="modal-intro">Small experiments. Lasting discoveries. Play to uncover five ideas from the incremental atlas.</p>{lessons.map((l, i) => <article className={`lesson ${isDiscovered(i) ? 'discovered' : ''}`} key={l.id}><span>{isDiscovered(i) ? '✓' : '○'}</span><div><small>{l.id} · {isDiscovered(i) ? 'DISCOVERED' : 'TO EXPLORE'}</small><h3>{l.title}</h3><p>{l.text}</p></div></article>)}</Modal>}
    {panel === 'prestige' && <Modal title="Expeditions ahead" close={close}><p>Rekindling is paused while expedition progression is redesigned. Your existing {state.cores} ember cores still grant +{state.cores * 25}% production.</p></Modal>}
    {panel === 'complete' && <Modal title="A region reclaimed" close={close}><div className="completion-icon">✧</div><p className="modal-intro">Perimeter. Scrapyard. Relay grounds. Your bunker has room to grow.</p><p>All three sectors are secured, unlocking capacity for 100 generators of each type. Hold the frontier, recover salvage, and continue improving your defenses.</p><button className="primary-button" onClick={close}>Return to the frontier</button></Modal>}
    {panel === 'settings' && <Modal title="Make yourself at home" close={close}><label className="setting-row"><span><strong>Sound effects</strong><small>Upgrade zaps and cannon shots.</small></span><input type="checkbox" checked={state.sound} onChange={e => act(s => ({ ...s, sound: e.target.checked }))} /></label><label className="setting-row"><span><strong>Reduce motion</strong><small>Keep workshop and combat effects still.</small></span><input type="checkbox" checked={state.reducedMotion} onChange={e => act(s => ({ ...s, reducedMotion: e.target.checked }))} /></label><p className="muted">Autosaved every 5 seconds and after actions, on this device. Defense pauses while hidden. Managers work offline for up to 8 hours. Saves are not automatically synced between devices.</p><p className="muted">Legacy ember cores: {state.cores} · +{state.cores * 25}% production. Rekindling is paused while expedition progression is redesigned. Legacy records: {state.combat.defeated} cannon defeats, {state.tesla.defeated} Tesla defeats, {state.legacyDiscoveries.length}/5 journal discoveries.</p><div className="settings-actions"><button onClick={exportSave}>Export current save</button>{storageBlocked && <button onClick={() => void storage.read().then(raw => setTransfer(raw || '')).catch(() => setTransferError('Cannot read the original save.'))}>Export preserved save</button>}</div><label className="save-label" htmlFor="save-transfer">Save backup · copy to keep, or paste to import</label><textarea id="save-transfer" value={transfer} onChange={e => setTransfer(e.target.value)} placeholder="Your exported save appears here. You can also paste a save from another device." spellCheck={false} /><p className="muted">Import replaces this device’s current progress. Export it first if you want to keep it.</p>{transferError && <p className="error" role="alert">{transferError}</p>}<button className="primary-button" disabled={!transfer.trim()} onClick={importSave}>Import this save</button><div className="danger-section"><button onClick={() => setPanel('reset')}>Start a fresh workshop</button><span>Erases progress on this device.</span></div></Modal>}
    {panel === 'reset' && <Modal title="Start completely fresh?" close={close}><p>This erases all workshop, defense, salvage, territory, ember core, and journal progress on this device. Export a backup in Settings if you want to keep this workshop.</p><button className="primary-button" onClick={() => { blocked.current = false; setStorageBlocked(false); current.current = freshState(); clock.current = Date.now(); completeShown.current = false; update(s => s); persist(); close(); setNotice('A fresh page. A new spark.'); }}>Erase progress and start fresh</button><button className="text-button" onClick={() => setPanel('settings')}>Back to settings</button></Modal>}
  </div>;
}
