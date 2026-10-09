import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
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
import NotFound from './pages/NotFound'

const AdminWall = lazy(() => import('./pages/AdminWall'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const CursorBuddy = lazy(() => import('./components/CursorBuddy'))
const PortfolioMiner = lazy(() => import('./components/PortfolioMiner'))
const GitHubActivity = lazy(() => import('./components/GitHubActivity'))
const KONAMI_SEQUENCE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
]

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
  const [showBuddy, setShowBuddy] = useState(false)
  const [mining, setMining] = useState(false)
  const stopMining = useCallback(() => {
    setMining(false)
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>('.cursor-buddy')?.focus()
    })
  }, [])
  const [secretVisible, setSecretVisible] = useState(false)
  const [miningSecretSignal, setMiningSecretSignal] = useState(0)
  const secretProgress = useRef(0)
  const secretTimer = useRef<number | null>(null)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => { setMining(false) }, [location.pathname])

  useEffect(() => {
    const timerId = setTimeout(() => setShowBuddy(true), 1200)
    return () => clearTimeout(timerId)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        secretProgress.current = 0
        return
      }

      const key = event.key.toLowerCase()
      const expected = KONAMI_SEQUENCE[secretProgress.current]
      secretProgress.current = key === expected
        ? secretProgress.current + 1
        : key === KONAMI_SEQUENCE[0]
          ? 1
          : 0

      if (secretProgress.current !== KONAMI_SEQUENCE.length) return

      secretProgress.current = 0
      if (window.location.pathname === '/') setMiningSecretSignal((signal) => signal + 1)
      setSecretVisible(false)
      window.requestAnimationFrame(() => setSecretVisible(true))
      if (secretTimer.current) window.clearTimeout(secretTimer.current)
      secretTimer.current = window.setTimeout(
        () => setSecretVisible(false),
        3200,
      )
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (secretTimer.current) window.clearTimeout(secretTimer.current)
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<Suspense fallback={<div className="min-h-screen bg-bg" />}><ProjectDetail /></Suspense>} />
        <Route path="/admin-wall" element={<Suspense fallback={<div className="min-h-screen bg-bg" />}><AdminWall /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isHomePage && showBuddy && !mining && <Suspense><CursorBuddy onStartMining={() => setMining(true)} secretSignal={miningSecretSignal} /></Suspense>}
      {isHomePage && mining && <Suspense><PortfolioMiner onExit={stopMining} /></Suspense>}
      {secretVisible && (
        <div className="secret-reveal" role="status" aria-live="polite">
          <div className="secret-reveal__mark" aria-hidden="true">WIS.</div>
          <p className="secret-reveal__eyebrow">Hidden sequence found</p>
          <p className="secret-reveal__message">Built with curiosity.</p>
        </div>
      )}
    </>
  )
}
