/**
 * EventCard — reusable event card component.
 *
 * The poster image is the primary visual.
 * When no poster is available, a neutral placeholder is shown
 * so layout doesn't break.
 *
 * Future: poster URL will come from the backend once
 * the graphics team uploads it.
 */

import { motion } from 'framer-motion'

// SVG icons — inline so no icon library dependency is needed
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function EventCard({ event }) {
  const isSoftware = event.category?.toLowerCase() === 'software'
  const hasPoster = Boolean(event.poster)

  return (
    <motion.article
      className="event-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {/* Poster / Visual */}
      <div className="event-card__poster-wrap">
        {hasPoster ? (
          <img
            src={event.poster}
            alt={`${event.title} poster`}
            className="event-card__poster"
            loading="lazy"
          />
        ) : (
          <div className="event-card__poster-placeholder">
            <span className="event-card__poster-placeholder-text">Poster coming soon</span>
          </div>
        )}

        {/* Category badge — top left */}
        <span className={`event-card__category ${isSoftware ? 'event-card__category--software' : 'event-card__category--hardware'}`}>
          {event.category || 'Event'}
        </span>
      </div>

      {/* Content */}
      <div className="event-card__body">
        <h3 className="event-card__title">{event.title}</h3>

        <div className="event-card__meta">
          <span className="event-card__meta-item">
            <CalendarIcon /> {event.date}
          </span>
          {event.time && (
            <span className="event-card__meta-item">
              <ClockIcon /> {event.time}
            </span>
          )}
          {event.venue && (
            <span className="event-card__meta-item">
              <LocationIcon /> {event.venue}
            </span>
          )}
        </div>

        <p className="event-card__description">{event.description}</p>

        {event.ctaLabel && (
          <a href={event.ctaLink || '#'} className="event-card__cta">
            {event.ctaLabel}
            <ArrowRightIcon />
          </a>
        )}
      </div>
    </motion.article>
  )
}
