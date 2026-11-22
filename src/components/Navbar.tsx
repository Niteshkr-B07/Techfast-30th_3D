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
  onNavigate: (id: string) => void;
}

export default function Navbar({ activeSection, immersive, onToggleMode, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'glass-panel py-3' +
            ' border-b border-gold-500/30 shadow-[0_1px_0_rgba(217,172,78,0.18)]'
          : 'bg-transparent py-5'
      }`}
      style={scrolled ? { borderBottom: '1px solid rgba(217,172,78,0.28)', boxShadow: '0 1px 24px rgba(217,172,78,0.08)' } : {}}
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
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.id} className="relative">
                <button
                  onClick={() => goTo(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative rounded px-1.5 py-0.5 text-xs font-medium uppercase tracking-[0.22em] transition-colors focus:outline-none focus:ring-1 focus:ring-gold-400 ${
                    isActive ? 'text-gold-300' : 'text-gold-300/60 hover:text-aether-300'
                  }`}
                >
                  {link.label}
                  {/* Active indicator dot */}
                  {isActive && (
                    <span
                      className="absolute -top-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-400"
                      style={{ boxShadow: '0 0 6px rgba(217,172,78,0.9)', animation: 'hotspot-float 2s ease-in-out infinite' }}
                    />
                  )}
                  {/* Underline: gold for active, cyan on hover */}
                  <span
                    className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                      isActive
                        ? 'w-full bg-gold-400'
                        : 'w-0 bg-aether-400 group-hover:w-full'
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMode}
            className={`flex items-center gap-2 border px-3 py-1.5 text-[10px] tracking-[0.2em] transition-colors focus:outline-none focus:ring-1 focus:ring-gold-400 ${
              immersive
                ? 'border-gold-500/50 text-gold-300/90 hover:border-gold-400'
                : 'border-aether-400/50 text-aether-300 hover:border-aether-300'
            }`}
            title={immersive ? 'Switch to low-performance mode' : 'Switch to immersive mode'}
            aria-label={immersive ? 'Active mode: Immersive. Click to switch to Lite performance mode' : 'Active mode: Lite. Click to switch to Immersive mode'}
          >
            <Gauge size={13} />
            {immersive ? 'IMMERSIVE' : 'LITE'}
          </button>

          <button
            className="rounded p-1 text-gold-300 xl:hidden focus:outline-none focus:ring-1 focus:ring-gold-400"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
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
                aria-current={activeSection === link.id ? 'page' : undefined}
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
