import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '@/types'
import ProjectPlaceholder from './ProjectPlaceholder'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface FeaturedProjectProps {
  projects: Project[]
}

const AUTOPLAY_MS = 6000

export default function FeaturedProject({ projects }: FeaturedProjectProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = projects.length
  const current = projects[index]
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = (next: number) => setIndex(((next % total) + total) % total)

  useEffect(() => {
    if (paused || total < 2) return
    timerRef.current = setInterval(() => go((index + 1) % total), AUTOPLAY_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [index, paused, total])

  return (
    <div className="flex items-start gap-5">
      <div
        className="flex-1 rounded-[20px] border border-line bg-bg p-6 shadow-sm transition-colors"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1.5 text-xs uppercase tracking-widest text-ink-soft">Featured</div>
            <Link to={`/projects/${current.slug}`}>
              <h3 className="text-xl font-extrabold hover:underline">{current.title}</h3>
            </Link>
          </div>
          <div className="text-sm tabular-nums text-ink-faint">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>

        <Link
          to={`/projects/${current.slug}`}
          className="relative mb-4 block aspect-[16/10.5] overflow-hidden rounded-xl border border-line bg-bg-soft"
        >
          {current.image ? (
            <img src={current.image} alt={current.title} className={`h-full w-full ${current.imageFit === 'contain' ? 'object-contain p-8' : 'object-cover'}`} />
          ) : (
            <ProjectPlaceholder seed={index} />
          )}
        </Link>

        <div className="flex items-center justify-between border-t border-line pt-4 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <span>{current.type}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-ink-faint" />
            <span>{current.tech}</span>
          </div>
          <span>{current.status === 'In progress' ? 'In progress' : current.year}</span>
        </div>

        {total > 1 && <div className="mt-4 flex gap-2.5">
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-ink hover:bg-ink hover:text-bg"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-ink hover:bg-ink hover:text-bg"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>}
      </div>

      {total > 1 && <div className="hidden w-6 flex-shrink-0 flex-col items-center pt-1.5 sm:flex">
        <div className="my-1.5 w-px flex-1 bg-line-strong" />
        {projects.map((p, i) => (
          <button
            key={p.title}
            onClick={() => go(i)}
            aria-label={`Show ${p.title}`}
            className={`py-1 text-sm tabular-nums transition-colors ${
              i === index ? 'font-extrabold text-ink' : 'text-ink-faint hover:text-ink-soft'
            }`}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
        <div className="my-1.5 w-px flex-1 bg-line-strong" />
      </div>}
    </div>
  )
}
