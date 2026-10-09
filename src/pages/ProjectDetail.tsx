import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BackgroundGrain from '@/components/BackgroundGrain'
import ProjectPlaceholder from '@/components/ProjectPlaceholder'
import { projects } from '@/data/portfolio'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  useEffect(() => {
    if (!project) return
    document.title = `${project.title} | Kurt Luis Grape`
    window.scrollTo(0, 0)
  }, [project])

  if (!project) return <Navigate to="/404" replace />

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <BackgroundGrain />

      <header className="relative z-10 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-wrap items-center justify-between px-6 py-5 sm:px-12">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            WIS<span className="text-ink-faint">.</span>
          </Link>
          <Link to="/#projects" className="text-sm font-semibold text-ink-soft transition-colors hover:text-ink">
            ← All projects
          </Link>
        </div>
      </header>

      <main className="relative z-[1] px-6 py-14 sm:px-12 sm:py-20">
        <article className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-ink-soft">
            <span>{project.type}</span>
            <span aria-hidden>•</span>
            <span>{project.year}</span>
            <span
              className={`rounded-full border px-3 py-1 font-semibold ${
                project.status === 'In progress'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-line text-ink-soft'
              }`}
            >
              {project.status}
            </span>
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="mt-5 max-w-2xl font-serif text-2xl leading-snug text-ink-soft sm:text-3xl">
              {project.tagline}
            </p>
          )}

          <div className="mt-10 aspect-[16/9] overflow-hidden rounded-[24px] border border-line bg-bg-soft">
            {project.image ? (
              <img src={project.image} alt={`${project.title} ${project.imageFit === 'contain' ? 'logo' : 'preview'}`} className={`h-full w-full ${project.imageFit === 'contain' ? 'object-contain p-8 sm:p-12' : 'object-cover'}`} />
            ) : (
              <ProjectPlaceholder seed={projects.indexOf(project)} className="h-full w-full" />
            )}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
            <aside className="space-y-6 text-sm">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-ink-faint">My role</p>
                <p className="font-semibold">{project.role ?? 'Developer'}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-ink-faint">Technology</p>
                <p className="leading-relaxed text-ink-soft">{project.tech}</p>
              </div>
              <div className="flex flex-col items-start gap-3 pt-2">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                    Visit live site ↗
                  </a>
                )}
                {project.repo && (
                  <a href={project.repo} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                    View source ↗
                  </a>
                )}
              </div>
            </aside>

            <div className="space-y-10">
              <CaseStudySection title="Overview" content={project.desc} />
              {project.challenge && <CaseStudySection title="The challenge" content={project.challenge} />}
              {project.solution && <CaseStudySection title={project.slug === 'study-bunny' ? 'What we built' : 'What I built'} content={project.solution} />}

              {project.highlights && project.highlights.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-extrabold">Highlights</h2>
                  <ul className="space-y-3 text-base leading-relaxed text-ink-soft">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span className="text-ink" aria-hidden>—</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.outcome && <CaseStudySection title="Outcome" content={project.outcome} />}

              {project.awards && project.awards.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-extrabold">Recognition</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.awards.map((award) => (
                      <span key={award} className="rounded-full border border-line-strong px-4 py-2 text-sm">
                        {award}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

function CaseStudySection({ title, content }: { title: string; content: string }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-extrabold">{title}</h2>
      <p className="max-w-3xl text-base leading-8 text-ink-soft">{content}</p>
    </section>
  )
}
