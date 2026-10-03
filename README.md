# ECS Technical Club Website — Frontend Workstream

## Overview

This repository contains the frontend implementation for the **Electronics & Computer Science (ECS) Technical Club** at VESIT, Mumbai.

> **Note on club name:** The club is currently referenced under the temporary working name **FluxECS** / **Tinkerer's Lab ECS**. The permanent name will be finalized following faculty and council review. To prevent hardcoding, all club naming and metadata are centralized in `src/config/clubConfig.js`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 + Page-Scoped CSS |
| Routing | React Router DOM v7 |
| Animation | Framer Motion |
| Language | JavaScript (ESModules / JSX) |
| Version Control | Git + GitHub |

---

## What Was Implemented

### 1. Events Page (`/events`)
- **Upcoming & Past Switcher**: Segmented toggle to switch between active/upcoming and archived events with animated active pill transitions.
- **Event Card System (`EventCard.jsx`)**: Designed around event posters created by the graphics team. Includes poster display (with a fallback placeholder when no image is uploaded), category tags (`software` / `hardware`), date, time, venue, description, and state-aware call-to-action buttons (`Register`, `View Details`, `View Recap`).
- **Data Architecture (`src/data/events.js`)**: Structured local data store compatible with future REST API / PostgreSQL integration.
- **Visibility & Confidentiality (`published: true/false`)**: Built-in filtering via `getPublicEvents()`. Internal drafts or unannounced events with `published: false` remain hidden from public views until officially published.
- **Empty States**: Clean, structured fallback message when no events are scheduled in a selected tab.

### 2. Contact Page (`/contact`)
- **Responsive 2-Column Layout**: Club contact information sidebar paired with an inquiry form.
- **Club Information**: Dynamic details (campus, official email, social channels) sourced from `clubConfig.js`.
- **Form Interaction**: Frontend validation for Name, Email, and Message, with responsive submit button and interactive confirmation view.

### 3. Newsletter Page (`/newsletter`)
- **Subscription Card**: Clean, distraction-free subscription card with email input and confirmation feedback state.
- **Frontend Architecture**: Ready for backend mailing service integration.

### 4. Navigation Bar (`Navbar.jsx`)
- **Persistent Header**: Full-width top navigation with glassmorphism backdrop (`backdrop-blur-md`) and subtle border.
- **Brand Group**: Circular club logo paired with 2-line institutional typography (club name + department/college context).
- **Core Navigation**: Desktop navigation links with animated active pill indicators.
- **Quick Action CTA**: Dedicated header button for direct access to events and newsletter.
- **Theme Switcher**: Clean SVG vector toggle for dark and light modes.
- **Mobile Navigation Drawer**: Fully responsive slide-down menu with automatic close on route selection.

### 5. Centralized Configuration (`src/config/clubConfig.js`)
- Single source of truth for club naming, department info, institution, location, email, and social links.
- Updating this one file updates branding across the navbar, contact page, and footer without code changes.

### 6. CSS Architecture & Scoping
- **Global Theme Variables (`src/index.css`)**: Root CSS variables (`--page-bg`, `--surface`, `--border`, `--text-*`, `--accent`) providing a neutral foundation that the design team can customize without touching JSX.
- **Scoped Stylesheets**: All page styles are isolated using unique prefixes to avoid affecting other parts of the site:
  - `src/pages/Events/events.css` (`.events-*`, `.event-card*`)
  - `src/pages/Contact/contact.css` (`.contact-*`)
  - `src/pages/Newsletter/newsletter.css` (`.newsletter-*`)

---

## Project Structure

```text
tlc-web/
├── public/
├── src/
│   ├── assets/
│   │   └── logo.png             ← Circular club logo
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx       ← Responsive header with branding, CTA & mobile drawer
│   │   └── EventCard/
│   │       └── EventCard.jsx    ← Reusable event card component
│   │
│   ├── config/
│   │   └── clubConfig.js        ← Centralized club metadata & branding
│   │
│   ├── data/
│   │   └── events.js            ← Event data store & publication filtering
│   │
│   ├── pages/
│   │   ├── Events/
│   │   │   ├── Events.jsx
│   │   │   └── events.css
│   │   ├── Contact/
│   │   │   ├── Contact.jsx
│   │   │   └── contact.css
│   │   └── Newsletter/
│   │       ├── Newsletter.jsx
│   │       └── newsletter.css
│   │
│   ├── App.jsx                  ← Main routes & shared layout
│   ├── index.css                ← Global theme variables
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Local Setup & Development

```bash
# Clone the repository
git clone https://github.com/Club-TBD/tlc-web.git
cd tlc-web

# Install dependencies
npm install

# Start local development server
npm run dev

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```

---

## Event Poster System

The Event Card is optimized for vertical posters (3:4 ratio):
1. Place poster images in `src/assets/` or provide an external image URL.
2. Assign the path to the `poster` field in `src/data/events.js`:
   ```javascript
   {
     id: 'evt-001',
     title: 'Workshop Title',
     category: 'hardware', // or 'software'
     date: 'October 18, 2026',
     time: '10:00 AM – 1:00 PM',
     venue: 'Lab 402, VESIT',
     description: 'Event overview...',
     poster: '/src/assets/poster.jpg',
     ctaLabel: 'Register',
     ctaLink: '#',
     status: 'upcoming', // 'upcoming' | 'past'
     published: true,
   }
   ```
3. If no poster is available (`poster: ''`), a fallback placeholder is rendered automatically so layouts remain consistent.

---

## Future Backend Integration Guide

The frontend structure is designed for clean backend handoff:

- **Events (`/api/events`)**:
  Replace `getPublicEvents()` in `src/pages/Events/Events.jsx` with an asynchronous `fetch('/api/events?published=true')` request. The component and card render data identically.
- **Contact Form (`/api/contact`)**:
  Replace the client-side timeout in `Contact.jsx` `handleSubmit` with a `POST` request to your backend email/contact endpoint.
- **Newsletter Subscription (`/api/newsletter`)**:
  Replace the submission handler in `Newsletter.jsx` with a `POST` request to your newsletter/mailing provider.