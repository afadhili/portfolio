import type { CSSProperties } from 'react'
import type { Project } from '../content/data'

function ProjectArtwork({ project }: { project: Project }) {
  return (
    <div
      className={`project-art project-art--${project.visual}`}
      aria-hidden="true"
    >
      {project.visual === 'ide' && (
        <div className="art-ide">
          <div className="art-ide-top">
            <span>● ● ●</span>
            <span>{project.title}</span>
            <span>⌘</span>
          </div>
          <div className="art-ide-body">
            <div className="art-ide-files">
              <span>▸ src</span>
              <span> index.ts</span>
              <span> styles.css</span>
            </div>
            <div className="art-ide-editor">
              <span>
                01 <span>const</span> ideas = [
              </span>
              <span>
                02 <span>'build'</span>,
              </span>
              <span>
                03 <span>'create'</span>,
              </span>
              <span>04 ]</span>
              <div className="art-ide-lines">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        </div>
      )}
      {project.visual === 'chat' && (
        <div className="art-chat">
          <div className="art-chat-top">
            <span className="art-avatar">W</span>
            <span>
              {project.title}
              <span className="art-online">interface</span>
            </span>
            <span>•••</span>
          </div>
          <div className="art-bubble">
            Hey there! <span>10:42</span>
          </div>
          <div className="art-bubble art-bubble--reply">
            Hello ✳ <span>10:43</span>
          </div>
          <div className="art-chat-input">
            Type a message... <span>↗</span>
          </div>
        </div>
      )}
      {project.visual === 'music' && (
        <div className="art-mini-terminal">
          <span>● ● ● &nbsp; {project.title}</span>
          <strong>♪ now playing_</strong>
          <div className="art-equalizer">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <small>▶ ━━━━━●━━━━ 3:24</small>
        </div>
      )}
      {project.visual === 'rust' && (
        <div className="art-rust">
          <span>{'{ }'}</span>
          <strong>{project.title}</strong>
          <small>RUST · OPEN SOURCE</small>
        </div>
      )}
      {project.visual === 'utility' && (
        <div className="art-link-preview">
          <span className="art-preview-bar">● ● ● &nbsp; / link</span>
          <strong>short.link/hello</strong>
          <span className="art-preview-line" />
          <span className="art-preview-line" />
          <small>↗ link preview</small>
        </div>
      )}
      {project.visual === 'chart' && (
        <div className="art-chart-preview">
          <span className="art-preview-bar">● ● ● &nbsp; / insights</span>
          <strong>Visual data</strong>
          <div className="art-chart-bars">
            {[42, 75, 56, 90, 64, 82, 48].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <div
      className={`project-entry project-entry--${project.size}`}
      data-project={project.slug}
      style={{ '--i': index } as CSSProperties}
    >
      <div
        className={`card project-card project-card--${project.size} project-card--${project.visual}`}
      >
        <ProjectArtwork project={project} />
        <div className="project-info">
          <span className="eyebrow">{project.category}</span>
          <div className="project-title-row">
            <h3>
              <a
                className="project-main-link"
                href={project.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} on GitHub (opens in new tab)`}
              >
                {project.title}
              </a>
            </h3>
            <span className="project-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
          <p>{project.description}</p>
          <div className="tags">
            {project.tags.map((tag, tagIndex) => (
              <span
                className={`tag ${tagIndex > 0 ? 'tag--extra' : ''}`}
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="project-repo-meta">
            <span className="repo-language">
              <i
                aria-hidden="true"
                className={`language-dot language-dot--${project.language?.toLowerCase() ?? 'other'}`}
              />
              {project.language ?? 'Other'}
            </span>
            <span aria-label={`${project.stars} stars`}>★ {project.stars}</span>
          </span>
        </div>
        {project.demo && (
          <a
            className="project-demo-link"
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            aria-label={`Live demo of ${project.title} (opens in new tab)`}
          >
            Live demo ↗
          </a>
        )}
      </div>
    </div>
  )
}
