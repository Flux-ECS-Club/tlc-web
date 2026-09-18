import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'


// temp pages for testing

const Home = () => (
  <div className="min-h-screen bg-black px-10 pt-32">
    <h1 className="text-6xl font-bold">Home</h1>
  </div>
)

const Projects = () => (
  <div className="min-h-screen bg-black px-10 pt-32">
    <h1 className="text-6xl font-bold">Projects</h1>
  </div>
)

const Events = () => (
  <div className="min-h-screen bg-black px-10 pt-32">
    <h1 className="text-6xl font-bold">Events</h1>
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

const Handbook = () => (
  <div className="min-h-screen bg-black px-10 pt-32">
    <h1 className="text-6xl font-bold">Handbook</h1>
  </div>
)


const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/handbook" element={<Handbook />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App
