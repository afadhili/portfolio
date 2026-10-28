import { githubProfile, githubRepositories, recentPublicEvents } from './github'
import type {
  GithubProfile,
  GithubRepository,
  PublicGithubEvent,
} from './github'

export type GithubData = {
  profile: GithubProfile
  repositories: GithubRepository[]
  events: PublicGithubEvent[]
  source: 'snapshot' | 'live'
  eventsSource: 'snapshot' | 'live'
  eventsFetchedAt: string | null
  fetchedAt: string | null
}

export const fallbackGithubData: GithubData = {
  profile: githubProfile,
  repositories: githubRepositories,
  events: recentPublicEvents,
  source: 'snapshot',
  eventsSource: 'snapshot',
  eventsFetchedAt: null,
  fetchedAt: null,
}

const api = 'https://api.github.com/users/afadhili'
const cacheKey = 'aifadh:github-public:v2'
export const githubCacheDuration = 60 * 60 * 1000
let inFlight: Promise<GithubData> | null = null

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidCache(value: unknown): value is GithubData {
  if (
    !isRecord(value) ||
    !isRecord(value.profile) ||
    !Array.isArray(value.repositories) ||
    !Array.isArray(value.events)
  )
    return false
  return (
    value.source === 'live' &&
    (value.eventsFetchedAt === null ||
      typeof value.eventsFetchedAt === 'string') &&
    typeof value.fetchedAt === 'string' &&
    Number.isFinite(Date.parse(value.fetchedAt)) &&
    typeof value.profile.username === 'string' &&
    typeof value.profile.location === 'string' &&
    typeof value.profile.avatarUrl === 'string' &&
    value.profile.avatarUrl.startsWith(
      'https://avatars.githubusercontent.com/',
    ) &&
    typeof value.profile.publicRepos === 'number' &&
    typeof value.profile.followers === 'number' &&
    value.repositories.every(
      (repo: unknown) =>
        isRecord(repo) &&
        typeof repo.name === 'string' &&
        typeof repo.description === 'string' &&
        typeof repo.url === 'string' &&
        repo.url.startsWith('https://github.com/afadhili/') &&
        typeof repo.stars === 'number' &&
        Array.isArray(repo.tags),
    ) &&
    value.events.every(
      (event: unknown) =>
        isRecord(event) &&
        typeof event.date === 'string' &&
        typeof event.label === 'string' &&
        typeof event.repository === 'string' &&
        typeof event.url === 'string' &&
        event.url.startsWith('https://github.com/'),
    )
  )
}

export function readGithubCache(): GithubData | null {
  try {
    const stored = localStorage.getItem(cacheKey)
    if (!stored) return null
    const parsed: unknown = JSON.parse(stored)
    return isValidCache(parsed) ? parsed : null
  } catch {
    return null
  }
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`)
  return response.json() as Promise<unknown>
}

function parseProfile(value: unknown, fallback: GithubProfile): GithubProfile {
  if (!isRecord(value) || value.login !== 'afadhili')
    throw new Error('Unexpected GitHub profile response')
  return {
    name:
      typeof value.name === 'string' && value.name ? value.name : fallback.name,
    username: 'afadhili',
    url: fallback.url,
    avatarUrl:
      typeof value.avatar_url === 'string' &&
      value.avatar_url.startsWith('https://avatars.githubusercontent.com/')
        ? value.avatar_url
        : fallback.avatarUrl,
    location: typeof value.location === 'string' ? value.location : '',
    publicRepos:
      typeof value.public_repos === 'number'
        ? value.public_repos
        : fallback.publicRepos,
    followers:
      typeof value.followers === 'number'
        ? value.followers
        : fallback.followers,
    following:
      typeof value.following === 'number'
        ? value.following
        : fallback.following,
    snapshotDate: fallback.snapshotDate,
  }
}

function displayRepository(value: unknown): GithubRepository | null {
  if (
    !isRecord(value) ||
    typeof value.name !== 'string' ||
    !/^[\w.-]+$/.test(value.name)
  )
    return null
  const previous = githubRepositories.find((repo) => repo.name === value.name)
  const language = typeof value.language === 'string' ? value.language : null
  const demo =
    typeof value.homepage === 'string' && /^https:\/\//.test(value.homepage)
      ? value.homepage
      : undefined
  return {
    name: value.name,
    url: `https://github.com/afadhili/${encodeURIComponent(value.name)}`,
    ...(demo ? { demo } : {}),
    description:
      typeof value.description === 'string' && value.description.trim()
        ? value.description
        : (previous?.description ??
          `Explore the ${value.name} repository on GitHub.`),
    category:
      previous?.category ?? `GITHUB / ${language?.toUpperCase() ?? 'PROJECT'}`,
    language,
    stars:
      typeof value.stargazers_count === 'number' ? value.stargazers_count : 0,
    tags: previous?.tags ?? (language ? [language] : ['GitHub']),
    visual: previous?.visual ?? (language === 'Rust' ? 'rust' : 'utility'),
    featured: previous?.featured ?? false,
  }
}

async function loadRepositories(): Promise<GithubRepository[]> {
  const repositories: GithubRepository[] = []
  for (let page = 1; ; page++) {
    const response = await getJson(
      `${api}/repos?per_page=100&page=${page}&sort=updated`,
    )
    if (!Array.isArray(response))
      throw new Error('Unexpected GitHub repository response')
    for (const item of response) {
      const repository = displayRepository(item)
      if (repository) repositories.push(repository)
    }
    if (response.length < 100) break
  }
  return repositories.sort((a, b) => Number(b.featured) - Number(a.featured))
}

function displayEvent(value: unknown): PublicGithubEvent | null {
  if (
    !isRecord(value) ||
    !isRecord(value.repo) ||
    typeof value.repo.name !== 'string' ||
    !/^[-\w.]+\/[-\w.]+$/.test(value.repo.name) ||
    typeof value.created_at !== 'string'
  )
    return null
  const timestamp = Date.parse(value.created_at)
  if (!Number.isFinite(timestamp)) return null
  const label =
    value.type === 'PushEvent'
      ? 'Pushed to repository'
      : value.type === 'CreateEvent'
        ? 'Created branch or repository'
        : value.type === 'WatchEvent'
          ? 'Starred repository'
          : value.type === 'ForkEvent'
            ? 'Forked repository'
            : value.type === 'MemberEvent'
              ? 'Added as collaborator'
              : 'Public activity'
  return {
    date: new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(timestamp),
    label,
    repository: value.repo.name.split('/')[1],
    url: `https://github.com/${value.repo.name}`,
  }
}

async function fetchGithubData(previous: GithubData): Promise<GithubData> {
  const [user, repos] = await Promise.allSettled([
    getJson(api),
    loadRepositories(),
  ])
  if (user.status === 'rejected' && repos.status === 'rejected')
    throw new Error('GitHub is unavailable')
  const profile =
    user.status === 'fulfilled'
      ? parseProfile(user.value, previous.profile)
      : previous.profile
  const repositories =
    repos.status === 'fulfilled' ? repos.value : previous.repositories
  const latest = readGithubCache()
  const eventSource = latest?.eventsSource === 'live' ? latest : previous
  const data: GithubData = {
    profile,
    repositories,
    events: eventSource.events,
    source:
      user.status === 'fulfilled' && repos.status === 'fulfilled'
        ? 'live'
        : 'snapshot',
    eventsSource: eventSource.eventsSource,
    eventsFetchedAt: eventSource.eventsFetchedAt,
    fetchedAt: new Date().toISOString(),
  }
  if (data.source === 'live') {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data))
    } catch {
      /* Cache is optional. */
    }
  }
  return data
}

export async function loadGithubEvents(
  previous: GithubData,
): Promise<GithubData> {
  const cached = readGithubCache()
  if (
    cached?.eventsSource === 'live' &&
    cached.eventsFetchedAt &&
    Date.now() - Date.parse(cached.eventsFetchedAt) < githubCacheDuration
  ) {
    return {
      ...previous,
      events: cached.events,
      eventsSource: 'live',
      eventsFetchedAt: cached.eventsFetchedAt,
    }
  }
  const response = await getJson(`${api}/events/public?per_page=30`)
  if (!Array.isArray(response))
    throw new Error('Unexpected GitHub events response')
  const events = response
    .map(displayEvent)
    .filter((event): event is PublicGithubEvent => event !== null)
  const updated: GithubData = {
    ...previous,
    events,
    eventsSource: 'live',
    eventsFetchedAt: new Date().toISOString(),
  }
  if (updated.source === 'live') {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(updated))
    } catch {
      /* Cache is optional. */
    }
  }
  return updated
}

export function loadGithubData(): Promise<GithubData> {
  const cached = readGithubCache()
  if (
    cached &&
    Date.now() - Date.parse(cached.fetchedAt ?? '') < githubCacheDuration
  )
    return Promise.resolve(cached)
  if (inFlight) return inFlight
  inFlight = fetchGithubData(cached ?? fallbackGithubData).finally(() => {
    inFlight = null
  })
  return inFlight
}
