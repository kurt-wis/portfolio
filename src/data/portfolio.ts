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
    slug: 'study-bunny',
    title: 'Study Bunny',
    tagline: 'Turn your notes into a study plan, even offline.',
    status: 'Hackathon prototype',
    type: 'Study Companion PWA',
    tech: 'React, Vite, Tailwind CSS, Dexie, PDF.js',
    year: '2026',
    desc: 'An offline-first study companion that turns PDF notes and PowerPoint slides into summaries, quizzes, and flashcard reviews. Students can practice explaining topics, track their progress, and use optional cloud AI for richer feedback.',
    role: 'Hackathon Team Member',
    challenge:
      'Students need more than another place to store their notes. Study Bunny brings practice, revision, and progress tracking into one workspace, with a local study flow that remains usable when an internet connection is unavailable.',
    solution:
      'Our team built a React progressive web app with local document processing and IndexedDB storage. It pairs quizzes with topic-mastery estimates, schedules flashcard reviews using spaced repetition, and supports Pomodoro sessions and Feynman explain-it-back practice. Optional AI runs through server-side endpoints; summaries, quizzes, and note retrieval fall back to local algorithms when cloud requests fail. We used Quick for ideation and Kiro for development.',
    outcome:
      'Our team earned 1st Runner-Up in the Educational Crisis Track. The overnight hackathon took place at the AWS Office in Bonifacio Global City, Taguig, and Study Bunny is available as a live web app.',
    highlights: [
      'PDF and PowerPoint text extraction on the device',
      'Structured summaries and quizzes focused on weaker topics',
      'Spaced-repetition flashcards with SM-2 review scheduling',
      'Pomodoro timer and Feynman explanation practice',
      'Topic-mastery estimates and learning-curve dashboards',
      'Ask My Notes with source-based answers and offline passage retrieval',
      'Reference-based notes checking with redaction previews',
      'Installable PWA with local storage and optional cloud AI',
    ],
    awards: ['1st Runner-Up — Educational Crisis Track'],
    url: 'https://study-bunny-iota.vercel.app/student',
    image: '/study-bunny-logo.png',
    imageFit: 'contain',
  },
  {
    slug: 'etickette-platform',
    title: 'eTickette Platform',
    tagline: 'Making campus queues easier to track and manage.',
    status: 'Completed',
    type: 'Hybrid Queue System',
    tech: 'HTML, CSS, JavaScript, Firebase',
    year: '2026',

    desc: 'A queue management system for the Registrar and Cashier departments of STI College Fairview. Students can check requirements before visiting, activate a ticket at the lobby kiosk, and follow the queue from their phone.',

    role: 'Lead Full-Stack Developer',

    challenge:
      'During busy periods, students waited 20 to 30 minutes in crowded lobbies. Some reached the counter with incomplete requirements, while staff had no reliable way to show queue progress or control daily capacity.',

    solution:
      'I led the full-stack implementation. Students review their requirements online, but their ticket becomes active only when they arrive at the kiosk. Firebase handles live updates, while ticket limits and first-come-first-served ordering keep the queue fair.',

    outcome:
      'We evaluated the system with 197 senior high school students and selected staff. Its scores ranged from about 3.54 to 3.57 out of 4 across the areas we measured, consistently scoring higher than the manual process. It also received four awards at our school expo.',

    highlights: [
      'Real-time queue position and status monitoring',
      'Online document-requirement pre-verification',
      'Physical kiosk and QR-based ticket activation',
      'Dynamic daily capacity and ticket limits',
      'Fair first-come-first-served queue sequencing',
      'Mobile-responsive student and staff interfaces',
    ],

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
  {
    slug: 'tappi',
    title: 'Tappi',
    tagline: 'RFID attendance for student organizations.',
    status: 'In progress',
    type: 'Web App',
    tech: 'Next.js, TypeScript, Supabase, Tailwind CSS',
    year: '2026',
    desc: 'An event attendance platform that lets student organizations register members, manage events, and record attendance by tapping an existing school ID on a USB RFID reader.',
    role: 'Full-Stack Developer',
    challenge:
      'Paper sign-in sheets create long lines, make attendance easy to fake, and leave officers with hours of manual tallying. They also make it difficult to track late arrivals, walk-ins, absentees, and certificate eligibility.',
    solution:
      'Tappi links each school ID to a member once. At an event, the USB reader sends the card UID to the web app, which checks the event list and time, then records the student as present, late, or a walk-in. Duplicate scans are blocked, offline scans can sync later, and closing an event automatically marks absentees and awards attendance credit.',
    outcome:
      'The foundation, authentication, member and card management, event management, scanning workflow, offline batch handling, and event finalization are complete. Reporting and exports are the next milestone.',
    highlights: [
      'One-time school ID and RFID card linking',
      'Present, late, walk-in, and absent attendance states',
      'Duplicate-scan protection and offline batch syncing',
      'Event master lists, capacity, and grace-period controls',
      'Automatic event finalization, Credits, and Tappies',
      'Multi-organization roles and audit logging',
    ],
    image: '/tappi-banner.png',
  },
]

export const profile = {
  name: 'Kurt Luis Grape',
  initials: 'KG',
  role: ['Fullstack', 'Student'],
  avatarSrc: '/headshot.jpg',
  bio: "I'm a computer science student and full-stack developer who learns by building. I create practical web apps, experiment with new ideas, and enjoy turning messy problems into software people can actually use.",
  available: true,
  email: 'grape.kurtluis.pecson@gmail.com',
  cvHref: '/resume.pdf',
  stats: [
    { value: '5', label: 'Project Awards' },
    { value: String(projects.length).padStart(2, '0'), label: 'Projects' },
    { value: '15+', label: 'Technologies' },
  ],
}

export const experience: ExperienceEntry[] = [
  {
    period: 'October 3–4, 2026',
    role: '1st Runner-Up — Educational Crisis Track',
    company: 'Build Over Nights: Kiro x Quick Hackathon',
    description:
      'Our team built Study Bunny, a web app, during an overnight hackathon at the AWS Office in Bonifacio Global City. We used Quick for ideation and Kiro for development, earning 1st Runner-Up in the Educational Crisis Track.',
    logo: '',
    certificateUrls: ['/cert-build-over-nights.png'],
    link: {
      label: 'Explore Study Bunny',
      href: 'https://study-bunny-iota.vercel.app/student',
    },
  },
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
    items: ['React', 'Tailwind CSS', 'HTML5', 'CSS3', 'Vite'],
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
