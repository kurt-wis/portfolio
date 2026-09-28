import { profile, socials, projects } from '@/data/portfolio'
import { GithubIcon, LinkedinIcon, MailIcon, DownloadIcon } from './icons'
import FeaturedProject from './FeaturedProject'
import { useState } from 'react'

const SOCIAL_ICONS = { github: GithubIcon, linkedin: LinkedinIcon, mail: MailIcon }

export default function Hero() {
  const [isHovering, setIsHovering] = useState(false)
  const [hasHovered, setHasHovered] = useState(false)

  return (
    <section id ="hero" className="relative z-[1] pb-10 pt-16 sm:pt-20">
      <div className="mx-auto grid max-w-wrap grid-cols-1 gap-12 px-6 sm:px-12 lg:grid-cols-[1fr_460px] lg:gap-16">
        <div>
          <div className="mb-9 inline-flex items-center gap-2 text-[13px] uppercase tracking-wider text-ink-soft">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_0_3px_rgba(63,174,85,0.25)]" />
            {profile.available ? 'Available for work' : 'Not currently available'}
          </div>

          <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div
                className={`profile-glitch-wrapper h-[220px] w-[220px] flex-shrink-0 border-2 border-line-strong shadow-lg ${
                  isHovering ? 'is-hovering' : ''
                } ${hasHovered && !isHovering ? 'is-unhovering' : ''}`}
                onMouseEnter={() => {
                  setIsHovering(true)
                  setHasHovered(true)
                }}
                onMouseLeave={() => setIsHovering(false)}
              >
              
               <img 
                  src={profile.avatarSrc} 
                  alt={profile.name} 
                  className="profile-glitch-base" 
                />
              
              <img 
                src="/profile.png" 
                alt={`${profile.name} glitch`} 
                className="profile-glitch-alt" 
              />
            </div>

            <div>
              <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{profile.name}</h1>
              <div className="flex gap-3">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.icon]
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-line transition-all hover:-translate-y-1 hover:bg-ink hover:text-bg"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <h2 className="mb-6 font-serif text-[clamp(40px,6vw,68px)] font-medium leading-[1.02] tracking-tight">
            {profile.role.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="mb-9 max-w-[52ch] text-base leading-relaxed text-ink-soft">{profile.bio}</p>

          <div className="mb-12 flex flex-wrap gap-3.5">
            <a
              href={profile.cvHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-[15px] text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              View résumé
              <span aria-hidden>↗</span>
            </a>
            <a
              href={profile.cvHref}
              download
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-[15px] text-sm font-semibold transition-colors hover:border-ink hover:bg-bg-soft"
            >
              <DownloadIcon className="h-[15px] w-[15px]" />
              Download PDF
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-2 py-[15px] text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              View projects ↓
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-6 sm:gap-x-0">
            {profile.stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && <div className="mx-7 hidden h-[34px] w-px bg-line-strong sm:block" />}
                <div>
                  <b className="block text-[26px] font-extrabold">{stat.value}</b>
                  <span className="text-xs uppercase tracking-wider text-ink-soft">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <FeaturedProject projects={projects} />
        </div>
      </div>
    </section>
  )
}
