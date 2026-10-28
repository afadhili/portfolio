import { githubRepositories } from './github'
import type { GithubRepository } from './github'

export type ProjectSize = '2x2' | '2x1' | '1x2' | '1x1'

// Curated composition; GitHub continues to own the repository details and counts.
export const pinnedProjects: ReadonlyArray<{
  name: string
  size: ProjectSize
}> = [
  { name: 'TIF-IDE-rework', size: '2x2' },
  { name: 'ytmusic-cli', size: '2x1' },
  { name: 'rust-ytmusic-api', size: '1x1' },
  { name: 'cutlink', size: '1x1' },
  { name: 'whatsapp-ui', size: '1x2' },
  { name: 'statistik-karakteristik-visual', size: '1x1' },
]

export type Project = Omit<GithubRepository, 'name'> & {
  slug: string
  title: string
  size: ProjectSize
  pinned: boolean
}

export function projectsFromRepositories(
  repositories: GithubRepository[],
): Project[] {
  return repositories.map(({ name, ...repository }) => {
    const composition = pinnedProjects.find((item) => item.name === name)
    return {
      ...repository,
      slug: name,
      title: name,
      size: composition?.size ?? '1x1',
      pinned: Boolean(composition),
    }
  })
}

// Initial render and offline fallback.
export const projects = projectsFromRepositories(githubRepositories)

export const stack = [
  'TypeScript',
  'React',
  'Express',
  'Socket.IO',
  'PostgreSQL',
  'Drizzle',
  'Rust',
  'Python',
  'Linux',
  'Git',
] as const
