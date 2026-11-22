import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExperienceCanvas from './components/ExperienceCanvas';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sections, { type SectionId } from './components/Sections';
import DetailPanel, { type DetailPayload } from './components/DetailPanel';
import { PERF_SETTINGS, systemPrefersLite, PerfModeContext } from './store/performanceMode';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [immersive, setImmersive] = useState(() => !systemPrefersLite());
  const [detail, setDetail] = useState<DetailPayload | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;
    let raf: number;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        (window as unknown as { __scrollProgress?: number }).__scrollProgress = self.progress;
      },
    });

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMedia = () => setImmersive(!media.matches);
    media.addEventListener('change', onMedia);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      trigger.kill();
      media.removeEventListener('change', onMedia);
      document.body.style.cursor = 'auto';
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') as SectionId);
          }
        }
      },
      { threshold: 0.45 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [loading]);

  const handleSelect = useCallback((p: DetailPayload | null) => setDetail(p), []);
  const perf = PERF_SETTINGS[immersive ? 'immersive' : 'lite'];

  return (
    <PerfModeContext.Provider value={perf.mode}>
      <div className="relative min-h-screen">
        {loading && <LoadingScreen onDone={() => { setLoading(false); setReady(true); }} />}

        <ExperienceCanvas immersive={immersive} onSelect={handleSelect} />

        <Navbar
          activeSection={activeSection}
          immersive={immersive}
          onToggleMode={() => setImmersive((v) => !v)}
        />

        <main className={`relative z-10 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <Hero ready={ready} />
          <Sections onOpenDetail={handleSelect} />
        </main>

        <DetailPanel detail={detail} onClose={() => setDetail(null)} />
      </div>
    </PerfModeContext.Provider>
  );
}
