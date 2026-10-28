export type PublishedPost = {
  slug: string
  title: string
  summary: string
  readingTime: string
  tags: string[]
  url: string
  category: string
}

export const posts: readonly PublishedPost[] = [
  {
    slug: 'building-a-shared-ide',
    title: 'A coding room in the browser: inside TIF-IDE',
    summary:
      'A look at the pieces behind a shared editor, real-time rooms, and a browser terminal.',
    category: 'FULL-STACK / IDE',
    readingTime: '2 MIN READ',
    tags: ['TypeScript', 'Socket.IO', 'Docker'],
    url: '/articles/building-a-shared-ide',
  },
  {
    slug: 'music-in-the-terminal',
    title: 'Music in the terminal, without leaving the keyboard',
    summary:
      'How YT Music CLI brings search, playlists, lyrics, and playback into a text interface.',
    category: 'CLI / TUI',
    readingTime: '2 MIN READ',
    tags: ['TypeScript', 'Ink', 'mpv'],
    url: '/articles/music-in-the-terminal',
  },
  {
    slug: 'small-links-useful-details',
    title: 'Small links, useful details: cutlink',
    summary:
      'A short-link tool where the interesting part is everything around the URL.',
    category: 'FULL-STACK / TOOLS',
    readingTime: '2 MIN READ',
    tags: ['TypeScript', 'Bun', 'PostgreSQL'],
    url: '/articles/small-links-useful-details',
  },
]

const postFiles = import.meta.glob<string>('./articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getPostContent(slug: string): string | undefined {
  if (!posts.some((post) => post.slug === slug)) return undefined
  return postFiles[`./articles/${slug}.md`]
}
