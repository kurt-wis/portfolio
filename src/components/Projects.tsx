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
            description={`${projects.length} ${projects.length === 1 ? 'project' : 'projects'} across web apps, tools, and client sites.`}
          />
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <a
                key={project.title}
                href={project.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-[20px] border border-line bg-bg transition-all hover:-translate-y-1 hover:border-line-strong hover:shadow-xl"
              >
                <div className="aspect-[4/3] border-b border-line bg-bg-soft">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                  ) : (
                    <ProjectPlaceholder seed={i} />
                  )}
                </div>
                <div className="p-6">
                  <span className="mb-2.5 block text-xs tabular-nums text-ink-faint">
                    {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </span>
                  <h4 className="mb-2 text-lg font-bold">{project.title}</h4>
                  <p className="mb-4 text-[13.5px] leading-relaxed text-ink-soft">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-ink-soft">
                    <span className="rounded-full border border-line px-2.5 py-1">{project.type}</span>
                    <span className="rounded-full border border-line px-2.5 py-1">{project.tech}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
