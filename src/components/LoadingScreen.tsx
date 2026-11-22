import { useEffect, useState } from 'react';

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const DURATION = 2200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setProgress(Math.floor(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        setTimeout(onDone, 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030409] transition-all duration-700 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={leaving}
    >
      <div className="relative mb-10 h-28 w-28">
        <div className="absolute inset-0 animate-spin rounded-full border border-gold-500/60 [animation-duration:6s]" />
        <div className="absolute inset-2 animate-spin rounded-full border border-aether-400/50 [animation-duration:4s] [animation-direction:reverse]" />
        <div className="absolute inset-[38%] rounded-full bg-gold-400 shadow-[0_0_30px_rgba(217,172,78,0.8)]" />
      </div>

      <p className="font-display text-xs tracking-widest2 text-gold-300">TECHFEST IIT BOMBAY</p>
      <p className="mt-2 text-sm tracking-[0.2em] text-aether-300/80">30TH EDITION</p>

      <div className="mt-8 h-px w-56 overflow-hidden bg-gold-500/20">
        <div
          className="h-full bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600 transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs tracking-[0.3em] text-gold-400/70">{progress}%</p>
    </div>
  );
}
