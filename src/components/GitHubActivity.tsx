import { useEffect, useRef, useState } from 'react'
import { ActivityCalendar, type Activity } from 'react-activity-calendar'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import SectionHead from './SectionHead'
import Reveal from './Reveal'
import { useTheme } from '@/hooks/useTheme'

const THEME = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark:  ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

const WEEKS = 53
const MIN_BLOCK = 10
const GITHUB_USERNAME = 'kurt-wis'

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`

const COLOR_TO_LEVEL: Record<string, number> = {
  '#ebedf0': 0,
  '#9be9a8': 1,
  '#40c463': 2,
  '#30a14e': 3,
  '#216e39': 4,
}

interface DayRaw {
  date: string
  contributionCount: number
  color: string
}

export default function GitHubActivity() {
  const { theme } = useTheme()
  const [data, setData] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blockSize, setBlockSize] = useState(13)
  const [blockMargin, setBlockMargin] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN
    if (!token) {
      setError(true)
      setLoading(false)
      return
    }

    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { username: GITHUB_USERNAME },
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors || !json.data?.user) {
          throw new Error('GraphQL error')
        }

        const weeks =
          json.data.user.contributionsCollection.contributionCalendar.weeks
        const flat: DayRaw[] = weeks.flatMap(
          (w: { contributionDays: DayRaw[] }) => w.contributionDays
        )

        const activities: Activity[] = flat.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: COLOR_TO_LEVEL[d.color.toLowerCase()] ?? 0,
        }))

        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        const filtered = activities.filter(
          (d) => new Date(d.date) >= oneYearAgo
        )

        setData(filtered)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const width = el.clientWidth
      const margin = width < 480 ? 2 : width < 768 ? 3 : 4
      const idealSize = Math.floor(width / WEEKS) - margin
      setBlockMargin(margin)
      setBlockSize(Math.max(MIN_BLOCK, idealSize))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [loading])

  return (
    <section id="github" className="px-6 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-wrap">
        <Reveal>
          <SectionHead
            eyebrow="GitHub"
            title="Commit activity"
            description="A live look at what I've been building — updated automatically."
          />
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-line bg-bg-soft p-6 sm:p-8">
            {loading ? (
              <div className="h-[160px] w-full animate-pulse rounded-lg bg-bg-soft-2" />
            ) : error ? (
              <p className="text-center text-sm text-ink-soft py-10">
                Couldn't load GitHub activity right now.
              </p>
            ) : (
              <div
                ref={containerRef}
                className="w-full overflow-x-auto sm:overflow-x-visible"
              >
                <div className="min-w-fit">
                  <ActivityCalendar
                    data={data}
                    theme={THEME}
                    colorScheme={theme === 'dark' ? 'dark' : 'light'}
                    blockSize={blockSize}
                    blockMargin={blockMargin}
                    fontSize={12}
                    showColorLegend
                    showWeekdayLabels={false}
                    maxLevel={4}
                    labels={{
                      totalCount: '{{count}} contributions in the last year',
                    }}
                    renderBlock={(block, activity) => {
                      const formatted = new Date(
                        activity.date
                      ).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      })
                      return (
                        <g
                          data-tooltip-id="gh-tooltip"
                          data-tooltip-content={`${activity.count} contribution${
                            activity.count === 1 ? '' : 's'
                          } on ${formatted}`}
                        >
                          {block}
                        </g>
                      )
                    }}
                  />
                </div>
              </div>
            )}
            <Tooltip id="gh-tooltip" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}