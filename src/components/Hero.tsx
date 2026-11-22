import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.14 }
      );
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={root} className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p data-hero className="mb-4 flex items-center gap-4 text-xs font-medium tracking-[0.4em] text-aether-300/90">
        <span className="hidden h-px w-10 bg-aether-400/60 sm:block" />
        TECHFEST 30TH EDITION · IIT BOMBAY
        <span className="hidden h-px w-10 bg-aether-400/60 sm:block" />
      </p>

      <h1
        data-hero
        className="font-display text-4xl font-semibold leading-[1.15] tracking-[0.08em] sm:text-6xl lg:text-7xl"
      >
        <span className="gold-text drop-shadow-[0_0_35px_rgba(217,172,78,0.25)]">
          AN AETHERIAL
        </span>
        <br />
        <span className="text-transparent [background:linear-gradient(120deg,#7ff4ff,#17b8d4)] [background-clip:text] [-webkit-background-clip:text]">
          RENAISSANCE
        </span>
      </h1>

      <p data-hero className="mt-6 max-w-xl text-base font-light leading-relaxed tracking-wider text-gold-300/70 sm:text-lg">
        Where ancient wisdom converges with tomorrow's machines — a celestial confluence of art, science, and the cosmos.
      </p>

      <a data-hero href="#explore" className="explore-btn mt-10 px-10 py-3.5 font-display text-xs tracking-[0.35em] text-gold-300">
        EXPLORE
      </a>

      <div data-hero className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-gold-500/40 p-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-gold-400" />
        </div>
      </div>
    </div>
  );
}
