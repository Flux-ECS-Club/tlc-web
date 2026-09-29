import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCard from '../../components/EventCard/EventCard'
import { getPublicEvents } from '../../data/events'
import './events.css'

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming')

  // Only publicly visible events (published: true)
  const publicEvents = useMemo(() => getPublicEvents(), [])

  const displayedEvents = useMemo(
    () => publicEvents.filter((e) => e.status === activeTab),
    [publicEvents, activeTab]
  )

  return (
    <div className="events-page">
      <div className="events-container">

        <header className="events-header">
          <h1 className="events-header__title">Events</h1>
          <p className="events-header__subtitle">
            Workshops, technical sessions and hands-on activities organised by the club.
          </p>
        </header>

        {/* Upcoming / Past tab switcher */}
        <div className="events-tabs" role="tablist">
          {['upcoming', 'past'].map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`events-tab ${activeTab === tab ? 'events-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="events-tab-pill"
                  className="events-tab__bg"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span className="events-tab__label">
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Event list */}
        <AnimatePresence mode="wait">
          {displayedEvents.length > 0 ? (
            <motion.div
              key={activeTab}
              className="events-grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {displayedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-empty`}
              className="events-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="events-empty__title">
                {activeTab === 'upcoming'
                  ? 'No upcoming events scheduled yet.'
                  : 'No past events recorded.'}
              </p>
              <p className="events-empty__text">Check back soon for announcements.</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
