import { stack } from '@/data/portfolio'
import SectionHead from './SectionHead'
import Reveal from './Reveal'

const ICONS: Record<string, string> = {
  // Languages
  'JavaScript': 'JS', 'TypeScript': 'TS', 'Python': 'Py', 'Java': 'Jv', 'C#': 'C#', 'Lua': 'Lu',

  // Frontend
  'React': 'Rx', 'Tailwind CSS': 'Tw', 'HTML5': 'H5', 'CSS3': 'C3', 'Vite': 'Vi',

  // Backend
  'Node.js': 'Nd', 'Express': 'Ex', 'MongoDB': 'Mo', 'Firebase': 'Fb', 'Supabase': 'Sb',

  // Deployment & Tools
  'Vercel': 'Ve', 'Docker': 'Do', 'AWS': 'AWS', 'Git': 'Gt', 'GitHub': 'GH',
}

export default function Stack() {
  return (
    <section id="stack" className="px-6 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-wrap">
        <Reveal>
          <SectionHead
            eyebrow="Stack"
            title="Tools I reach for"
            description="Not exhaustive — just what shows up in most projects."
          />
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-11">
            {stack.map((group) => (
              <div key={group.label}>
                <h5 className="mb-5 text-[13px] uppercase tracking-widest text-ink-soft">
                  {group.label}
                </h5>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="group flex items-center gap-2.5 rounded-full border border-line bg-bg px-3.5 py-2 text-[13.5px] transition-all hover:-translate-y-0.5 hover:border-ink hover:bg-bg-soft hover:shadow-md"
                    >
                     {ICONS[item] ? (
                        <span
                          aria-hidden="true"
                          className="flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-extrabold tracking-tight text-bg transition-transform duration-300 group-hover:scale-110"
                        >
                          {ICONS[item]}
                        </span>
                      ) : (
                        <span className="h-4 w-4 flex-shrink-0 rounded border border-line-strong bg-bg-soft-2" />
                      )}
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
