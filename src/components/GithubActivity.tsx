import type { GithubData } from '../content/github-api'

export function GithubActivity({
  data,
  error,
}: {
  data: GithubData
  error: boolean
}) {
  const { profile, repositories, events } = data
  const stars = repositories.reduce(
    (total, repository) => total + repository.stars,
    0,
  )
  const grouped = events
    .reduce<
      Array<{
        label: string
        date: string
        url: string
        repository: string
        count: number
      }>
    >((groups, event) => {
      const previous = groups.find((group) => group.label === event.label)
      if (previous) previous.count++
      else groups.push({ ...event, count: 1 })
      return groups
    }, [])
    .slice(0, 4)
  const source =
    data.eventsSource === 'live' && data.eventsFetchedAt
      ? `Updated ${new Date(data.eventsFetchedAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}`
      : `Snapshot ${profile.snapshotDate}`

  return (
    <div className="github-activity">
      <div
        className="github-stats"
        aria-label="Public GitHub profile statistics"
      >
        <span className="github-stat">
          <strong>{repositories.length}</strong> public repos
        </span>
        <span className="github-stat">
          <strong>{stars}</strong> repo stars
        </span>
        <span className="github-stat">
          <strong>{profile.followers}</strong> followers
        </span>
      </div>
      <p className="github-source">
        Recent public events · {source}
        {error ? ' · GitHub unavailable' : ''}
      </p>
      <ul className="github-events">
        {grouped.map((event) => (
          <li key={event.label}>
            <a
              href={event.count > 1 ? profile.url : event.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${event.count > 1 ? `${event.count} recent events: ` : ''}${event.label}${event.count === 1 ? ` in ${event.repository}` : ''} (opens in new tab)`}
            >
              <time>{event.date}</time>
              <span>
                {event.count > 1 ? `${event.count} × ` : ''}
                {event.label}
                {event.count === 1 && (
                  <>
                    {' '}
                    · <strong>{event.repository}</strong>
                  </>
                )}
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
