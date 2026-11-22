import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import ExperienceCanvas from './components/ExperienceCanvas';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let raf: number;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {loading && <LoadingScreen onDone={() => { setLoading(false); setReady(true); }} />}

      <ExperienceCanvas />

      <Navbar />

      <main className={`relative z-10 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Hero ready={ready} />
      </main>

      {/* Scroll runway for smooth-scroll feel until future sections arrive */}
      <div style={{ height: '80vh' }} aria-hidden />
    </div>
  );
}
