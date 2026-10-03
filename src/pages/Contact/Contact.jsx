import { useState } from 'react'
import { CLUB_CONFIG } from '../../config/clubConfig'
import './contact.css'

// Inline SVG icons
const LocationIcon = () => (
  <svg className="contact-detail__icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const MailIcon = () => (
  <svg className="contact-detail__icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const CheckIcon = () => (
  <svg className="contact-success__icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    // Frontend-only for now; backend endpoint to be integrated later.
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div className="contact-page">
      <div className="contact-container">

        <header className="contact-header">
          <h1 className="contact-header__title">Contact</h1>
          <p className="contact-header__subtitle">
            Questions about events, workshops or the club? Reach out below.
          </p>
        </header>

        <div className="contact-layout">
          {/* Club info sidebar */}
          <aside className="contact-info">
            <div>
              <p className="contact-info__name">{CLUB_CONFIG.longName}</p>
              <p className="contact-info__location">
                {CLUB_CONFIG.institutionShort}, {CLUB_CONFIG.location}
              </p>
            </div>

            <hr className="contact-info__divider" />

            <div className="contact-detail">
              <LocationIcon />
              <div>
                <div className="contact-detail__label">Campus</div>
                <div className="contact-detail__value">{CLUB_CONFIG.institution}</div>
              </div>
            </div>

            <div className="contact-detail">
              <MailIcon />
              <div>
                <div className="contact-detail__label">Email</div>
                <div className="contact-detail__value">{CLUB_CONFIG.email}</div>
              </div>
            </div>

            <div className="contact-socials">
              <div className="contact-socials__title">Links</div>
              <div className="contact-socials__links">
                {CLUB_CONFIG.socials.github && (
                  <a href={CLUB_CONFIG.socials.github} target="_blank" rel="noreferrer"
                    className="contact-social-btn">GitHub</a>
                )}
                {CLUB_CONFIG.socials.instagram && (
                  <a href={CLUB_CONFIG.socials.instagram} target="_blank" rel="noreferrer"
                    className="contact-social-btn">Instagram</a>
                )}
                {CLUB_CONFIG.socials.linkedin && (
                  <a href={CLUB_CONFIG.socials.linkedin} target="_blank" rel="noreferrer"
                    className="contact-social-btn">LinkedIn</a>
                )}
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success">
                <CheckIcon />
                <h3 className="contact-success__title">Message sent</h3>
                <p className="contact-success__text">
                  Thanks for reaching out. A council member will get back to you soon.
                </p>
                <button
                  type="button"
                  className="contact-success__reset"
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-field">
                  <label htmlFor="contact-name" className="contact-field__label">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="contact-field__input"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email" className="contact-field__label">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="contact-field__input"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-message" className="contact-field__label">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    placeholder="Your message..."
                    value={form.message}
                    onChange={handleChange}
                    className="contact-field__textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="contact-form__submit"
                >
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
