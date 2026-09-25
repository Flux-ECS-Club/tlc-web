import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import Events from './pages/Events/Events'
import Contact from './pages/Contact/Contact'
import Newsletter from './pages/Newsletter/Newsletter'
import { CLUB_CONFIG } from './config/clubConfig'

// Placeholder pages — other team members will build these
const Home = () => (
  <div className="min-h-screen bg-black px-10 pt-32">
    <h1 className="text-6xl font-bold">Home</h1>
  </div>
)

const About = () => (
  <div className="min-h-screen bg-black px-10 pt-32">
    <h1 className="text-6xl font-bold">About</h1>
  </div>
)

const Blog = () => (
  <div className="min-h-screen bg-black px-10 pt-32">
    <h1 className="text-6xl font-bold">Blog</h1>
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/newsletter" element={<Newsletter />} />
          </Routes>
        </main>

        {/* Simple footer — update once team finalizes nav structure */}
        <footer className="border-t border-white/10 px-6 py-6 text-sm text-slate-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-slate-400 font-medium">{CLUB_CONFIG.longName}</span>
            <div className="flex items-center gap-5 text-xs">
              <Link to="/events" className="hover:text-white transition-colors">Events</Link>
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/newsletter" className="hover:text-white transition-colors">Newsletter</Link>
            </div>
            <span className="text-xs text-slate-600">
              {CLUB_CONFIG.institutionShort} · {new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
