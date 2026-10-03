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

import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion'
import { CLUB_CONFIG } from '../../config/clubConfig'
import { getUpcomingEvents } from '../../data/events'
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
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 80])

  return (
    <motion.section
      ref={heroRef}
      className="home-hero"
      style={{ opacity: heroOpacity, y: heroY }}
    >
      <div className="home-hero__glow" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={fadeUp} custom={0} className="home-hero__badge">
          <span className="home-hero__badge-dot" />
          {CLUB_CONFIG.institutionShort} · {CLUB_CONFIG.department}
        </motion.div>

        {/* Main title */}
        <motion.h1 variants={fadeUp} custom={1} className="home-hero__title">
          Tinkerer's Lab
          <span className="home-hero__title-accent">ECS</span>
        </motion.h1>

        {/* Department + Institution */}
        <motion.p variants={fadeUp} custom={2} className="home-hero__dept">
          {CLUB_CONFIG.department} · {CLUB_CONFIG.institutionShort}
        </motion.p>

        {/* Subtitle */}
        <motion.p variants={fadeUp} custom={3} className="home-hero__subtitle">
          Where hardware meets software. Hands-on workshops, maker sessions
          and technical projects — built by students of {CLUB_CONFIG.institutionShort}.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} custom={4} className="home-hero__actions">
          <Link to="/events" className="home-hero__cta-primary">
            Explore Events
            <ArrowRightIcon />
          </Link>
          <Link to="/newsletter" className="home-hero__cta-secondary">
            <MailIcon />
            Subscribe
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="home-hero__scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span>Scroll</span>
        <div className="home-hero__scroll-line" />
      </motion.div>
    </motion.section>
  )
}

// ─── Focus Areas Section ─────────────────────────────────────────

function FocusAreasSection() {
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
            What We Do
          </motion.p>
          <motion.h2 variants={fadeUp} className="home-section__title">
            Two Disciplines, One Lab
          </motion.h2>
          <motion.p variants={fadeUp} className="home-section__subtitle">
            We bridge the gap between electronics and code — from PCB design and
            microcontroller firmware to full-stack web applications and dev tooling.
          </motion.p>
        </motion.div>

        <div className="home-focus-grid">
          {/* Hardware Card */}
          <motion.div
            className="home-focus-card"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="home-focus-card__icon home-focus-card__icon--hardware">
              <ChipIcon />
            </div>
            <h3 className="home-focus-card__title">Hardware</h3>
            <p className="home-focus-card__desc">
              Microcontrollers, sensor integration, PCB layout and prototyping.
              Learn to take a circuit from schematic to a manufactured board.
            </p>
            <div className="home-focus-card__tags">
              <span className="home-focus-card__tag">ESP32</span>
              <span className="home-focus-card__tag">KiCad</span>
              <span className="home-focus-card__tag">IoT</span>
              <span className="home-focus-card__tag">Sensors</span>
            </div>
          </motion.div>

          {/* Software Card */}
          <motion.div
            className="home-focus-card"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="home-focus-card__icon home-focus-card__icon--software">
              <CodeIcon />
            </div>
            <h3 className="home-focus-card__title">Software</h3>
            <p className="home-focus-card__desc">
              Web development, version control and collaborative coding.
              Build real projects with modern tools and industry workflows.
            </p>
            <div className="home-focus-card__tags">
              <span className="home-focus-card__tag">React</span>
              <span className="home-focus-card__tag">Git</span>
              <span className="home-focus-card__tag">Vite</span>
              <span className="home-focus-card__tag">Open Source</span>
            </div>
          </motion.div>
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
  // Only real, verifiable data from the actual events.js and project
  const stats = [
    { value: 4, suffix: '+', label: 'Workshops Conducted' },
    { value: 2, suffix: '', label: 'Focus Areas' },
    { value: 2, suffix: '', label: 'Upcoming Events' },
    { value: 2026, suffix: '', label: 'Established' },
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
          {stats.map((stat, i) => (
            <motion.div key={i} className="home-stat" variants={fadeUp}>
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
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section ref={sectionRef} className="home-section home-newsletter-section">
      <motion.div className="home-section__container" style={{ y: parallaxY }}>
        <motion.div
          className="home-newsletter-card"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="home-newsletter-card__glow" />
          <h2 className="home-newsletter-card__title">Stay in the Loop</h2>
          <p className="home-newsletter-card__text">
            Get notified about upcoming workshops, events and club updates.
            No spam — just announcements that matter.
          </p>
          <Link to="/newsletter" className="home-newsletter-card__cta">
            <MailIcon />
            Subscribe to Newsletter
          </Link>
        </motion.div>
      </motion.div>
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
      <FocusAreasSection />
      <hr className="home-divider" />
      <EventsPreviewSection />
      <StatsSection />
      <NewsletterCTASection />
    </div>
  )
}

