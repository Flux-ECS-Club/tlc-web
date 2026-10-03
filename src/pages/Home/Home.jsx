/**
 * Home Page — Tinkerer's Lab ECS
 *
 * Sections:
 *   1. Hero — animated title, circuit background, CTA buttons
 *   2. Focus Areas — Hardware + Software discipline cards
 *   3. Upcoming Events — real data from events.js
 *   4. Club Highlights — animated number counters
 *   5. Newsletter CTA — subscribe banner
 *
 * All animations use Framer Motion (whileInView, useScroll, useSpring).
 * Background circuit particles use pure CSS @keyframes.
 * Content is sourced from clubConfig.js and events.js — no fake data.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useInView,
} from 'framer-motion'
import { CLUB_CONFIG } from '../../config/clubConfig'
import { getPastEvents, getUpcomingEvents } from '../../data/events'
import Hero3D from '../../components/Hero3D/Hero3D'
import './home.css'

// ─── Animation Variants ────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ─── Animated Counter Hook ──────────────────────────────────────

function AnimatedCounter({ target, suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = target
    const startTime = performance.now()
    const ms = duration * 1000

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / ms, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setDisplayValue(current)
      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, target, duration])

  return <span ref={ref}>{displayValue}{suffix}</span>
}

// ─── Inline SVG Icons ───────────────────────────────────────────

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const ChipIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
)

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </svg>
)

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

// ─── Circuit Background ─────────────────────────────────────────

function CircuitBackground() {
  return (
    <div className="home-circuit-bg" aria-hidden="true">
      {/* Floating circuit nodes */}
      <div className="home-circuit-node home-circuit-node--1" />
      <div className="home-circuit-node home-circuit-node--2" />
      <div className="home-circuit-node home-circuit-node--3" />
      <div className="home-circuit-node home-circuit-node--4" />
      <div className="home-circuit-node home-circuit-node--5" />
      <div className="home-circuit-node home-circuit-node--6" />
      {/* Trace lines */}
      <div className="home-circuit-trace home-circuit-trace--1" />
      <div className="home-circuit-trace home-circuit-trace--2" />
      <div className="home-circuit-trace home-circuit-trace--3" />
    </div>
  )
}

// ─── Hero Section ────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero__layout">
        <motion.div
          className="home-hero__content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="home-hero__badge">
            <span className="home-hero__badge-dot" />
            {CLUB_CONFIG.institutionShort} · {CLUB_CONFIG.department}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="home-hero__title">
            Learn by building.
            <span className="home-hero__title-accent">Hardware meets software.</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="home-hero__dept">
            TINKERER&apos;S LAB ECS · {CLUB_CONFIG.institutionShort}
          </motion.p>

          <motion.p variants={fadeUp} custom={3} className="home-hero__subtitle">
            A hands-on learning space for {CLUB_CONFIG.institutionShort} students to explore electronics and software through practical workshops and technical sessions.
          </motion.p>

          <motion.div variants={fadeUp} custom={4} className="home-hero__actions">
            <Link to="/events" className="home-hero__cta-primary">
              Explore Events <ArrowRightIcon />
            </Link>
            <Link to="/newsletter" className="home-hero__cta-secondary">
              <MailIcon /> Get Updates
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="home-hero__visual"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          aria-label="Interactive 3D circuit chip"
        >
          <Hero3D />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Quick Value Highlights ───────────────────────────────────────

function HighlightsSection() {
  const highlights = [
    {
      icon: <ChipIcon />,
      title: 'Practical workshops',
      description: 'Get hands-on with microcontrollers, sensors and PCB design.',
      to: '/events',
      action: 'See upcoming sessions',
    },
    {
      icon: <CodeIcon />,
      title: 'Hardware and software',
      description: 'Explore two connected disciplines in one student lab.',
      to: '#home-offerings',
      action: 'Explore learning areas',
    },
    {
      icon: <MailIcon />,
      title: 'Stay in the loop',
      description: 'Get club announcements and workshop updates in one place.',
      to: '/newsletter',
      action: 'Get updates',
    },
  ]

  return (
    <section className="home-highlights" aria-label="Lab highlights">
      <div className="home-section__container home-highlight-grid">
        {highlights.map((item, index) => (
          <motion.article
            className="home-highlight"
            key={item.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            custom={index}
          >
            <span className="home-highlight__icon" aria-hidden="true">{item.icon}</span>
            <div>
              <h2 className="home-highlight__title">{item.title}</h2>
              <p className="home-highlight__description">{item.description}</p>
              <Link className="home-highlight__link" to={item.to}>
                {item.action} <ArrowRightIcon />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

// ─── Learning Areas ──────────────────────────────────────────────

function FocusAreasSection() {
  const [activeArea, setActiveArea] = useState('All')
  const offerings = [
    {
      category: 'Hardware',
      icon: <ChipIcon />,
      iconClass: 'home-focus-card__icon--hardware',
      title: 'Embedded systems',
      description: 'Work with ESP32 boards, GPIO, UART and sensors, starting with the fundamentals.',
      tags: ['ESP32', 'Sensors', 'Firmware'],
    },
    {
      category: 'Hardware',
      icon: <ChipIcon />,
      iconClass: 'home-focus-card__icon--hardware',
      title: 'PCB design',
      description: 'Move from schematic capture through board layout and manufacturing files.',
      tags: ['KiCad', 'PCB layout', 'Prototyping'],
    },
    {
      category: 'Software',
      icon: <CodeIcon />,
      iconClass: 'home-focus-card__icon--software',
      title: 'Web development',
      description: 'Build with React and Vite while learning modern component-based development.',
      tags: ['React', 'Vite', 'Web'],
    },
    {
      category: 'Software',
      icon: <CodeIcon />,
      iconClass: 'home-focus-card__icon--software',
      title: 'Collaborative coding',
      description: 'Practice version control with branches, merges and team workflows in Git.',
      tags: ['Git', 'Version control', 'Teamwork'],
    },
  ]
  const visibleOfferings = activeArea === 'All'
    ? offerings
    : offerings.filter((offering) => offering.category === activeArea)

  return (
    <section className="home-section" id="home-offerings">
      <div className="home-section__container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p variants={fadeUp} className="home-section__label">
            Learning Areas
          </motion.p>
          <motion.h2 variants={fadeUp} className="home-section__title">
            From first circuit to working code
          </motion.h2>
          <motion.p variants={fadeUp} className="home-section__subtitle">
            Focused sessions introduce the tools and workflows behind practical electronics and software projects.
          </motion.p>
        </motion.div>

        <div className="home-offerings-toolbar">
          <p className="home-offerings-toolbar__hint">Filter learning areas</p>
          <div className="home-offerings-filter" role="group" aria-label="Filter learning areas">
            {['All', 'Hardware', 'Software'].map((area) => (
              <button
                className={`home-offerings-filter__button ${activeArea === area ? 'home-offerings-filter__button--active' : ''}`}
                key={area}
                type="button"
                aria-pressed={activeArea === area}
                onClick={() => setActiveArea(area)}
              >
                {activeArea === area && (
                  <motion.span
                    className="home-offerings-filter__active-bg"
                    layoutId="home-offerings-filter-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="home-offerings-filter__label">{area}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="home-focus-grid">
          {visibleOfferings.map((offering, index) => (
              <motion.article
                className="home-focus-card"
                key={offering.title}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.24, delay: index * 0.04 }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={`home-focus-card__icon ${offering.iconClass}`} aria-hidden="true">
                  {offering.icon}
                </div>
                <h3 className="home-focus-card__title">{offering.title}</h3>
                <p className="home-focus-card__desc">{offering.description}</p>
                <div className="home-focus-card__tags">
                  {offering.tags.map((tag) => (
                    <span className="home-focus-card__tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── What Makes the Lab Different ────────────────────────────────

function DifferenceSection() {
  const differences = [
    ['Learn by doing', 'Work through practical activities instead of stopping at theory.'],
    ['Connect disciplines', 'Explore how embedded hardware and software work together.'],
    ['Start with the basics', 'Sessions like the ESP32 workshop are designed for beginners.'],
    ['Use real workflows', 'Practice tools including KiCad, React, Vite and Git.'],
    ['Keep learning together', 'Join focused workshops and stay connected between sessions.'],
  ]

  return (
    <section className="home-section home-difference-section">
      <div className="home-section__container home-difference-layout">
        <div className="home-difference-intro">
          <p className="home-section__label">Why the Lab</p>
          <h2 className="home-section__title">Make learning tangible</h2>
          <p className="home-section__subtitle">
            A practical place to try tools, build confidence and connect ideas across ECS.
          </p>
        </div>
        <div className="home-difference-list">
          {differences.map(([title, description], index) => (
            <motion.article
              className="home-difference-item"
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <span className="home-difference-item__number">0{index + 1}</span>
              <div>
                <h3 className="home-difference-item__title">{title}</h3>
                <p className="home-difference-item__description">{description}</p>
              </div>
              <ArrowRightIcon />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Tools and Categories ────────────────────────────────────────

function CapabilitiesSection() {
  const categories = [
    { title: 'Hardware', skills: ['ESP32', 'Sensors', 'UART', 'KiCad', 'PCB design'] },
    { title: 'Software', skills: ['React', 'Vite', 'Git', 'Version control'] },
  ]

  return (
    <section className="home-section home-capabilities-section">
      <div className="home-section__container home-capabilities-layout">
        <div>
          <p className="home-section__label">Tools and Topics</p>
          <h2 className="home-section__title">Explore by interest</h2>
        </div>
        <div className="home-capabilities-groups">
          {categories.map((category) => (
            <div className="home-capability-group" key={category.title}>
              <h3 className="home-capability-group__title">{category.title}</h3>
              <div className="home-capability-group__tags">
                {category.skills.map((skill) => (
                  <span className="home-focus-card__tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Upcoming Events Preview ─────────────────────────────────────

function EventsPreviewSection() {
  const upcomingEvents = getUpcomingEvents().slice(0, 2)

  if (upcomingEvents.length === 0) return null

  return (
    <section className="home-section">
      <div className="home-section__container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p variants={fadeUp} className="home-section__label">
            Upcoming
          </motion.p>
          <motion.h2 variants={fadeUp} className="home-section__title">
            Next on the Calendar
          </motion.h2>
          <motion.p variants={fadeUp} className="home-section__subtitle">
            Workshops and sessions coming up — register early, seats are limited.
          </motion.p>
        </motion.div>

        <motion.div
          className="home-events-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {upcomingEvents.map((event) => {
            const isSoftware = event.category?.toLowerCase() === 'software'
            return (
              <motion.article
                key={event.id}
                className="home-events-card"
                variants={fadeUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <span
                  className={`home-events-card__badge ${
                    isSoftware
                      ? 'home-events-card__badge--software'
                      : 'home-events-card__badge--hardware'
                  }`}
                >
                  {event.category}
                </span>
                <h3 className="home-events-card__title">{event.title}</h3>
                <div className="home-events-card__meta">
                  <span className="home-events-card__meta-item">
                    <CalendarIcon /> {event.date}
                  </span>
                  {event.venue && (
                    <span className="home-events-card__meta-item">
                      <LocationIcon /> {event.venue}
                    </span>
                  )}
                </div>
                <p className="home-events-card__desc">{event.description}</p>
              </motion.article>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/events" className="home-events__viewall">
            View all events <ArrowRightIcon />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Stats / Highlights ──────────────────────────────────────────

function StatsSection() {
  const upcomingEvents = getUpcomingEvents()
  const pastEvents = getPastEvents()
  const stats = [
    { value: upcomingEvents.length, suffix: '', label: 'Upcoming sessions' },
    { value: pastEvents.length, suffix: '', label: 'Past events listed' },
    { value: 2, suffix: '', label: 'Learning areas' },
  ]

  return (
    <section className="home-section home-stats-section">
      <div className="home-section__container">
        <motion.div
          className="home-stats-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} className="home-stat" variants={fadeUp}>
              <div className="home-stat__number">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  duration={stat.value > 100 ? 2.5 : 1.5}
                />
              </div>
              <div className="home-stat__label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Newsletter CTA ──────────────────────────────────────────────

function NewsletterCTASection() {
  return (
    <section className="home-section home-newsletter-section">
      <div className="home-section__container">
        <motion.div
          className="home-newsletter-card"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="home-newsletter-card__glow" />
          <p className="home-section__label">Your next step</p>
          <h2 className="home-newsletter-card__title">Make your next idea real.</h2>
          <p className="home-newsletter-card__text">
            Find a workshop to join or get updates when the next session is announced.
          </p>
          <div className="home-newsletter-card__actions">
            <Link to="/newsletter" className="home-newsletter-card__cta">
              <MailIcon /> Get Workshop Updates
            </Link>
            <Link to="/contact" className="home-hero__cta-secondary">
              Contact the Lab
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Main Home Component ─────────────────────────────────────────

export default function Home() {
  return (
    <div style={{ background: 'var(--page-bg)', minHeight: '100vh' }}>
      <CircuitBackground />
      <HeroSection />
      <hr className="home-divider" />
      <HighlightsSection />
      <StatsSection />
      <FocusAreasSection />
      <hr className="home-divider" />
      <DifferenceSection />
      <CapabilitiesSection />
      <EventsPreviewSection />
      <NewsletterCTASection />
    </div>
  )
}

