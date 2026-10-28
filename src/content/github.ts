// Fallback for when the public GitHub API or the visitor's connection is unavailable.
// Public GitHub snapshot collected 2026-10-28. These are not live counts.
// Sources: https://api.github.com/users/afadhili,
// https://api.github.com/users/afadhili/repos?per_page=100 and repository READMEs.
export type GithubProfile = {
  name: string
  username: string
  url: string
  avatarUrl: string
  location: string
  publicRepos: number
  followers: number
  following: number
  snapshotDate: string
}

export const githubProfile: GithubProfile = {
  name: 'Ahmad Isnainil Fadhili',
  username: 'afadhili',
  url: 'https://github.com/afadhili',
  avatarUrl: 'https://avatars.githubusercontent.com/u/123520196?v=4',
  location: 'Gresik, Indonesia',
  publicRepos: 10,
  followers: 4,
  following: 4,
  snapshotDate: '28 Oct 2026',
}

export type GithubRepository = {
  name: string
  url: string
  demo?: string
  description: string
  category: string
  language: string | null
  stars: number
  tags: string[]
  visual: 'ide' | 'music' | 'rust' | 'chat' | 'utility' | 'chart'
  featured: boolean
}

// Every public repository on this profile at snapshot time. Descriptions without
// GitHub API text were summarized from public READMEs or labeled conservatively.
export const githubRepositories: GithubRepository[] = [
  {
    name: 'TIF-IDE-rework',
    url: 'https://github.com/afadhili/TIF-IDE-rework',
    description:
      'A collaborative web IDE with real-time rooms and a Docker-powered terminal.',
    category: 'FULL-STACK / IDE',
    language: 'TypeScript',
    stars: 2,
    tags: ['TypeScript', 'Express', 'Socket.IO', 'Docker'],
    visual: 'ide',
    featured: true,
  },
  {
    name: 'ytmusic-cli',
    url: 'https://github.com/afadhili/ytmusic-cli',
    description:
      'A terminal YouTube Music player with playlists, lyrics, and mpv playback.',
    category: 'CLI / TUI',
    language: 'TypeScript',
    stars: 1,
    tags: ['TypeScript', 'Ink', 'mpv', 'Drizzle'],
    visual: 'music',
    featured: true,
  },
  {
    name: 'rust-ytmusic-api',
    url: 'https://github.com/afadhili/rust-ytmusic-api',
    description:
      'A Rust client for YouTube Music search, metadata, lyrics, and playlists.',
    category: 'OPEN SOURCE / RUST',
    language: 'Rust',
    stars: 4,
    tags: ['Rust', 'API', 'Async'],
    visual: 'rust',
    featured: false,
  },
  {
    name: 'cutlink',
    url: 'https://github.com/afadhili/cutlink',
    description:
      'Short links, click counts, QR codes, and expiring text shares.',
    category: 'FULL-STACK / TOOLS',
    language: 'TypeScript',
    stars: 0,
    tags: ['TypeScript', 'Bun', 'PostgreSQL'],
    visual: 'utility',
    featured: false,
  },
  {
    name: 'whatsapp-ui',
    url: 'https://github.com/afadhili/whatsapp-ui',
    description:
      'A WhatsApp-inspired interface built with TypeScript and React.',
    category: 'FRONTEND',
    language: 'TypeScript',
    stars: 0,
    tags: ['TypeScript', 'React', 'UI'],
    visual: 'chat',
    featured: false,
  },
  {
    name: 'TIF-IDE-client-rework',
    url: 'https://github.com/afadhili/TIF-IDE-client-rework',
    demo: 'https://tif-ide.vercel.app',
    description:
      'The React client for TIF-IDE, with Monaco and a web terminal.',
    category: 'FRONTEND / IDE',
    language: 'TypeScript',
    stars: 1,
    tags: ['React', 'Vite', 'Monaco', 'xterm.js'],
    visual: 'ide',
    featured: false,
  },
  {
    name: 'rust-ytmusic-cli',
    url: 'https://github.com/afadhili/rust-ytmusic-cli',
    description: 'A Rust terminal music player using Ratatui and mpv.',
    category: 'CLI / RUST',
    language: 'Rust',
    stars: 1,
    tags: ['Rust', 'Ratatui', 'mpv'],
    visual: 'music',
    featured: false,
  },
  {
    name: 'statistik-karakteristik-visual',
    url: 'https://github.com/afadhili/statistik-karakteristik-visual',
    demo: 'https://statistik-karakteristik-visual.vercel.app',
    description:
      'A visual dataset dashboard with histograms, brightness, and comparisons.',
    category: 'WEB / VISUALIZATION',
    language: 'JavaScript',
    stars: 0,
    tags: ['JavaScript', 'React'],
    visual: 'chart',
    featured: false,
  },
  {
    name: 'i3wm-dotconfig',
    url: 'https://github.com/afadhili/i3wm-dotconfig',
    description: 'A personal i3wm configuration and desktop setup.',
    category: 'LINUX / CONFIG',
    language: 'Python',
    stars: 0,
    tags: ['i3wm', 'Linux', 'Python'],
    visual: 'utility',
    featured: false,
  },
  {
    name: 'numeric-derivative-app',
    url: 'https://github.com/afadhili/numeric-derivative-app',
    description: 'An Android app for calculating numerical derivatives.',
    category: 'ANDROID / MATH',
    language: null,
    stars: 1,
    tags: ['Android', 'Numerical methods'],
    visual: 'chart',
    featured: false,
  },
]

export type PublicGithubEvent = {
  date: string
  label: string
  repository: string
  url: string
}

// Recent public events only; not a contribution graph or complete history.
export const recentPublicEvents: PublicGithubEvent[] = [
  {
    date: '26 Oct',
    label: 'Created main branch',
    repository: 'statistik-karakteristik-visual',
    url: 'https://github.com/afadhili/statistik-karakteristik-visual',
  },
  {
    date: '24 Oct',
    label: 'Added as collaborator',
    repository: 'Big-Project-PBP-WhatsApp',
    url: 'https://github.com/dimas-makhzum-mufrih/Big-Project-PBP-WhatsApp',
  },
  {
    date: '23 Oct',
    label: 'Created main branch',
    repository: 'whatsapp-ui',
    url: 'https://github.com/afadhili/whatsapp-ui',
  },
  {
    date: '19 Oct',
    label: 'Created main branch',
    repository: 'cutlink',
    url: 'https://github.com/afadhili/cutlink',
  },
  {
    date: '14 Oct',
    label: 'Starred repository',
    repository: 'rust-ytmusic-api',
    url: 'https://github.com/afadhili/rust-ytmusic-api',
  },
]
