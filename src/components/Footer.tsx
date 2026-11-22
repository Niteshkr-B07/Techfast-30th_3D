import { ArrowUp, Compass, Globe, Mail, MapPin } from 'lucide-react';
import { NAV_LINKS } from './Navbar';

interface FooterProps {
  onNavigate: (id: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-gold-500/20 bg-[#030409]/95 backdrop-blur-md" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Edition */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/60 shadow-[0_0_15px_rgba(217,172,78,0.2)]">
                <span className="font-display text-base font-semibold text-gold-400">30</span>
              </div>
              <div>
                <p className="font-display text-base tracking-[0.25em] text-gold-300">TECHFEST</p>
                <p className="text-[10px] tracking-[0.3em] text-gold-400/70">IIT BOMBAY</p>
              </div>
            </div>
            <p className="text-xs font-light leading-relaxed tracking-wider text-gold-300/70">
              An Aetherial Renaissance — Celebrating three decades of pioneering science, engineering, and celestial curiosity at Asia&apos;s largest science and technology festival.
            </p>
            <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-aether-300/80">
              <Compass size={14} className="text-aether-400" />
              <span>EST. 1998 · 30TH EDITION</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <p className="font-display text-xs tracking-[0.3em] text-gold-400">NAVIGATION</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-xs tracking-[0.2em] text-gold-300/70 transition-colors hover:text-gold-300 focus:outline-none focus:ring-1 focus:ring-gold-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Venue */}
          <div>
            <p className="font-display text-xs tracking-[0.3em] text-gold-400">VENUE & SANCTUARY</p>
            <div className="mt-4 space-y-3 text-xs font-light tracking-wide text-gold-300/70">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-aether-400" />
                <span>Indian Institute of Technology Bombay, Powai, Mumbai, Maharashtra 400076</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-aether-400" />
                <a href="mailto:info@techfest.org" className="hover:text-gold-300 focus:outline-none focus:ring-1 focus:ring-gold-400">
                  info@techfest.org
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe size={15} className="shrink-0 text-aether-400" />
                <a href="https://techfest.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 focus:outline-none focus:ring-1 focus:ring-gold-400">
                  techfest.org
                </a>
              </div>
            </div>
          </div>

          {/* Renaissance Protocol */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-display text-xs tracking-[0.3em] text-gold-400">CELESTIAL ARCHIVE</p>
              <p className="mt-4 text-xs font-light leading-relaxed text-gold-300/70">
                All intellectual properties, competitions, and symposium proceedings belong to Techfest, IIT Bombay.
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={scrollToTop}
                className="explore-btn flex items-center gap-2 px-4 py-2 font-display text-[10px] tracking-[0.25em] text-gold-300"
                aria-label="Scroll back to top of the page"
              >
                <ArrowUp size={13} />
                <span>RETURN TO APEX</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gold-500/10 pt-8 sm:flex-row">
          <p className="text-[11px] tracking-[0.2em] text-gold-400/60">
            &copy; {new Date().getFullYear()} TECHFEST IIT BOMBAY. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] tracking-[0.25em] text-aether-300/70">
            CRAFTED FOR THE 30TH CELESTIAL VOYAGE
          </p>
        </div>
      </div>
    </footer>
  );
}
