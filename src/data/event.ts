/**
 * ============================================================
 *  TECHFEST 30TH EDITION — EDITABLE EVENT CONTENT
 * ------------------------------------------------------------
 *  Every field marked with [EDIT] is a placeholder.
 *  Replace the placeholder text with official Techfest
 *  information when available. Do not publish invented
 *  dates, prices, names, or links.
 * ============================================================
 */

export interface MediaItem {
  title: string;
  description: string;
  stat: string; // [EDIT] e.g. official attendance / prize figure
}

export interface CompetitionCategory {
  id: string;
  name: string;
  description: string;
  /** [EDIT] official prize or format summary */
  details: string;
  /** [EDIT] real registration URL when available */
  registrationUrl: string;
}

export interface WorkshopCategory {
  id: string;
  name: string;
  description: string;
  /** [EDIT] official schedule (dates/times) */
  schedule: string;
  /** [EDIT] real registration URL when available */
  registrationUrl: string;
}

export interface AccommodationPlan {
  id: string;
  name: string;
  /** [EDIT] official pricing */
  price: string;
  facilities: string[];
}

export interface SiteContent {
  hero: {
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
  };
  about: {
    heading: string;
    /** [EDIT] official Techfest description */
    intro: string;
    /** [EDIT] official 30th edition statement */
    editionNote: string;
    /** [EDIT] official stats when released */
    stats: { label: string; value: string }[];
    history: MediaItem[];
  };
  competitions: {
    heading: string;
    blurb: string;
    /** [EDIT] official competition categories */
    categories: CompetitionCategory[];
  };
  workshops: {
    heading: string;
    blurb: string;
    /** [EDIT] official Megadrop workshop lineup */
    categories: WorkshopCategory[];
  };
  accommodation: {
    heading: string;
    blurb: string;
    /** [EDIT] official accommodation plans and pricing */
    plans: AccommodationPlan[];
    /** [EDIT] real booking URL */
    bookingUrl: string;
    bookingNote: string;
  };
  caProgram: {
    heading: string;
    blurb: string;
    benefits: string[];
    responsibilities: string[];
    /** [EDIT] official eligibility criteria */
    eligibility: string;
    /** [EDIT] real registration URL */
    registrationUrl: string;
  };
}

export const SITE_CONTENT: SiteContent = {
  hero: {
    kicker: 'TECHFEST 30TH EDITION · IIT BOMBAY',
    titleLine1: 'AN AETHERIAL',
    titleLine2: 'RENAISSANCE',
    subtitle:
      "Where ancient wisdom converges with tomorrow's machines — a celestial confluence of art, science, and the cosmos.",
  },
  about: {
    heading: 'ABOUT TECHFEST',
    intro: '[EDIT] Official Techfest description — Asia\'s largest science and technology festival, organised by IIT Bombay.',
    editionNote:
      '[EDIT] Official 30th edition statement — three decades of innovation, celebrating this milestone edition.',
    stats: [
      { label: 'Footfall', value: '[EDIT]' },
      { label: 'Events', value: '[EDIT]' },
      { label: 'Countries', value: '[EDIT]' },
    ],
    history: [
      {
        title: '[EDIT] Milestone One',
        description: '[EDIT] Official event history highlight.',
        stat: '[EDIT]',
      },
      {
        title: '[EDIT] Milestone Two',
        description: '[EDIT] Official event history highlight.',
        stat: '[EDIT]',
      },
      {
        title: '[EDIT] Milestone Three',
        description: '[EDIT] Official event history highlight.',
        stat: '[EDIT]',
      },
    ],
  },
  competitions: {
    heading: 'COMPETITIONS',
    blurb:
      'Enter the grand arena. Select a glowing sigil to inspect each competition category. [EDIT] Official category lineup below.',
    categories: [
      {
        id: 'cat-1',
        name: '[EDIT] Category One',
        description: '[EDIT] Official description of this competition category.',
        details: '[EDIT] Prize pool / format details.',
        registrationUrl: '#',
      },
      {
        id: 'cat-2',
        name: '[EDIT] Category Two',
        description: '[EDIT] Official description of this competition category.',
        details: '[EDIT] Prize pool / format details.',
        registrationUrl: '#',
      },
      {
        id: 'cat-3',
        name: '[EDIT] Category Three',
        description: '[EDIT] Official description of this competition category.',
        details: '[EDIT] Prize pool / format details.',
        registrationUrl: '#',
      },
      {
        id: 'cat-4',
        name: '[EDIT] Category Four',
        description: '[EDIT] Official description of this competition category.',
        details: '[EDIT] Prize pool / format details.',
        registrationUrl: '#',
      },
      {
        id: 'cat-5',
        name: '[EDIT] Category Five',
        description: '[EDIT] Official description of this competition category.',
        details: '[EDIT] Prize pool / format details.',
        registrationUrl: '#',
      },
    ],
  },
  workshops: {
    heading: 'MEGADROP WEEKEND WORKSHOPS',
    blurb:
      'Inside the holographic laboratory. Choose a pulsing core to reveal workshop details. [EDIT] Official workshop lineup below.',
    categories: [
      {
        id: 'ws-1',
        name: '[EDIT] Workshop One',
        description: '[EDIT] Official workshop description.',
        schedule: '[EDIT] Official date & time.',
        registrationUrl: '#',
      },
      {
        id: 'ws-2',
        name: '[EDIT] Workshop Two',
        description: '[EDIT] Official workshop description.',
        schedule: '[EDIT] Official date & time.',
        registrationUrl: '#',
      },
      {
        id: 'ws-3',
        name: '[EDIT] Workshop Three',
        description: '[EDIT] Official workshop description.',
        schedule: '[EDIT] Official date & time.',
        registrationUrl: '#',
      },
    ],
  },
  accommodation: {
    heading: 'ACCOMMODATION',
    blurb:
      'Rest within the institute grounds. [EDIT] Official accommodation details and pricing below.',
    plans: [
      {
        id: 'acc-1',
        name: '[EDIT] Plan One',
        price: '[EDIT] ₹—',
        facilities: ['[EDIT] Facility one', '[EDIT] Facility two'],
      },
      {
        id: 'acc-2',
        name: '[EDIT] Plan Two',
        price: '[EDIT] ₹—',
        facilities: ['[EDIT] Facility one', '[EDIT] Facility two'],
      },
    ],
    bookingUrl: '#',
    bookingNote: '[EDIT] Official booking instructions and dates.',
  },
  caProgram: {
    heading: 'COLLEGE AMBASSADOR PROGRAM',
    blurb:
      'Become the celestial beacon of your campus. [EDIT] Official CA program details below.',
    benefits: [
      '[EDIT] Official benefit one',
      '[EDIT] Official benefit two',
      '[EDIT] Official benefit three',
    ],
    responsibilities: [
      '[EDIT] Official responsibility one',
      '[EDIT] Official responsibility two',
      '[EDIT] Official responsibility three',
    ],
    eligibility: '[EDIT] Official eligibility criteria.',
    registrationUrl: '#',
  },
};
