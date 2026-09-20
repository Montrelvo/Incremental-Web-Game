let context: AudioContext | undefined;
export function zap(enabled: boolean) {
  if (!enabled) return;
  try {
    context ??= new AudioContext();
    void context.resume().then(() => {
      const ctx = context!;
      const oscillator = ctx.createOscillator(), gain = ctx.createGain();
      const now = ctx.currentTime;
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(900, now);
      oscillator.frequency.exponentialRampToValueAtTime(70, now + .16);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.09, now + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .19);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(now); oscillator.stop(now + .2);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    }).catch(() => {});
  } catch { /* Audio is optional on unsupported devices. */ }
}
