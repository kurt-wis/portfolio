import type {
  Project,
  ExperienceEntry,
  StackGroup,
  ApproachStep,
  SocialLink,
} from '@/types'

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/kurt-wis/', icon: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/grape-kurtluis',
    icon: 'linkedin',
  },
  {
    label: 'Email',
    href: 'mailto:grape.kurtluis.pecson@gmail.com',
    icon: 'mail',
  },
]

export const projects: Project[] = [
  {
    title: 'eTickette Platform',
    tagline: 'Event ticketing, built end to end.',
    type: 'Web App',
    tech: 'HTML, CSS, JavaScript, Firebase',
    year: '2026',
    desc: 'Full-stack ticketing platform that handles event listings, seat selection, and secure checkout. I led architecture and deployment across the entire stack.',
    awards: [
      'Best Application',
      'Best Capstone Project',
      '2nd Best Tech Innovation',
      "People's Choice Award",
    ],
    url: 'https://etickette.web.app/',
    repo: 'https://github.com/kurt-wis/etickette',
    image: '/etickette.png',
  },
]

export const profile = {
  name: 'Kurt Luis Grape',
  initials: 'KG',
  role: ['Fullstack', 'Student'],
  avatarSrc: '/headshot.jpg',
  bio: "I'm a full-stack student developer studying computer science. Most of what I know comes from building things — web apps, mobile apps, and whatever a hackathon weekend throws at me.\n\nRight now I'm exploring game dev and data analytics, mostly because I want to make something people lose track of time in — or find patterns in messy things. I don't have a clean one-line answer for what I am yet. I just like building.",
  available: true,
  email: 'grape.kurtluis.pecson@gmail.com',
  cvHref: '/resume.pdf',
  stats: [
    { value: '3+', label: 'Awards' },
    { value: '01', label: 'Major Project' },
    { value: '15+', label: 'Technologies' },
  ],
}

export const experience: ExperienceEntry[] = [
  {
    period: '2025 — 2026',
    role: 'Competitive Programmer & Lead Developer',
    company: 'Tagisan ng Talino Codefest',
    description:
      'Secured 2nd Runner-Up (2026) and 1st Runner-Up (2025). Engineered functional software solutions using Java and Android Studio to solve complex algorithmic problem sets under strict time constraints.',
    logo: '🏆', 
    certificateUrls: [
      '/cert-codefest-1st.png',
      '/cert-codefest-2nd.png',
    ],
  },
  {
    period: '2026',
    role: 'Lead Full-Stack Developer & Technical Presenter',
    company: 'STI College Fairview Expo',
    description:
      'Awarded Best Programmer and 3rd Best Presenter. Managed project architecture, live code demonstrations, and booth coordination for panel evaluation.',
    logo: '🎤', 
    certificateUrls: [
      '/cert-programmer.png',
      '/cert-app-1st.png',
      '/cert-capstone-1st.png',
      '/cert-tech-2nd.png',
      '/cert-presenter-3rd.png',
      '/cert-booth-1st.png',
    ],
  },
  {
    period: '2026 — Present',
    role: 'Bachelor of Science in Computer Science',
    company: 'Quezon City University',
    description:
      'Expected graduation 2030. Focused on data structures, algorithms, and object-oriented programming.',
    logo: '/qcu-logo.png',
  },
  {
    period: '2024 — 2026',
    role: 'Information and Communications Technology',
    company: 'STI College Fairview',
    description:
      'Built foundational projects in web and software development, leading to multiple national competition wins.',
    logo: '/sti-logo.png',
  },
]

export const stack: StackGroup[] = [
  {
    label: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Lua'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Tailwind CSS', 'HTML5', 'CSS3', 'Vite', 'Framer Motion'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express', 'MongoDB', 'Firebase', 'Supabase'],
  },
  {
    label: 'Deployment & Tools',
    items: ['Vercel', 'Docker', 'AWS', 'Git', 'GitHub'],
  },
]

export const marqueeWords: string[] = [
  'TypeScript',
  'React',
  'Node.js',
  'Firebase',
  'Tailwind CSS',
  'JavaScript',
  'Python',
  'Java',
  'C#',
  'Lua',
  'Git',
  'GitHub',
  'Vercel',
  'HTML5',
]

export const approach: ApproachStep[] = [
  {
    number: '01',
    title: 'Understand first',
    description:
      'Every build starts with the problem, not the stack — talking through goals and constraints before touching code.',
  },
  {
    number: '02',
    title: 'Build in the open',
    description:
      "Regular check-ins and working versions early, so direction can shift before it's expensive to change.",
  },
  {
    number: '03',
    title: 'Ship and support',
    description:
      'Launch is the start, not the finish — I stay close for fixes, tuning, and the next iteration.',
  },
]

export const navItems = [
  { label: 'Experience', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'GitHub', href: '#github' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]