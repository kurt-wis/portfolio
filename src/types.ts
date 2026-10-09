export interface Project {
  slug: string
  title: string
  tagline?: string
  status: 'Completed' | 'In progress' | 'Hackathon prototype'
  type: string
  tech: string
  year: string
  desc: string
  role?: string
  challenge?: string
  solution?: string
  outcome?: string
  highlights?: string[]
  awards?: string[]
  url?: string
  repo?: string
  image?: string
  imageFit?: 'cover' | 'contain'
}

export interface ExperienceEntry {
  period: string
  role: string
  company: string
  description: string
  logo: string
  certificateUrls?: string[]
  link?: { label: string; href: string }
}

export interface StackGroup {
  label: string
  items: string[]
}

export interface ApproachStep {
  number: string
  title: string
  description: string
}

export interface SocialLink {
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'mail'
}
