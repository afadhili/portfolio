import { timeline } from '../content/timeline'
import type { TimelineEntry } from '../content/timeline'

export function Timeline({
  entries = timeline,
}: {
  entries?: readonly TimelineEntry[]
}) {
  return (
    <div className="timeline">
      <ol>
        {entries
          .filter((entry) => entry.title && !entry.title.startsWith('TODO:'))
          .map((entry) => (
            <li key={entry.id}>
              <span className="timeline-node" aria-hidden="true" />
              <div className="timeline-entry">
                {entry.date && !entry.date.startsWith('TODO:') ? (
                  <span className="eyebrow">
                    {entry.date} · {entry.location}
                  </span>
                ) : entry.location && !entry.location.startsWith('TODO:') ? (
                  <span className="eyebrow">{entry.location}</span>
                ) : null}
                <h3>{entry.title}</h3>
                {entry.summary && !entry.summary.startsWith('TODO:') && (
                  <p>{entry.summary}</p>
                )}
                {entry.details.some(
                  (detail) => detail && !detail.startsWith('TODO:'),
                ) && (
                  <ul>
                    {entry.details
                      .filter((detail) => detail && !detail.startsWith('TODO:'))
                      .map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
      </ol>
    </div>
  )
}
