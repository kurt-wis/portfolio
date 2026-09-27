import { useEffect, useRef, useState } from 'react'

const PHRASES = [
  'npm install hire-me',
  'git commit -m "hire Kurt"',
  'currently learning tRPC',
  'go check my projects',
  'press cmd k to explore',
  'console.log("hire me")',
  'sudo hire kurt',
  'i like clean code',
  'shipping > perfect',
  'coffee.exe is running',
  'reading docs rn',
  'unit tests are friends',
  'brb debugging',
  'kurt writes good code',
  'click me for fun',
]

const GREETING = 'oh you are back'

export default function CursorBuddy({ onOpenCommand }: { onOpenCommand: () => void }) {
  const [phrase, setPhrase] = useState('')
  const [showBubble, setShowBubble] = useState(false)
  const [isSleeping, setIsSleeping] = useState(false)
  const [mood, setMood] = useState<'idle' | 'bounce' | 'wiggle' | 'pop'>('idle')
  const lastMove = useRef<number>(Date.now())
  const wasSleeping = useRef(false)

  const pickPhrase = () => PHRASES[Math.floor(Math.random() * PHRASES.length)]

  const pickMood = () => {
    const moods: Array<'bounce' | 'wiggle' | 'pop'> = ['bounce', 'wiggle', 'pop']
    setMood(moods[Math.floor(Math.random() * moods.length)])
    window.setTimeout(() => setMood('idle'), 900)
  }

  useEffect(() => {
    if (isSleeping) {
      setShowBubble(false)
      return
    }
    let timeout: number
    const loop = () => {
      const delay = 4000 + Math.random() * 3500
      timeout = window.setTimeout(() => {
        setPhrase(pickPhrase())
        setShowBubble(true)
        pickMood()
        window.setTimeout(() => setShowBubble(false), 3200)
        loop()
      }, delay)
    }
    loop()
    return () => clearTimeout(timeout)
  }, [isSleeping])

  useEffect(() => {
    const onMove = () => {
      lastMove.current = Date.now()
      if (wasSleeping.current) {
        wasSleeping.current = false
        setIsSleeping(false)
        setPhrase(GREETING)
        setShowBubble(true)
        pickMood()
        window.setTimeout(() => setShowBubble(false), 2600)
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Date.now() - lastMove.current > 15000) {
        setIsSleeping(true)
        wasSleeping.current = true
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="cursor-buddy-root">
      {showBubble && phrase && (
        <div className="cursor-buddy-bubble">
          <span>{phrase}</span>
          <div className="cursor-buddy-bubble-tail" />
        </div>
      )}

      <button
        onClick={onOpenCommand}
        className={`cursor-buddy ${isSleeping ? 'is-sleeping' : ''} mood-${mood}`}
        aria-label="Open command palette"
        >
        <div className="cursor-buddy-inner">
            <img
            src="/mascot.svg"
            alt=""
            className={`cursor-buddy-base cursor-buddy-awake ${isSleeping ? 'is-hidden' : ''}`}
            draggable={false}
            />
            <img
            src="/mascot-sleeping.svg"
            alt=""
            className={`cursor-buddy-base cursor-buddy-asleep ${isSleeping ? 'is-visible' : ''}`}
            draggable={false}
            />
        </div>
        </button>
    </div>
  )
}