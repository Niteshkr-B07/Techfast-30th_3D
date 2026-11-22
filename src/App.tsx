import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExperienceCanvas from './components/ExperienceCanvas';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sections, { SECTION_IDS, type SectionId } from './components/Sections';
import DetailPanel, { type DetailPayload } from './components/DetailPanel';
import { PERF_SETTINGS, systemPrefersLite, PerfModeContext } from './store/performanceMode';
import { setScrollProgress, useScrollToSection } from './store/scrollProgress';
import { CAMERA_STOPS } from './data/cameraStops';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [immersive, setImmersive] = useState(() => !systemPrefersLite());
  const [detail, setDetail] = useState<DetailPayload | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const scrollToSection = useScrollToSection(CAMERA_STOPS.length);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let raf = 0;
    let paused = false;

    const loop = (time: number) => {
      if (!paused) lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Lenis is the single source of truth for scroll position;
    // ScrollTrigger reads from it, so navigation and manual scrolling
    // stay perfectly synchronized with the camera.
    lenis.on('scroll', ScrollTrigger.update);

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    // Pause the whole experience while the tab is hidden
    const onVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMedia = () => setImmersive(!media.matches);
    media.addEventListener('change', onMedia);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      trigger.kill();
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMedia);
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Active-section detection follows the same progress model as the camera.
  useEffect(() => {
    if (loading) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const p = window.scrollY / max;
      const stops = CAMERA_STOPS.length - 1;
      const idx = Math.round(p * stops);
      setActiveSection(SECTION_IDS[Math.min(idx, SECTION_IDS.length - 1)]);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
          onNavigate={scrollToSection}
        />

        <main className={`relative z-10 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <Hero ready={ready} onExplore={() => scrollToSection('about')} />
          <Sections onOpenDetail={handleSelect} />
        </main>

        <DetailPanel detail={detail} onClose={() => setDetail(null)} />
      </div>
    </PerfModeContext.Provider>
  );
}

