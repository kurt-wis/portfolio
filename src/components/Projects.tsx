import { Link } from 'react-router-dom'
import { projects } from '@/data/portfolio'
import ProjectPlaceholder from './ProjectPlaceholder'
import SectionHead from './SectionHead'
import Reveal from './Reveal'

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-wrap">
        <Reveal>
          <SectionHead
            eyebrow="Projects"
            title="Selected work"
            description="A closer look at what I built, the decisions behind it, and what I learned."
          />
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article
                key={project.slug}
                className="group overflow-hidden rounded-[20px] border border-line bg-bg transition-all hover:-translate-y-1 hover:border-line-strong hover:shadow-xl"
              >
                <Link to={`/projects/${project.slug}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden border-b border-line bg-bg-soft">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <ProjectPlaceholder seed={index} />
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-xs tabular-nums text-ink-faint">
                        {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        project.status === 'In progress'
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'border-line text-ink-soft'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-extrabold">{project.title}</h3>
                    {project.tagline && (
                      <p className="mb-3 text-sm font-medium text-ink">{project.tagline}</p>
                    )}
                    <p className="mb-5 text-sm leading-relaxed text-ink-soft">{project.desc}</p>

                    <div className="mb-6 flex flex-wrap gap-2 text-xs text-ink-soft">
                      <span className="rounded-full border border-line px-2.5 py-1">{project.type}</span>
                      <span className="rounded-full border border-line px-2.5 py-1">{project.tech}</span>
                    </div>

                    <span className="text-sm font-semibold text-ink group-hover:underline">
                      Read case study →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
