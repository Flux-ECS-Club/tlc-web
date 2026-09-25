/**
 * Events Data
 *
 * Schema fields:
 *   id          - unique string identifier
 *   title       - event name
 *   category    - 'software' | 'hardware'
 *   date        - display date string
 *   time        - display time string (optional)
 *   venue       - location string
 *   description - short plain-text summary
 *   poster      - image URL or local path; set to '' if no poster yet
 *   ctaLabel    - button text: 'Register', 'View Recap', 'View Details', or ''
 *   ctaLink     - URL for CTA button (use '#' as placeholder)
 *   status      - 'upcoming' | 'past'
 *   published   - boolean; false = hidden from public website
 *
 * To add a future event now but keep it hidden:
 *   set published: false
 *   switch to true when officially announced by the council
 */

export const EVENTS_DATA = [
  {
    id: 'evt-001',
    title: 'Microcontroller Workshop — Getting Started with ESP32',
    category: 'hardware',
    date: 'October 18, 2026',
    time: '10:00 AM – 1:00 PM',
    venue: 'Lab 402, VESIT',
    description: 'Hands-on introduction to ESP32 — GPIO, UART, sensors and basic firmware flashing. Suitable for beginners with basic C knowledge.',
    poster: '',
    ctaLabel: 'Register',
    ctaLink: '#',
    status: 'upcoming',
    published: true,
  },
  {
    id: 'evt-002',
    title: 'Web Development Bootcamp — React Fundamentals',
    category: 'software',
    date: 'November 5, 2026',
    time: '11:00 AM – 3:00 PM',
    venue: 'Seminar Hall, VESIT',
    description: 'Two-session workshop covering component architecture, state management, and building real projects with React and Vite.',
    poster: '',
    ctaLabel: 'Register',
    ctaLink: '#',
    status: 'upcoming',
    published: true,
  },
  {
    id: 'evt-003',
    title: 'PCB Design Workshop — From Schematic to Gerber',
    category: 'hardware',
    date: 'September 20, 2026',
    time: '2:00 PM – 5:00 PM',
    venue: 'ECS Lab, VESIT',
    description: 'Practical session on KiCad — schematic capture, PCB layout, trace routing and generating manufacturing-ready files.',
    poster: '',
    ctaLabel: 'View Recap',
    ctaLink: '#',
    status: 'past',
    published: true,
  },
  {
    id: 'evt-004',
    title: 'Git & Version Control — Team Workflow Session',
    category: 'software',
    date: 'August 30, 2026',
    time: '10:30 AM – 12:30 PM',
    venue: 'Seminar Hall 2, VESIT',
    description: 'Practical introduction to Git — branching, merging, pull requests and collaboration workflows for student projects.',
    poster: '',
    ctaLabel: 'View Recap',
    ctaLink: '#',
    status: 'past',
    published: true,
  },
  // Unpublished draft — will appear automatically when published is changed to true.
  // Do not expose confidential details here.
  {
    id: 'evt-draft-01',
    title: 'Draft Event',
    category: 'software',
    date: 'TBD',
    time: 'TBD',
    venue: 'TBD',
    description: 'Draft — not yet announced.',
    poster: '',
    ctaLabel: '',
    ctaLink: '#',
    status: 'upcoming',
    published: false,
  },
]

// Returns only events the council has marked as publicly visible.
export const getPublicEvents = () =>
  EVENTS_DATA.filter((e) => e.published === true)

export const getUpcomingEvents = () =>
  getPublicEvents().filter((e) => e.status === 'upcoming')

export const getPastEvents = () =>
  getPublicEvents().filter((e) => e.status === 'past')
