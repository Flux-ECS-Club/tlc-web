import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Events', path: '/events' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Handbook', path: '/handbook' },
]

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [hoveredPath, setHoveredPath] = useState(null)

  const { pathname } = useLocation()

  useEffect(() => {document.documentElement.classList.toggle('dark', darkMode)}, [darkMode])
  const toggleTheme = () => {
    setDarkMode((prev) => !prev)
  }
  return (
    <nav className="fixed top-0 left-0 right-0 z-75 px-6 py-7">
      <div className="absolute left-6 top-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500">
          <span className="text-xl"></span> 
          {/* logo after finalising */}
        </div>
      </div>
      <div className="mx-auto flex w-fit items-center gap-3 rounded-full px-3 py-2 bg-gray-500/30 border-1 border-gray-500/80">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const isHovered = hoveredPath === item.path

          return (
            <Link key={item.path} to={item.path} onMouseEnter={() => setHoveredPath(item.path)} onMouseLeave={() => setHoveredPath(null)} className="relative rounded-full px-5 py-2.5 text-sm font-medium">
              {isHovered && !isActive && (
                <motion.div layoutId="hover" className="absolute inset-0 rounded-full bg-gray-500/30" transition={{type: 'spring',stiffness: 400, damping: 30,}}/>
                )}
              {isActive && (
                <motion.div layoutId="active" className="absolute inset-0 rounded-full bg-white" transition={{type: 'spring', stiffness: 300,  damping: 35}}/>
              )}
              <span className={`relative z-10 ${isActive ? 'text-black': 'text-white'}`}> {item.name} </span>
            </Link>
          )
        })}
        <button type="button" onClick={() => setDarkMode(!darkMode)} className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg transition-all duration-200 hover:bg-white/20"> 
          <motion.span animate={{ rotate: darkMode ? 0 : 450 }} transition={{duration: 0.5,ease: 'easeInOut',}} className="block">
            {darkMode ? '🔆' : '🌙'}
          </motion.span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
