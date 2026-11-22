import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SITE_CONTENT } from '../data/event';

export const SECTION_IDS = ['home', 'about', 'competitions', 'workshops', 'accommodation', 'ca'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

interface DetailPayload {
  type: string;
  id: string;
}

function SectionShell({ id, children }: { id: SectionId; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-reveal]'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 72%', once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id={`section-${id}`} data-section={id} className="relative flex min-h-screen items-center py-24">
      {children}
    </section>
  );
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p data-reveal className="mb-3 flex items-center gap-3 text-[11px] font-medium tracking-[0.35em] text-aether-300/90">
    <span className="h-px w-8 bg-aether-400/60" />
    {children}
  </p>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div data-reveal className="glass-panel p-6 transition-colors duration-300 hover:border-gold-400/40">
    {children}
  </div>
);

function EditBadge() {
  return (
    <span className="ml-2 border border-aether-400/40 px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-aether-300/80">
      EDITABLE
    </span>
  );
}

interface SectionsProps {
  onOpenDetail: (p: DetailPayload) => void;
}

export default function Sections({ onOpenDetail }: SectionsProps) {
  const c = SITE_CONTENT;

  return (
    <div className="pointer-events-none">
      {/* ABOUT */}
      <SectionShell id="about">
        <div className="pointer-events-auto mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:px-10">
          <div>
            <Eyebrow>30TH EDITION · IIT BOMBAY</Eyebrow>
            <h2 data-reveal className="font-display text-3xl font-semibold tracking-[0.1em] text-gold-300 sm:text-4xl">
              {c.about.heading}
            </h2>
            <p data-reveal className="mt-5 text-base font-light leading-relaxed tracking-wide text-gold-300/75">
              {c.about.intro} <EditBadge />
            </p>
            <p data-reveal className="mt-4 text-base font-light leading-relaxed tracking-wide text-gold-300/75">
              {c.about.editionNote} <EditBadge />
            </p>
            <div data-reveal className="mt-7 flex flex-wrap gap-8">
              {c.about.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl text-gold-400">{s.value}</p>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-gold-300/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {c.about.history.map((h) => (
              <Card key={h.title}>
                <p className="font-display text-sm tracking-[0.2em] text-gold-300">{h.title}</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-gold-300/65">{h.description}</p>
                <p className="mt-3 text-xs tracking-[0.25em] text-aether-300/80">{h.stat}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* COMPETITIONS */}
      <SectionShell id="competitions">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-6 lg:px-10">
          <Eyebrow>THE GRAND ARENA</Eyebrow>
          <h2 data-reveal className="font-display text-3xl font-semibold tracking-[0.1em] text-gold-300 sm:text-4xl">
            {c.competitions.heading}
          </h2>
          <p data-reveal className="mt-4 max-w-2xl text-base font-light leading-relaxed tracking-wide text-gold-300/75">
            {c.competitions.blurb}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.competitions.categories.map((cat) => (
              <Card key={cat.id}>
                <p className="font-display text-sm tracking-[0.2em] text-gold-300">
                  {cat.name} <EditBadge />
                </p>
                <p className="mt-2 text-sm font-light leading-relaxed text-gold-300/65">{cat.description}</p>
                <p className="mt-3 text-xs tracking-[0.2em] text-aether-300/80">{cat.details}</p>
                <button
                  onClick={() => onOpenDetail({ type: 'competition', id: cat.id })}
                  className="mt-4 text-[11px] tracking-[0.3em] text-gold-400 underline-offset-4 hover:text-gold-300 hover:underline"
                >
                  INSPECT
                </button>
                <a
                  href={cat.registrationUrl}
                  className="explore-btn mt-4 block px-4 py-2 text-center font-display text-[10px] tracking-[0.3em] text-gold-300"
                >
                  REGISTER
                </a>
              </Card>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* WORKSHOPS */}
      <SectionShell id="workshops">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-6 lg:px-10">
          <Eyebrow>INSIDE THE LABORATORY</Eyebrow>
          <h2 data-reveal className="font-display text-3xl font-semibold tracking-[0.1em] text-gold-300 sm:text-4xl">
            {c.workshops.heading}
          </h2>
          <p data-reveal className="mt-4 max-w-2xl text-base font-light leading-relaxed tracking-wide text-gold-300/75">
            {c.workshops.blurb}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {c.workshops.categories.map((ws) => (
              <Card key={ws.id}>
                <p className="font-display text-sm tracking-[0.2em] text-gold-300">
                  {ws.name} <EditBadge />
                </p>
                <p className="mt-2 text-sm font-light leading-relaxed text-gold-300/65">{ws.description}</p>
                <p className="mt-3 text-xs tracking-[0.2em] text-aether-300/80">{ws.schedule}</p>
                <button
                  onClick={() => onOpenDetail({ type: 'workshop', id: ws.id })}
                  className="mt-4 text-[11px] tracking-[0.3em] text-gold-400 underline-offset-4 hover:text-gold-300 hover:underline"
                >
                  INSPECT
                </button>
                <a
                  href={ws.registrationUrl}
                  className="explore-btn mt-4 block px-4 py-2 text-center font-display text-[10px] tracking-[0.3em] text-gold-300"
                >
                  REGISTER
                </a>
              </Card>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ACCOMMODATION */}
      <SectionShell id="accommodation">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-6 lg:px-10">
          <Eyebrow>REST WITHIN THE GROUNDS</Eyebrow>
          <h2 data-reveal className="font-display text-3xl font-semibold tracking-[0.1em] text-gold-300 sm:text-4xl">
            {c.accommodation.heading}
          </h2>
          <p data-reveal className="mt-4 max-w-2xl text-base font-light leading-relaxed tracking-wide text-gold-300/75">
            {c.accommodation.blurb}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {c.accommodation.plans.map((plan) => (
              <Card key={plan.id}>
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-sm tracking-[0.2em] text-gold-300">
                    {plan.name} <EditBadge />
                  </p>
                  <p className="font-display text-lg text-gold-400">{plan.price}</p>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {plan.facilities.map((f) => (
                    <li key={f} className="text-sm font-light tracking-wide text-gold-300/65">
                      — {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <p data-reveal className="mt-5 text-sm font-light tracking-wide text-aether-300/80">
            {c.accommodation.bookingNote} <EditBadge />
          </p>
          <a
            data-reveal
            href={c.accommodation.bookingUrl}
            className="explore-btn mt-6 inline-block px-10 py-3 font-display text-xs tracking-[0.35em] text-gold-300"
          >
            BOOK NOW
          </a>
        </div>
      </SectionShell>

      {/* CA PROGRAM */}
      <SectionShell id="ca">
        <div className="pointer-events-auto mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:px-10">
          <div>
            <Eyebrow>BECOME THE BEACON</Eyebrow>
            <h2 data-reveal className="font-display text-3xl font-semibold tracking-[0.1em] text-gold-300 sm:text-4xl">
              {c.caProgram.heading}
            </h2>
            <p data-reveal className="mt-4 text-base font-light leading-relaxed tracking-wide text-gold-300/75">
              {c.caProgram.blurb}
            </p>
            <div data-reveal className="glass-panel mt-6 p-5">
              <p className="text-[11px] tracking-[0.3em] text-aether-300/90">ELIGIBILITY</p>
              <p className="mt-2 text-sm font-light leading-relaxed text-gold-300/70">
                {c.caProgram.eligibility} <EditBadge />
              </p>
            </div>
            <a
              data-reveal
              href={c.caProgram.registrationUrl}
              className="explore-btn mt-6 inline-block px-10 py-3 font-display text-xs tracking-[0.35em] text-gold-300"
            >
              JOIN NOW
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <p className="text-[11px] tracking-[0.3em] text-aether-300/90">BENEFITS</p>
              <ul className="mt-3 space-y-2">
                {c.caProgram.benefits.map((b) => (
                  <li key={b} className="text-sm font-light tracking-wide text-gold-300/70">— {b}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <p className="text-[11px] tracking-[0.3em] text-aether-300/90">RESPONSIBILITIES</p>
              <ul className="mt-3 space-y-2">
                {c.caProgram.responsibilities.map((r) => (
                  <li key={r} className="text-sm font-light tracking-wide text-gold-300/70">— {r}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
