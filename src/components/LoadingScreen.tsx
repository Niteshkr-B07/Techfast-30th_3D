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
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#030409] transition-all duration-700 ${
        leaving ? 'pointer-events-none opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ transition: 'opacity 0.9s ease, transform 0.9s ease' }}
      aria-hidden={leaving}
    >
      {/* Particle background: animated gradient pulses */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(63,217,238,0.04) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 30% 40%, rgba(217,172,78,0.05) 0%, transparent 70%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />
      {/* Dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full"
          aria-hidden
          style={{
            width: `${3 + (i % 4)}px`,
            height: `${3 + (i % 4)}px`,
            left: `${8 + (i * 7.5) % 85}%`,
            top: `${10 + (i * 11) % 80}%`,
            background: i % 2 === 0 ? 'rgba(217,172,78,0.4)' : 'rgba(63,217,238,0.35)',
            animation: `float-mote ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {/* Three-ring spinner */}
      <div className="relative mb-10 h-28 w-28">
        {/* Outer ring — gold, slow */}
        <div
          className="absolute inset-0 animate-spin rounded-full border border-gold-500/60"
          style={{ animationDuration: '6s' }}
        />
        {/* Middle ring — cyan, medium reverse */}
        <div
          className="absolute inset-2 animate-spin rounded-full border border-aether-400/60"
          style={{ animationDuration: '4s', animationDirection: 'reverse' }}
        />
        {/* Inner ring — gold, fast */}
        <div
          className="absolute inset-4 animate-spin rounded-full border border-gold-400/40"
          style={{ animationDuration: '2.5s' }}
        />
        {/* Core orb */}
        <div className="absolute inset-[38%] rounded-full bg-gold-400 shadow-[0_0_30px_rgba(217,172,78,0.8)]" />
      </div>

      <p className="font-display text-xs tracking-widest2 text-gold-300">TECHFEST IIT BOMBAY</p>
      <p className="mt-2 text-sm tracking-[0.2em] text-aether-300/80">30TH EDITION</p>
      {/* Theme subtitle */}
      <p
        className="mt-1 text-[10px] tracking-[0.35em] text-gold-400/60"
        style={{ fontStyle: 'italic' }}
      >
        AN AETHERIAL RENAISSANCE
      </p>

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
