import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import BackgroundGrain from './components/BackgroundGrain'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Approach from './components/Approach'
import Experience from './components/Experience'
import Stack from './components/Stack'
import GitHubActivity from './components/GitHubActivity'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CommandPalette from './components/CommandPalette'
import CommandTrigger from './components/CommandTrigger'
import NotFound from './pages/NotFound'
import AdminWall from './pages/AdminWall'
import CursorBuddy from './components/CursorBuddy'

function HomePage() {
  return (
    <div id="top">
      <BackgroundGrain />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Approach />
        <Experience />
        <Stack />
        <GitHubActivity />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const [commandOpen, setCommandOpen] = useState(false)
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin-wall'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k'
      const modifier = e.metaKey || e.ctrlKey
      if (isK && modifier) {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-wall" element={<AdminWall />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && (
        <>
          <CursorBuddy />
          <CommandTrigger onOpen={() => setCommandOpen(true)} />
          <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        </>
      )}
    </>
  )
}