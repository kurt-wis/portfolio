import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import BackgroundGrain from './components/BackgroundGrain'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Approach from './components/Approach'
import Experience from './components/Experience'
import Stack from './components/Stack'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CommandTrigger from './components/CommandTrigger'
import NotFound from './pages/NotFound'

const AdminWall = lazy(() => import('./pages/AdminWall'))
const CommandPalette = lazy(() => import('./components/CommandPalette'))
const CursorBuddy = lazy(() => import('./components/CursorBuddy'))
const GitHubActivity = lazy(() => import('./components/GitHubActivity'))

function GitHubActivityLoader() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '500px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div id="github" ref={ref} className="min-h-[320px]">
      {visible && (
        <Suspense fallback={<div className="mx-auto my-20 h-40 max-w-wrap animate-pulse rounded-2xl bg-bg-soft" />}>
          <GitHubActivity />
        </Suspense>
      )}
    </div>
  )
}

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
        <GitHubActivityLoader />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [showBuddy, setShowBuddy] = useState(false)
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

  useEffect(() => {
    const timerId = setTimeout(() => setShowBuddy(true), 1200)
    return () => clearTimeout(timerId)
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-wall" element={<Suspense fallback={<div className="min-h-screen bg-bg" />}><AdminWall /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && (
        <>
          {showBuddy && <Suspense><CursorBuddy /></Suspense>}
          <CommandTrigger onOpen={() => setCommandOpen(true)} />
          {commandOpen && (
            <Suspense>
              <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
            </Suspense>
          )}
        </>
      )}
    </>
  )
}
