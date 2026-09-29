import { stack } from '@/data/portfolio'
import SectionHead from './SectionHead'
import Reveal from './Reveal'

const ICONS: Record<string, string> = {
  // Languages
  'JavaScript': '/icons/javascript.svg',
  'TypeScript': '/icons/typescript.svg',
  'Python': '/icons/python.svg',
  'Java': '/icons/openjdk.svg',
  'C#': '/icons/sharp.svg',
  'Lua': '/icons/lua.svg',

  // Frontend
  'React': '/icons/react.svg',
  'Tailwind CSS': '/icons/tailwindcss.svg',
  'HTML5': '/icons/html5.svg',
  'CSS3': '/icons/css.svg',
  'Vite': '/icons/vite.svg',

  // Backend
  'Node.js': '/icons/nodedotjs.svg',
  'Express': '/icons/express.svg',
  'MongoDB': '/icons/mongodb.svg',
  'Firebase': '/icons/firebase.svg',
  'Supabase': '/icons/supabase.svg',

  // Deployment & Tools
  'Vercel': '/icons/vercel.svg',
  'Docker': '/icons/docker.svg',
  'Git': '/icons/git.svg',
  'GitHub': '/icons/github.svg',
  'AWS': '/icons/aws.svg',
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
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 dark:bg-white">
                          <img
                            src={ICONS[item]}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-125"
                          />
                        </div>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink px-1 text-[8px] font-extrabold text-bg"
                        >
                          {item === 'AWS' ? 'AWS' : item.slice(0, 2)}
                        </span>
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
