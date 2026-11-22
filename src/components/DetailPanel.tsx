import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { SITE_CONTENT } from '../data/event';

export interface DetailPayload {
  type: string;
  id: string;
}

interface DetailPanelProps {
  detail: DetailPayload | null;
  onClose: () => void;
}

export default function DetailPanel({ detail, onClose }: DetailPanelProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!detail) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        box.current,
        { y: 30, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }
      );
    });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
    };
  }, [detail, onClose]);

  if (!detail) return null;

  const c = SITE_CONTENT;
  let title = '';
  let lines: { label: string; value: string }[] = [];
  let action: { label: string; url: string } | null = null;

  if (detail.type === 'competition') {
    const item = c.competitions.categories.find((x) => x.id === detail.id);
    if (item) {
      title = item.name;
      lines = [
        { label: 'DESCRIPTION', value: item.description },
        { label: 'DETAILS', value: item.details },
      ];
      action = { label: 'REGISTER', url: item.registrationUrl };
    }
  } else if (detail.type === 'workshop') {
    const item = c.workshops.categories.find((x) => x.id === detail.id);
    if (item) {
      title = item.name;
      lines = [
        { label: 'DESCRIPTION', value: item.description },
        { label: 'SCHEDULE', value: item.schedule },
      ];
      action = { label: 'REGISTER', url: item.registrationUrl };
    }
  } else if (detail.type === 'accommodation') {
    title = c.accommodation.heading;
    lines = c.accommodation.plans.map((p) => ({ label: `${p.name} — ${p.price}`, value: p.facilities.join(' · ') }));
    action = { label: 'BOOK NOW', url: c.accommodation.bookingUrl };
  } else if (detail.type === 'ca') {
    title = c.caProgram.heading;
    lines = [
      { label: 'BENEFITS', value: c.caProgram.benefits.join(' · ') },
      { label: 'RESPONSIBILITIES', value: c.caProgram.responsibilities.join(' · ') },
      { label: 'ELIGIBILITY', value: c.caProgram.eligibility },
    ];
    action = { label: 'JOIN NOW', url: c.caProgram.registrationUrl };
  }

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030409]/70 px-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={box}
        className="glass-panel relative w-full max-w-lg p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="absolute right-4 top-4 text-gold-400/70 transition-colors hover:text-gold-300"
        >
          <X size={20} />
        </button>

        <p className="text-[10px] tracking-[0.35em] text-aether-300/90">
          {detail.type === 'competition' && 'COMPETITION ARENA'}
          {detail.type === 'workshop' && 'MEGADROP LABORATORY'}
          {detail.type === 'accommodation' && 'CAMPUS ACCOMMODATION'}
          {detail.type === 'ca' && 'CELESTIAL AMBASSADOR GLOBE'}
        </p>
        <h3 className="mt-3 font-display text-2xl tracking-[0.08em] text-gold-300">{title}</h3>

        <div className="mt-6 space-y-5">
          {lines.map((l) => (
            <div key={l.label}>
              <p className="text-[10px] tracking-[0.3em] text-gold-400/80">{l.label}</p>
              <p className="mt-1.5 text-sm font-light leading-relaxed text-gold-300/75">{l.value}</p>
            </div>
          ))}
        </div>

        {action && (
          <a
            href={action.url}
            className="explore-btn mt-8 block px-6 py-3 text-center font-display text-[11px] tracking-[0.35em] text-gold-300"
          >
            {action.label}
          </a>
        )}
      </div>
    </div>
  );
}
