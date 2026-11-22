import { useEffect, useState } from 'react';
import { Menu, X, Gauge } from 'lucide-react';

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'workshops', label: 'Workshops' },
  { id: 'accommodation', label: 'Accommodation' },
  { id: 'ca', label: 'CA Program' },
];

interface NavbarProps {
  activeSection: string;
  immersive: boolean;
  onToggleMode: () => void;
}

export default function Navbar({ activeSection, immersive, onToggleMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <button onClick={() => goTo('home')} className="flex items-center gap-3 text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/60">
            <span className="font-display text-sm font-semibold text-gold-400">30</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm tracking-[0.25em] text-gold-300">TECHFEST</p>
            <p className="text-[10px] tracking-[0.3em] text-gold-400/70">IIT BOMBAY</p>
          </div>
        </button>

        <ul className="hidden items-center gap-6 xl:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => goTo(link.id)}
                className={`group relative text-xs font-medium uppercase tracking-[0.22em] transition-colors ${
                  activeSection === link.id ? 'text-gold-300' : 'text-gold-300/60 hover:text-gold-300'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-gold-400 transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMode}
            className={`flex items-center gap-2 border px-3 py-1.5 text-[10px] tracking-[0.2em] transition-colors ${
              immersive
                ? 'border-gold-500/50 text-gold-300/90 hover:border-gold-400'
                : 'border-aether-400/50 text-aether-300 hover:border-aether-300'
            }`}
            title={immersive ? 'Switch to low-performance mode' : 'Switch to immersive mode'}
          >
            <Gauge size={13} />
            {immersive ? 'IMMERSIVE' : 'LITE'}
          </button>

          <button className="text-gold-300 xl:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div className={`overflow-hidden transition-all duration-500 xl:hidden ${open ? 'max-h-80' : 'max-h-0'}`}>
        <ul className="glass-panel mx-6 mt-4 flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => goTo(link.id)}
                className={`block w-full px-3 py-2.5 text-left text-sm uppercase tracking-[0.25em] ${
                  activeSection === link.id ? 'text-gold-300' : 'text-gold-300/70'
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
