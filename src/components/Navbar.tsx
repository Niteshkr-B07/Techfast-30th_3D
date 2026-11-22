import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const LINKS = ['Home', 'About', 'Events', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/60">
            <span className="font-display text-sm font-semibold text-gold-400">30</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm tracking-[0.25em] text-gold-300">TECHFEST</p>
            <p className="text-[10px] tracking-[0.3em] text-gold-400/70">IIT BOMBAY</p>
          </div>
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="group relative text-xs font-medium uppercase tracking-[0.25em] text-gold-300/80 transition-colors hover:text-gold-300"
              >
                {link}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="explore-btn hidden rounded-none px-5 py-2 font-display text-[11px] tracking-[0.25em] text-gold-300 md:block"
        >
          REGISTER
        </a>

        <button
          className="text-gold-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          open ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <ul className="glass-panel mx-6 mt-4 flex flex-col gap-1 p-4">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm uppercase tracking-[0.25em] text-gold-300/90 hover:text-gold-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
