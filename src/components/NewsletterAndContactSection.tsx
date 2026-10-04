import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Mail,
  MapPin,
  MessageSquare,
  Radio,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code,
  Share2
} from 'lucide-react';

export const NewsletterAndContactSection: React.FC = () => {
  const { subscribeNewsletter, sendContactMessage } = useApp();

  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState<boolean>(false);

  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactCategory, setContactCategory] = useState<string>('Technical Support');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(newsletterEmail);
    if (res.success) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 8000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    const res = sendContactMessage({
      name: contactName,
      email: contactEmail,
      category: contactCategory,
      message: contactMessage
    });
    if (res.success) {
      setContactSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSubmitted(false), 8000);
    } else {
      setContactError(res.error || 'Failed to dispatch message.');
    }
  };

  return (
    <section className="relative w-full max-w-[1240px] mx-auto px-6 mb-8" id="newsletter-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Newsletter Subscription Card (Exact from Screenshot) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1b1c25] via-[#1b1c25] to-[#242533] border border-[#2b2c37]/60 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff5545]/15 text-[#ff5545] border border-[#ff5545]/20 text-xs font-mono-code mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545]" />
              <span>COMMUNICATIONS DISPATCH</span>
            </div>
            <h2 className="font-headline text-2xl text-white font-bold mb-2">
              Stay in the Telemetry Loop
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#9ba0b4] leading-relaxed mb-6 max-w-lg">
              Get alerts on new component batches, hardware hackathons, firmware releases, and university workshop openings. Zero spam.
            </p>
          </div>

          {newsletterSubmitted ? (
            <div className="p-4 rounded-xl bg-[#3fdeb7]/15 border border-[#3fdeb7]/30 text-[#3fdeb7] text-xs font-mono-code flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>You're connected to the telemetry loop. Firmware dispatches active.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="cadet@university.edu"
                className="px-4 py-2.5 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white placeholder-[#9ba0b4]/50 text-sm focus:outline-none focus:border-[#00eefc] flex-1 font-mono-code"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#ff5545] hover:bg-[#ff3b30] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Quick Contact Card (Exact from Screenshot) */}
        <div
          className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#1b1c25]/60 border border-[#2b2c37]/60 flex flex-col justify-between"
          id="contact-section"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00eefc]/15 text-[#00eefc] border border-[#00eefc]/20 text-xs font-mono-code mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>DIRECT CONTACT</span>
            </div>
            <h3 className="font-headline text-xl text-white font-bold mb-2">
              Lab Hub &amp; Assistance
            </h3>
            <p className="font-body text-xs text-[#9ba0b4] leading-relaxed mb-4">
              Connect directly with lab managers for sponsorship, hardware inquiries, or workshop reservations.
            </p>

            <div className="flex flex-col gap-2.5 text-xs font-mono-code text-[#9ba0b4]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00eefc]" />
                <a href="mailto:contact@fluxecs.org" className="hover:text-white transition-colors">
                  contact@fluxecs.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff5545]" />
                <span>Cybernetics Wing, Lab 304, Tech Quad</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3fdeb7]" />
                <span>Discord Cadet Guild: #lab-helpdesk</span>
              </div>
            </div>
          </div>

          {/* Inline Quick Query Dispatch */}
          <div className="mt-4 pt-4 border-t border-[#2b2c37]/40">
            {contactSubmitted ? (
              <div className="p-3 rounded-lg bg-[#3fdeb7]/15 text-[#3fdeb7] text-xs font-mono-code">
                Query received! Lab officers notified.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name"
                    className="px-2.5 py-1.5 rounded bg-[#0d0e15] border border-[#2b2c37] text-white text-xs focus:outline-none focus:border-[#00eefc]"
                    required
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Your Email"
                    className="px-2.5 py-1.5 rounded bg-[#0d0e15] border border-[#2b2c37] text-white text-xs focus:outline-none focus:border-[#00eefc]"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Quick assistance query..."
                    className="flex-1 px-2.5 py-1.5 rounded bg-[#0d0e15] border border-[#2b2c37] text-white text-xs focus:outline-none focus:border-[#00eefc]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-[#242533] hover:bg-[#343647] text-[#00eefc] hover:text-white text-xs font-mono-code font-bold uppercase transition-colors shrink-0"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}

            <div className="pt-3 mt-3 border-t border-[#2b2c37]/30 flex items-center justify-between text-xs text-[#9ba0b4]">
              <span>Campus Lab Hours: 08:00 - 22:00</span>
              <div className="flex items-center gap-2">
                <a
                  href="#inventory-section"
                  className="w-7 h-7 rounded bg-[#242533] hover:bg-[#343647] flex items-center justify-center text-[#9ba0b4] hover:text-white transition-colors"
                  title="Lab Codebase"
                >
                  <Code className="w-3.5 h-3.5" />
                </a>
                <a
                  href="mailto:contact@fluxecs.org"
                  className="w-7 h-7 rounded bg-[#242533] hover:bg-[#343647] flex items-center justify-center text-[#9ba0b4] hover:text-[#ff5545] transition-colors"
                  title="Contact Mail"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
