export type CaseStudyScreenshot = {
  src: string
  alt: string
  caption: string
  width: number
  height: number
}

export type CaseStudy = {
  slug: string
  title: string
  summary: string
  repository: string
  problem: string
  approach: string
  stack: string[]
  outcome: string
  screenshots: CaseStudyScreenshot[]
}

// Based on public repository READMEs as of 28 Oct 2026; no performance outcomes are claimed.
export const caseStudies: CaseStudy[] = [
  {
    slug: 'TIF-IDE-rework',
    title: 'TIF-IDE',
    summary:
      'A collaborative web IDE with shared coding rooms and a browser-based terminal.',
    repository: 'https://github.com/afadhili/TIF-IDE-rework',
    problem:
      'Make it possible for multiple people to work on the same coding project in real time, with a shared terminal.',
    approach:
      'The public README describes an Express and Socket.IO backend, SQLite with Drizzle, Monaco editing, and terminals in Docker containers.',
    stack: [
      'TypeScript',
      'Express',
      'Socket.IO',
      'Docker',
      'SQLite',
      'Drizzle',
    ],
    outcome:
      'The repository documents room-based collaboration, code execution, file management, and authentication. No measured usage results are published here.',
    screenshots: [], // TODO: Add verified screenshots with alt text and dimensions.
  },
  {
    slug: 'ytmusic-cli',
    title: 'YT Music CLI',
    summary:
      'A terminal YouTube Music player with playlists, lyrics, and mpv playback.',
    repository: 'https://github.com/afadhili/ytmusic-cli',
    problem:
      'Bring music search, playback, queue management, and playlists into the terminal.',
    approach:
      'The README describes an Ink interface with mpv playback, yt-dlp caching, SQLite/Drizzle storage, lyrics, and ASCII cover previews.',
    stack: ['TypeScript', 'Ink', 'mpv', 'yt-dlp', 'SQLite', 'Drizzle'],
    outcome:
      'The README documents an installable npm CLI and the features above. No measured usage results are published here.',
    screenshots: [
      {
        src: 'https://raw.githubusercontent.com/afadhili/ytmusic-cli/main/screenshots/home-page.png',
        alt: 'YT Music CLI home screen in a terminal',
        caption: 'Home screen',
        width: 1920,
        height: 1080,
      },
      {
        src: 'https://raw.githubusercontent.com/afadhili/ytmusic-cli/main/screenshots/search.png',
        alt: 'YT Music CLI search screen in a terminal',
        caption: 'Search screen',
        width: 1920,
        height: 1080,
      },
      {
        src: 'https://raw.githubusercontent.com/afadhili/ytmusic-cli/main/screenshots/playlist-page.png',
        alt: 'YT Music CLI playlist screen in a terminal',
        caption: 'Playlists screen',
        width: 1920,
        height: 1080,
      },
    ],
  },
]
