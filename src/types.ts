export interface Project {
  title: string
  tagline?: string
  type: string
  tech: string
  year: string
  desc: string
  awards?: string[]
  url: string
  repo?: string
  image: string
}

export interface ExperienceEntry {
  period: string
  role: string
  company: string
  description: string
  logo: string
  certificateUrls?: string[]
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