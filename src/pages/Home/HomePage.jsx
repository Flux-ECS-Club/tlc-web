/**
 * HomePage Component — Tinkerer's Lab ECS (Formal Engineering Design)
 *
 * Design Architecture:
 *   - Asymmetric Split Layout Hero (Left: Monospaced tag + Left-aligned typography + Action Buttons; Right: Interactive Workbench Console)
 *   - Interactive Workbench Console (Tabs: ESP32 Firmware, KiCad Pinout, React Web App with real code snippets)
 *   - Bento Grid Ecosystem ("Hardware", "Software", "Lab Workspace")
 *   - Filterable Tech Stack Grid (Hardware, Firmware, Web, Tools)
 *   - Factual Monospaced Stats Bar
 *   - Formal Engineering CTA
 */

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { CLUB_CONFIG } from '../../config/clubConfig'
import './home.css'

// ─── Animation Variants ────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

// ─── Inline SVG Icons ───────────────────────────────────────────

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const ChipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
)

const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </svg>
)

const TerminalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ─── INTERACTIVE WORKBENCH CONSOLE CODE SNIPPETS ───────────────

const CONSOLE_SNIPPETS = {
  firmware: {
    filename: 'main.cpp',
    lang: 'C++',
    lines: [
      { num: 1, text: '#include <WiFi.h>' },
      { num: 2, text: '#include <driver/gpio.h>' },
      { num: 3, text: '' },
      { num: 4, text: '// Tinkerer\'s Lab ECS — ESP32 Sensor Loop' },
      { num: 5, text: 'void setup() {' },
      { num: 6, text: '  Serial.begin(115200);' },
      { num: 7, text: '  pinMode(GPIO_NUM_2, OUTPUT);' },
      { num: 8, text: '  Serial.println("SYS_INIT: OK");' },
      { num: 9, text: '}' },
      { num: 10, text: '' },
      { num: 11, text: 'void loop() {' },
      { num: 12, text: '  digitalWrite(GPIO_NUM_2, HIGH);' },
      { num: 13, text: '  delay(500);' },
      { num: 14, text: '}' },
    ],
  },
  schematic: {
    filename: 'pinout.config',
    lang: 'Hardware Pinout',
    lines: [
      { num: 1, text: '// ESP32 WROOM-32 Pinout Mapping' },
      { num: 2, text: '[GPIO_32] -> ADC1_CH4 (Analog Sensor)' },
      { num: 3, text: '[GPIO_21] -> I2C_SDA (OLED Display)' },
      { num: 4, text: '[GPIO_22] -> I2C_SCL (Clock Line)' },
      { num: 5, text: '[GPIO_17] -> UART2_TX (Telemetry Output)' },
      { num: 6, text: '[GPIO_16] -> UART2_RX (Telemetry Input)' },
      { num: 7, text: '' },
      { num: 8, text: '// KiCad Gerber Export Status' },
      { num: 9, text: 'LAYER_TOP     : F_Cu (Copper Verified)' },
      { num: 10, text: 'LAYER_BOTTOM  : B_Cu (Ground Plane OK)' },
      { num: 11, text: 'DRILL_MAP     : 0.8mm Vias Generated' },
    ],
  },
  webapp: {
    filename: 'App.jsx',
    lang: 'React',
    lines: [
      { num: 1, text: 'import React from \'react\'' },
      { num: 2, text: 'import { CLUB_CONFIG } from \'./clubConfig\'' },
      { num: 3, text: '' },
      { num: 4, text: 'export default function LabDashboard() {' },
      { num: 5, text: '  return (' },
      { num: 6, text: '    <div className="lab-workspace">' },
      { num: 7, text: '      <h1>{CLUB_CONFIG.name}</h1>' },
      { num: 8, text: '      <p>{CLUB_CONFIG.department}</p>' },
      { num: 9, text: '    </div>' },
      { num: 10, text: '  )' },
      { num: 11, text: '}' },
    ],
  },
}

function WorkbenchConsole() {
  const [activeTab, setActiveTab] = useState('firmware')
  const [copied, setCopied] = useState(false)

  const currentSnippet = CONSOLE_SNIPPETS[activeTab]

  const handleCopy = () => {
    const text = currentSnippet.lines.map((l) => l.text).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="home-console">
      {/* Console Header */}
      <div className="home-console__header">
        <div className="home-console__dots">
          <span className="home-console__dot home-console__dot--red" />
          <span className="home-console__dot home-console__dot--yellow" />
          <span className="home-console__dot home-console__dot--green" />
        </div>

        <div className="home-console__tabs">
          <button
            type="button"
            className={`home-console__tab ${activeTab === 'firmware' ? 'home-console__tab--active' : ''}`}
            onClick={() => setActiveTab('firmware')}
          >
            main.cpp
          </button>
          <button
            type="button"
            className={`home-console__tab ${activeTab === 'schematic' ? 'home-console__tab--active' : ''}`}
            onClick={() => setActiveTab('schematic')}
          >
            pinout.config
          </button>
          <button
            type="button"
            className={`home-console__tab ${activeTab === 'webapp' ? 'home-console__tab--active' : ''}`}
            onClick={() => setActiveTab('webapp')}
          >
            App.jsx
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Console Code Body */}
      <div className="home-console__body">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {currentSnippet.lines.map((line) => (
              <div key={line.num} className="home-console__line">
                <span className="home-console__ln">{line.num}</span>
                <span className="home-console__code">{line.text}</span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Console Footer */}
      <div className="home-console__footer">
        <span className="home-console__status">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          SYS_READY: {currentSnippet.lang}
        </span>
        <span>{CLUB_CONFIG.institutionShort} · ECS LAB</span>
      </div>
    </div>
  )
}

// ─── 1. HERO SECTION (Asymmetric Split Layout) ─────────────────

function HeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero__container">
        {/* Left Side: Typography & CTAs */}
        <motion.div
          className="home-hero__content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="home-hero__mono-tag">
            <span className="home-hero__mono-dot" />
            // {CLUB_CONFIG.institutionShort} · {CLUB_CONFIG.department}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="home-hero__title">
            Tinkerer's Lab <br />
            <span className="home-hero__title-sub">ECS Department</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="home-hero__description">
            The official student engineering workspace bridging hardware development and software engineering. We host hands-on workshops, build real-world IoT systems, and contribute to open source.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="home-hero__actions">
            <Link to="/events" className="home-btn-primary">
              Explore Events <ArrowRightIcon />
            </Link>
            <Link to="/contact" className="home-btn-secondary">
              Contact Lab
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side: Workbench Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <WorkbenchConsole />
        </motion.div>
      </div>
    </section>
  )
}

// ─── 2. BENTO GRID — Features / Lab Ecosystem ───────────────────

function BentoGridSection() {
  return (
    <section className="home-section">
      <div className="home-section__container">
        <div className="home-section__header">
          <p className="home-section__tag">// Ecosystem</p>
          <h2 className="home-section__title">What Happens in the Lab</h2>
          <p className="home-section__subtitle">
            A structured space for students to experiment, prototype circuits, and write production software.
          </p>
        </div>

        <div className="home-bento-grid">
          {/* Card 1: Embedded Hardware */}
          <div className="home-bento-card">
            <div>
              <span className="home-bento-card__badge home-bento-card__badge--hw">
                <ChipIcon /> Hardware & Firmware
              </span>
              <h3 className="home-bento-card__title">Microcontrollers & PCB Design</h3>
              <p className="home-bento-card__text">
                Hands-on development with ESP32, KiCad schematic capture, trace routing, and sensor interfacing. Learn to design manufacturing-ready PCB files.
              </p>
            </div>
            <div className="home-bento-card__tags">
              <span className="home-bento-tag">ESP32</span>
              <span className="home-bento-tag">KiCad</span>
              <span className="home-bento-tag">Gerber Export</span>
              <span className="home-bento-tag">Sensors</span>
            </div>
          </div>

          {/* Card 2: Software Engineering */}
          <div className="home-bento-card">
            <div>
              <span className="home-bento-card__badge home-bento-card__badge--sw">
                <CodeIcon /> Web & Dev Tools
              </span>
              <h3 className="home-bento-card__title">Full-Stack & Version Control</h3>
              <p className="home-bento-card__text">
                Modern frontend development with React and Vite, Git branching workflows, pull requests, and automated deployment practices.
              </p>
            </div>
            <div className="home-bento-card__tags">
              <span className="home-bento-tag">React</span>
              <span className="home-bento-tag">Git</span>
              <span className="home-bento-tag">Vite</span>
              <span className="home-bento-tag">Open Source</span>
            </div>
          </div>

          {/* Card 3: Peer Workspace (Full Width) */}
          <div className="home-bento-card home-bento-card--full">
            <div>
              <span className="home-bento-card__badge home-bento-card__badge--lab">
                <TerminalIcon /> Student Technical Workspace
              </span>
              <h3 className="home-bento-card__title">Collaborative Prototyping Space</h3>
              <p className="home-bento-card__text">
                Access equipment, work alongside peers, and bring ideas from concept to physical demo. Supported by senior council members and department mentors.
              </p>
            </div>
            <div className="home-bento-card__tags">
              <span className="home-bento-tag">Hands-on Workshops</span>
              <span className="home-bento-tag">Peer Learning</span>
              <span className="home-bento-tag">VESIT Campus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 3. FILTERABLE TECH STACK GRID ──────────────────────────────

const TECH_ITEMS = [
  { name: 'ESP32', cat: 'hardware' },
  { name: 'KiCad PCB', cat: 'hardware' },
  { name: 'Arduino', cat: 'hardware' },
  { name: 'Raspberry Pi', cat: 'hardware' },
  { name: 'React', cat: 'software' },
  { name: 'JavaScript', cat: 'software' },
  { name: 'Git & GitHub', cat: 'tools' },
  { name: 'Vite', cat: 'software' },
  { name: 'Node.js', cat: 'software' },
  { name: 'Python', cat: 'software' },
  { name: 'C / C++', cat: 'hardware' },
  { name: 'VS Code', cat: 'tools' },
  { name: 'Linux', cat: 'tools' },
  { name: 'Oscilloscope', cat: 'hardware' },
]

function TechStackSection() {
  const [filter, setFilter] = useState('all')

  const filteredItems = filter === 'all'
    ? TECH_ITEMS
    : TECH_ITEMS.filter((item) => item.cat === filter)

  return (
    <section className="home-section">
      <div className="home-section__container">
        <div className="home-section__header">
          <p className="home-section__tag">// Technologies</p>
          <h2 className="home-section__title">Tools Used in the Lab</h2>
          <p className="home-section__subtitle">
            Industry-standard hardware suites, dev environments, and languages.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="home-tech-filters">
          <button
            type="button"
            className={`home-tech-filter-btn ${filter === 'all' ? 'home-tech-filter-btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tools
          </button>
          <button
            type="button"
            className={`home-tech-filter-btn ${filter === 'hardware' ? 'home-tech-filter-btn--active' : ''}`}
            onClick={() => setFilter('hardware')}
          >
            Hardware & Firmware
          </button>
          <button
            type="button"
            className={`home-tech-filter-btn ${filter === 'software' ? 'home-tech-filter-btn--active' : ''}`}
            onClick={() => setFilter('software')}
          >
            Software & Web
          </button>
          <button
            type="button"
            className={`home-tech-filter-btn ${filter === 'tools' ? 'home-tech-filter-btn--active' : ''}`}
            onClick={() => setFilter('tools')}
          >
            Workflow & Tools
          </button>
        </div>

        {/* Tech Grid */}
        <motion.div className="home-tech-grid" layout>
          <AnimatePresence>
            {filteredItems.map((tech) => (
              <motion.div
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="home-tech-item"
              >
                <CheckIcon />
                <span>{tech.name}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 4. FACTUAL STATS BAR ────────────────────────────────────────

function AnimatedStat({ value, suffix }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const startTime = performance.now()
    const ms = 1500

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / ms, 1)
      setVal(Math.round(value * progress))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, value])

  return <span ref={ref}>{val}{suffix}</span>
}

function StatsBarSection() {
  const stats = [
    { value: 4, suffix: '+', label: 'Workshops Conducted' },
    { value: 2, suffix: '', label: 'Focus Disciplines' },
    { value: 2, suffix: '', label: 'Upcoming Sessions' },
    { value: 2026, suffix: '', label: 'Established' },
  ]

  return (
    <section className="home-stats-bar">
      <div className="home-stats-container">
        {stats.map((stat, i) => (
          <div key={i} className="home-stat-box">
            <div className="home-stat-num">
              <AnimatedStat value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="home-stat-lbl">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── 5. FORMAL CTA BANNER ────────────────────────────────────────

function FormalCTASection() {
  return (
    <section className="home-section">
      <div className="home-section__container">
        <div className="home-cta-box">
          <div className="home-cta-box__content">
            <h2 className="home-cta-box__title">Get Involved with the Lab</h2>
            <p className="home-cta-box__desc">
              Whether you're interested in attending workshops or participating in project builds — connect with the council members today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="home-btn-primary">
              Contact Us <ArrowRightIcon />
            </Link>
            <Link to="/events" className="home-btn-secondary">
              View Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── MAIN HOME COMPONENT ─────────────────────────────────────────

export default function HomePage() {
  return (
    <div style={{ background: 'var(--page-bg)', minHeight: '100vh', position: 'relative' }}>
      <div className="home-bg-grid" aria-hidden="true" />
      <HeroSection />
      <BentoGridSection />
      <TechStackSection />
      <StatsBarSection />
      <FormalCTASection />
    </div>
  )
}
