import { useState } from 'react'
import { experience } from '@/data/portfolio'
import SectionHead from './SectionHead'
import Reveal from './Reveal'

function CertificateStack({ urls, onExpand }: { urls: string[], onExpand: (urls: string[], index: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % urls.length)
  }

  return (
    <div
      className="relative mx-auto flex h-[200px] w-full max-w-full cursor-pointer items-center justify-center sm:h-[260px] sm:max-w-[380px]"
      onClick={handleNext}
    >
      {urls.map((url, i) => {
        const position = (i - activeIndex + urls.length) % urls.length

        if (position > 2) return null

        const rotate = position === 0 ? 0 : (position === 1 ? 6 : -6)
        const translateY = position * 16
        const scale = 1 - position * 0.05
        const zIndex = urls.length - position
        const opacity = 1 - position * 0.3

        return (
          <div
            key={url}
            className="absolute inset-0 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            style={{
              transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
              zIndex,
              opacity,
            }}
          >
            <img
              src={url}
              alt="Certificate"
              className="h-full w-full rounded-xl object-cover"
            />
            
            {position === 0 && (
              <>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-black shadow-sm">
                    Click to cycle
                  </span>
                </div>
                
                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:left-4 sm:top-4">
                  {activeIndex + 1} / {urls.length}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onExpand(urls, activeIndex)
                  }}
                  className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white sm:right-4 sm:top-4"
                  aria-label="Expand certificate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Experience() {
  const [selectedCert, setSelectedCert] = useState<{ urls: string[], index: number } | null>(null)

  const handleNextCert = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedCert) return
    setSelectedCert({
      ...selectedCert,
      index: (selectedCert.index + 1) % selectedCert.urls.length
    })
  }

  const handlePrevCert = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedCert) return
    setSelectedCert({
      ...selectedCert,
      index: (selectedCert.index - 1 + selectedCert.urls.length) % selectedCert.urls.length
    })
  }

  const educationEntries = experience.filter(e => !e.certificateUrls || e.certificateUrls.length === 0)
  const achievementEntries = experience.filter(e => e.certificateUrls && e.certificateUrls.length > 0)

  return (
    <section id="experience" className="px-6 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-wrap space-y-24">
        
        {educationEntries.length > 0 && (
          <div>
            <Reveal>
              <SectionHead
                eyebrow="Background"
                title="Education"
                description="My academic foundation and continuous learning journey."
              />
            </Reveal>
            <Reveal>
              <div className="border-t border-line">
                {educationEntries.map((entry) => (
                  <div
                    key={entry.role + entry.period}
                    className="relative grid grid-cols-1 gap-6 overflow-hidden border-b border-line py-10 sm:grid-cols-[160px_1fr] sm:gap-8"
                  >
                    {entry.logo && entry.logo.startsWith('/') && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex w-full items-center justify-end overflow-hidden pr-4 sm:w-[60%] sm:pr-0">
                        <img
                          src={entry.logo}
                          alt=""
                          className="h-[80%] w-auto max-w-none object-contain opacity-30 sm:h-[120%] dark:opacity-20"
                          style={{
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 60%, black 100%)',
                            maskImage: 'linear-gradient(to right, transparent 0%, black 60%, black 100%)',
                          }}
                        />
                      </div>
                    )}

                    <div className="relative z-10 pt-1 text-sm tracking-wide text-ink-soft">
                      {entry.period}
                    </div>
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
                      <div className="flex-1 max-w-[56ch]">
                        <h4 className="mb-2 text-xl font-bold">{entry.role}</h4>
                        <div className="mb-3.5 text-sm text-ink-soft">{entry.company}</div>
                        <p className="text-[14.5px] leading-relaxed text-ink-soft">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        {achievementEntries.length > 0 && (
          <div>
            <Reveal>
              <SectionHead
                eyebrow="Recognition"
                title="Achievements & Awards"
                description="Competition wins, certifications, and notable project milestones."
              />
            </Reveal>
            <Reveal>
              <div className="border-t border-line">
                {achievementEntries.map((entry) => (
                  <div
                    key={entry.role + entry.period}
                    className="relative grid grid-cols-1 gap-6 overflow-hidden border-b border-line py-10 sm:grid-cols-[160px_1fr] sm:gap-8"
                  >
                    <div className="relative z-10 pt-1 text-sm tracking-wide text-ink-soft">
                      {entry.period}
                    </div>
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
                      <div className="flex-1 max-w-[56ch]">
                        <h4 className="mb-2 text-xl font-bold">{entry.role}</h4>
                        <div className="mb-3.5 text-sm text-ink-soft">{entry.company}</div>
                        <p className="text-[14.5px] leading-relaxed text-ink-soft">
                          {entry.description}
                        </p>
                      </div>

                      <div className="flex w-full flex-shrink-0 justify-center sm:w-[400px]">
                        <CertificateStack
                          urls={entry.certificateUrls!}
                          onExpand={(urls, index) => setSelectedCert({ urls, index })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>

      {selectedCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setSelectedCert(null)}
        >
          <button
            onClick={() => setSelectedCert(null)}
            className="absolute right-4 top-4 z-[110] rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none"
            aria-label="Close certificate view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {selectedCert.urls.length > 1 && (
            <button
              onClick={handlePrevCert}
              className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none sm:p-4"
              aria-label="Previous certificate"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}

          <div 
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedCert.urls[selectedCert.index]}
              alt="Certificate Full View"
              className="max-h-[85vh] max-w-[95vw] rounded-xl object-contain shadow-2xl sm:max-w-[85vw]"
            />
          </div>

          {selectedCert.urls.length > 1 && (
            <button
              onClick={handleNextCert}
              className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none sm:p-4"
              aria-label="Next certificate"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            {selectedCert.index + 1} / {selectedCert.urls.length}
          </div>
        </div>
      )}
    </section>
  )
}