import { useEffect } from 'react'
import { Command } from 'cmdk'
import { navItems, socials, profile } from '@/data/portfolio'
import { useTheme } from '@/hooks/useTheme'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ICONS = {
  github: '↗',
  linkedin: '↗',
  mail: '✉',
  navigate: '→',
  theme: '◐',
  download: '↓',
  copy: '⧉',
} as const

export default function CommandPalette({
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const { toggleTheme } = useTheme()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  if (!open) return null

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (!el) return

    const header = document.querySelector('header')
    const headerHeight =
      header instanceof HTMLElement ? header.offsetHeight : 80

    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: Math.max(0, top - headerHeight - 16), behavior: 'smooth' })
    onOpenChange(false)
  }

  const openLink = (href: string) => {
    if (href.startsWith('mailto:')) {
      window.location.href = href
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
    onOpenChange(false)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      // ignore
    }
    onOpenChange(false)
  }

  const downloadResume = () => {
    window.open(profile.cvHref, '_blank', 'noopener,noreferrer')
    onOpenChange(false)
  }

  const handleThemeToggle = () => {
    toggleTheme()
    onOpenChange(false)
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <Command label="Command Menu" loop>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <span className="text-ink-faint" aria-hidden>
              ⌕
            </span>
            <Command.Input
              autoFocus
              placeholder="Search or jump to..."
              className="h-14 w-full bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none"
            />
            <kbd className="hidden rounded border border-line px-2 py-0.5 text-[10px] font-medium text-ink-faint sm:inline-block">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-ink-faint">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Navigate"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-faint"
            >
              {navItems.map((item) => (
                <Command.Item
                  key={item.href}
                  onSelect={() => scrollToSection(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft data-[selected=true]:bg-bg-soft-2 data-[selected=true]:text-ink"
                >
                  <span className="text-ink-faint" aria-hidden>
                    {ICONS.navigate}
                  </span>
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Connect"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-faint"
            >
              {socials.map((social) => (
                <Command.Item
                  key={social.href}
                  onSelect={() => openLink(social.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft data-[selected=true]:bg-bg-soft-2 data-[selected=true]:text-ink"
                >
                  <span className="text-ink-faint" aria-hidden>
                    {ICONS[social.icon]}
                  </span>
                  {social.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Actions"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-faint"
            >
              <Command.Item
                onSelect={handleThemeToggle}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft data-[selected=true]:bg-bg-soft-2 data-[selected=true]:text-ink"
              >
                <span className="text-ink-faint" aria-hidden>
                  {ICONS.theme}
                </span>
                Toggle Theme
              </Command.Item>
              <Command.Item
                onSelect={downloadResume}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft data-[selected=true]:bg-bg-soft-2 data-[selected=true]:text-ink"
              >
                <span className="text-ink-faint" aria-hidden>
                  {ICONS.download}
                </span>
                Download Resume
              </Command.Item>
              <Command.Item
                onSelect={copyEmail}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft data-[selected=true]:bg-bg-soft-2 data-[selected=true]:text-ink"
              >
                <span className="text-ink-faint" aria-hidden>
                  {ICONS.copy}
                </span>
                Copy Email
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
