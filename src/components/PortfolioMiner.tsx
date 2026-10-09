import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

type Point = { x: number; y: number }
type Chip = Point & { id: number }
type Tile = { column: number; row: number; hits: number }

const tileSizeFor = (width: number) => width / Math.max(1, Math.ceil(width / 72))

export default function PortfolioMiner({ onExit }: { onExit: () => void }) {
  const [position, setPosition] = useState<Point>({ x: window.innerWidth - 100, y: window.innerHeight - 170 })
  const [striking, setStriking] = useState(false)
  const [mined, setMined] = useState(0)
  const [message, setMessage] = useState('Tap or click any tile. Three hits breaks it.')
  const [chips, setChips] = useState<Chip[]>([])
  const [tiles, setTiles] = useState<Tile[]>([])
  const [view, setView] = useState({ width: window.innerWidth, height: window.innerHeight, scrollY: window.scrollY })
  const damage = useRef(new Map<string, Tile>())
  const tileSize = tileSizeFor(view.width)
  const busy = useRef(false)
  const timers = useRef<number[]>([])
  const exitButton = useRef<HTMLButtonElement>(null)
  const mineButton = useRef<HTMLButtonElement>(null)
  const chipId = useRef(0)

  useEffect(() => {
    exitButton.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onExit()
      if (event.key === 'Tab') {
        event.preventDefault()
        if (document.activeElement === exitButton.current) mineButton.current?.focus()
        else exitButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    let frame = 0
    const updateView = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setView({ width: window.innerWidth, height: window.innerHeight, scrollY: window.scrollY })
        setPosition((point) => ({
          x: Math.max(8, Math.min(window.innerWidth - 82, point.x)),
          y: Math.max(8, Math.min(window.innerHeight - 164, point.y)),
        }))
      })
    }
    window.addEventListener('scroll', updateView, { passive: true })
    window.addEventListener('resize', updateView)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', updateView)
      window.removeEventListener('resize', updateView)
      window.cancelAnimationFrame(frame)
      timers.current.forEach(window.clearTimeout)
    }
  }, [onExit])

  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.current = timers.current.filter((id) => id !== timer)
      callback()
    }, delay)
    timers.current.push(timer)
  }

  const mine = (column: number, row: number, point: Point) => {
    const key = `${column}:${row}`
    if (busy.current || (damage.current.get(key)?.hits ?? 0) >= 3) return
    busy.current = true
    setPosition({
      x: Math.max(8, Math.min(window.innerWidth - 82, point.x - 70)),
      y: Math.max(84, Math.min(window.innerHeight - 164, point.y - 62)),
    })
    later(() => {
      setStriking(true)
      const hits = (damage.current.get(key)?.hits ?? 0) + 1
      damage.current.set(key, { column, row, hits })
      setTiles(Array.from(damage.current.values()))
      const id = ++chipId.current
      setChips((old) => [...old.slice(-3), { ...point, id }])
      if (hits === 3) {
        setMined((count) => count + 1)
        setMessage('Tile broken. Keep mining, or restore the page.')
      } else setMessage(`${3 - hits} more ${hits === 1 ? 'hits' : 'hit'} to break this tile.`)
      later(() => setChips((old) => old.filter((chip) => chip.id !== id)), 750)
      later(() => { setStriking(false); busy.current = false }, 300)
    }, 260)
  }

  const mineAt = (point: Point) => {
    const size = tileSizeFor(window.innerWidth)
    const column = Math.floor(point.x / size)
    const row = Math.floor((point.y + window.scrollY) / size)
    if ((damage.current.get(`${column}:${row}`)?.hits ?? 0) >= 3) {
      setMessage('This tile is already broken. Try a neighboring tile.')
      return
    }
    mine(column, row, point)
  }

  const mineVisible = () => {
    const size = tileSizeFor(window.innerWidth)
    const columns = Math.round(window.innerWidth / size)
    const firstRow = Math.ceil(window.scrollY / size)
    const lastRow = Math.floor((window.scrollY + window.innerHeight - 164) / size) - 1
    for (let row = firstRow; row <= lastRow; row++) {
      for (let column = 0; column < columns; column++) {
        if ((damage.current.get(`${column}:${row}`)?.hits ?? 0) >= 3) continue
        mine(column, row, { x: (column + 0.5) * size, y: (row + 0.5) * size - window.scrollY })
        return
      }
    }
    setMessage('These tiles are cleared. Scroll to find more.')
  }

  return (
    <div className="portfolio-miner">
      <div
        className="portfolio-miner__surface"
        style={{ backgroundSize: `${tileSize}px ${tileSize}px`, backgroundPosition: `0 ${-view.scrollY}px` }}
        onClick={(event) => mineAt({ x: event.clientX, y: event.clientY })}
        aria-hidden="true"
      />
      {tiles.filter((tile) => tile.column * tileSize < view.width && tile.row * tileSize - view.scrollY < view.height && (tile.row + 1) * tileSize > view.scrollY).map((tile) => (
        <div
          key={`${tile.column}:${tile.row}`}
          className={`portfolio-miner__tile ${tile.hits === 3 ? 'is-broken' : ''}`}
          style={{ left: tile.column * tileSize, top: tile.row * tileSize - view.scrollY, width: tileSize, height: tileSize }}
          aria-hidden="true"
        >
          {tile.hits < 3 && (
            <svg viewBox="0 0 72 72" fill="none" className="portfolio-miner__crack">
              <path d="M0 17 20 25 29 17 36 36 48 43 57 62 72 66M36 36 25 48 18 72" />
              {tile.hits === 2 && <path d="M36 0 40 18 36 36 56 27 72 30M25 48 6 44 0 48M48 43 63 45 72 39" />}
            </svg>
          )}
        </div>
      ))}
      <div className={`portfolio-miner__character ${striking ? 'is-striking' : ''}`} style={{ left: position.x, top: position.y }} aria-hidden="true">
        <img src="/mascot.svg" alt="" draggable={false} />
        <svg className="portfolio-miner__pickaxe" viewBox="0 0 48 48" fill="none">
          <path d="M12 39 32 12" stroke="#9a7255" strokeWidth="5" strokeLinecap="round" />
          <path d="M16 9c11-7 21-1 27 9-11-6-19-6-27-9Z" fill="#b9bec5" stroke="#565d66" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
      {chips.map((chip) => (
        <div key={chip.id} className="portfolio-miner__chips" style={{ left: chip.x, top: chip.y }} aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <i key={index} style={{ '--chip-x': `${Math.cos(index * 1.1) * 52}px`, '--chip-y': `${Math.sin(index * 1.1) * 40 - 25}px`, '--chip-turn': `${index * 65}deg` } as CSSProperties} />
          ))}
        </div>
      ))}
      <div className="portfolio-miner__controls" role="region" aria-label="Portfolio mining controls">
        <div className="portfolio-miner__info">
          <span className="portfolio-miner__label">Mining mode <span>{mined} tiles broken</span></span>
          <p role="status" aria-live="polite">{message}</p>
        </div>
        <div className="portfolio-miner__actions">
          <button type="button" ref={mineButton} onClick={mineVisible}>Mine visible</button>
          <button type="button" ref={exitButton} onClick={onExit}>Restore & exit</button>
        </div>
      </div>
    </div>
  )
}
