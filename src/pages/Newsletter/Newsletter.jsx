import { useState } from 'react'
import './newsletter.css'

const CheckIcon = () => (
  <svg className="newsletter-success__icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Frontend-only for now; connect to mailing API later.
    setTimeout(() => {
      setSubmitting(false)
      setSubscribed(true)
    }, 500)
  }

  return (
    <div className="newsletter-page">
      <div className="newsletter-container">
        <div className="newsletter-card">
          {subscribed ? (
            <div className="newsletter-success">
              <CheckIcon />
              <h3 className="newsletter-success__title">You&apos;re subscribed</h3>
              <p className="newsletter-success__text">
                We&apos;ll notify you about upcoming events and club updates.
              </p>
              <button
                type="button"
                className="newsletter-success__reset"
                onClick={() => { setSubscribed(false); setEmail('') }}
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <>
              <h1 className="newsletter-card__title">Stay Updated</h1>
              <p className="newsletter-card__subtitle">
                Get notified about upcoming workshops, events and club activities.
                No spam — club updates only.
              </p>

              <form className="newsletter-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="newsletter-submit"
                >
                  {submitting ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>

              <p className="newsletter-note">
                You can unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
