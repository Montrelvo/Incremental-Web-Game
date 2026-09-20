import { useEffect, useRef } from 'react';
import type { GameState } from '../game/engine';
import { MACHINES } from '../game/engine';

export default function Workshop({ state }: { state: GameState }) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(state); latest.current = state;
  useEffect(() => {
    let disposed = false;
    let game: import('phaser').Game | undefined;
    import('phaser').then(({ default: Phaser }) => {
      if (disposed || !host.current) return;
      class WorkshopScene extends Phaser.Scene {
        pen!: import('phaser').GameObjects.Graphics;
        create() {
          this.pen = this.add.graphics();
          const textStyle = { fontFamily: 'monospace', fontSize: '11px', color: '#68796b' };
          this.add.text(38, 25, 'FIG. 01 / SPARK CONVERSION ARRAY', textStyle);
          this.add.text(716, 25, 'WORKSHOP SCHEMATIC', textStyle);
          ['01  COPPER COIL', '02  INDUCTION WHEEL', '03  ARC DYNAMO'].forEach((label, i) => {
            this.add.text(215 + i * 265, 276, label, textStyle).setOrigin(.5);
          });
        }
        update(time: number) {
          const s = latest.current, g = this.pen;
          const motion = !(s.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
          g.clear();
          // Drafting grid, wire paths, and a warm paper background.
          g.fillStyle(0xecefe5); g.fillRect(0, 0, 960, 320);
          g.fillStyle(0xcbd3c4, .65);
          for (let x = 20; x < 960; x += 20) for (let y = 60; y < 270; y += 20) g.fillCircle(x, y, .8);
          g.lineStyle(2, 0xa6b4a1);
          g.beginPath(); g.moveTo(85, 205); g.lineTo(85, 240); g.lineTo(875, 240); g.lineTo(875, 160); g.strokePath();
          for (let i = 0; i < 3; i++) {
            const x = 215 + i * 265, m = s.machines[i];
            const active = m.remaining > 0;
            const color = !m.owned ? 0xaab5a5 : i === 0 ? 0xb77542 : i === 1 ? 0x62836d : 0x607d90;
            g.lineStyle(2, 0xa6b4a1); g.lineBetween(x, 213, x, 240);
            g.fillStyle(0xdee4d6); g.fillEllipse(x, 226, 150, 18);
            g.fillStyle(0xf7f7ef); g.lineStyle(2, color); g.fillRoundedRect(x - 66, 105, 132, 113, 9); g.strokeRoundedRect(x - 66, 105, 132, 113, 9);
            g.fillStyle(color, .12); g.fillRoundedRect(x - 60, 111, 120, 88, 5);
            g.lineStyle(3, color);
            if (i === 0) {
              g.lineBetween(x - 45, 150, x - 32, 150); g.lineBetween(x + 33, 150, x + 45, 150);
              for (let j = 0; j < 6; j++) g.strokeEllipse(x - 27 + j * 11, 150, 16, 53);
              g.lineStyle(1, color); g.lineBetween(x - 39, 184, x + 39, 184);
            } else if (i === 1) {
              g.strokeCircle(x, 153, 38); g.strokeCircle(x, 153, 29); g.fillStyle(color); g.fillCircle(x, 153, 6);
              const angle = active && motion ? time / 1700 : .3;
              for (let j = 0; j < 6; j++) { const a = angle + j * Math.PI / 3; g.lineBetween(x + Math.cos(a) * 9, 153 + Math.sin(a) * 9, x + Math.cos(a) * 28, 153 + Math.sin(a) * 28); }
            } else {
              g.strokeRoundedRect(x - 27, 118, 54, 71, 18);
              g.lineBetween(x - 35, 126, x + 35, 126); g.lineBetween(x - 35, 183, x + 35, 183);
              g.fillStyle(color); g.fillPoints([{ x: x + 4, y: 132 }, { x: x - 15, y: 158 }, { x, y: 158 }, { x: x - 4, y: 179 }, { x: x + 17, y: 150 }, { x: x + 2, y: 150 }], true);
            }
            g.fillStyle(active ? 0x64856a : 0xc8cdbf); g.fillCircle(x - 48, 207, 3);
            g.lineStyle(2, 0xc7cfbf); g.lineBetween(x - 34, 207, x + 46, 207);
            const progress = active ? 1 - m.remaining / MACHINES[i].seconds : 0;
            g.lineStyle(2, color); g.lineBetween(x - 34, 207, x - 34 + 80 * progress, 207);
            if (active && motion) {
              const y = 90 - ((time / 28 + i * 7) % 35);
              g.fillStyle(0xc78b4d, .7); g.fillCircle(x, y, 2); g.fillCircle(x + 17, y + 14, 1.5);
            }
          }
          // Input terminal and output battery.
          g.lineStyle(2, 0x6b806c); g.fillStyle(0xf7f7ef); g.fillCircle(85, 185, 22); g.strokeCircle(85, 185, 22);
          g.lineBetween(76, 185, 94, 185); g.lineBetween(85, 176, 85, 194);
          g.fillRoundedRect(852, 126, 46, 72, 7); g.strokeRoundedRect(852, 126, 46, 72, 7);
          g.fillStyle(0x6b806c); g.fillRect(868, 120, 14, 6);
          for (let j = 0; j < 4; j++) { g.fillStyle(0x6b806c, s.lifetime > j * 5000 ? .75 : .12); g.fillRect(860, 182 - j * 14, 30, 9); }
          if (motion && s.machines.some(m => m.manager)) {
            g.fillStyle(0xb77542); g.fillCircle(100 + (time / 6) % 760, 240, 3);
          }
        }
      }
      game = new Phaser.Game({ type: Phaser.CANVAS, width: 960, height: 320, parent: host.current,
        backgroundColor: '#ecefe5', scene: WorkshopScene, banner: false,
        fps: { target: 30, forceSetTimeOut: true },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        audio: { noAudio: true }, input: { keyboard: false, mouse: false, touch: false } });
    }).catch(() => { if (host.current) host.current.textContent = 'Workshop diagram unavailable. All controls below remain playable.'; });
    return () => { disposed = true; game?.destroy(true); };
  }, []);
  return <div className="schematic" ref={host} role="img" aria-label="Animated schematic of a copper coil, induction wheel and arc dynamo connected to a battery" />;
}
