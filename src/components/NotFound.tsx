import { useEffect, useMemo } from 'react'
import '../styles/not-found.css'
import { Link } from '@tanstack/react-router'

const QUICK_LINKS = [
  { label: 'About', href: '/#about', index: '01' },
  { label: 'Projects', href: '/#projects', index: '02' },
  { label: 'Articles', href: '/#articles', index: '03' },
  { label: 'Contact', href: '/#contact', index: '04' },
]

function truncate(value: string, max = 42) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

export function NotFound() {
  // Show the path that failed. React escapes it, so this is safe to render.
  const path = useMemo(() => truncate(window.location.pathname || '/'), [])

  useEffect(() => {
    const previous = document.title
    document.title = '404 — Page not found · AIFadh'
    return () => {
      document.title = previous
    }
  }, [])

  const goBack = () => {
    if (window.history.length > 1) window.history.back()
    else window.location.assign('/')
  }

  return (
    <main className="nf" id="main">
      <div className="nf__inner">
        <p className="nf__eyebrow" style={{ ['--i' as string]: 0 }}>
          <span className="nf__eyebrow-line" aria-hidden="true" />
          ERROR / 404
        </p>

        <div className="nf__grid">
          {/* Hero tile */}
          <section
            className="nf-card nf-card--hero"
            style={{ ['--i' as string]: 1 }}
            aria-labelledby="nf-title"
          >
            <span className="nf-card__star" aria-hidden="true">
              ✳
            </span>

            <p className="nf-card__label">PAGE NOT FOUND</p>

            <h1 id="nf-title" className="nf__title">
              <span className="nf__code" aria-hidden="true">
                404
              </span>
              <span className="sr-only">404, </span>
              Lost in the stack<span className="nf__dot">.</span>
            </h1>

            <p className="nf__lead">
              This page doesn&apos;t exist, or it moved somewhere else. The
              front end is fine. The back end is fine. The route just isn&apos;t
              there.
            </p>

            <div className="nf__actions">
              <Link className="nf-btn nf-btn--primary" to="/">
                Back to home <span aria-hidden="true">↗</span>
              </Link>
              <button
                type="button"
                className="nf-btn nf-btn--ghost"
                onClick={goBack}
              >
                <span aria-hidden="true">←</span> Go back
              </button>
            </div>
          </section>

          {/* Terminal tile */}
          <section
            className="nf-card nf-card--terminal"
            style={{ ['--i' as string]: 2 }}
            aria-label="Request log"
          >
            <div className="nf-term__bar" aria-hidden="true">
              <span className="nf-term__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="nf-term__title">request.log</span>
            </div>

            <div
              className="nf-term__body"
              role="img"
              aria-label={`GET ${path} returned 404 Not Found`}
            >
              <p>
                <span className="nf-term__prompt">$</span> curl -i{' '}
                <span className="nf-term__path">{path}</span>
              </p>
              <p>
                <span className="nf-term__status">HTTP/1.1 404 Not Found</span>
              </p>
              <p className="nf-term__muted">
                // nothing here. check the url or head home
              </p>
              <p>
                <span className="nf-term__prompt">$</span>{' '}
                <span className="nf-term__cursor" />
              </p>
            </div>
          </section>

          {/* Quick links tile */}
          <nav
            className="nf-card nf-card--links"
            style={{ ['--i' as string]: 3 }}
            aria-label="Quick links"
          >
            <p className="nf-card__label">TRY THESE INSTEAD</p>
            <ul className="nf-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link className="nf-links__item" to={link.href}>
                    <span className="nf-links__index">{link.index}</span>
                    <span className="nf-links__text">{link.label}</span>
                    <span className="nf-links__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Playful tile */}
          <aside
            className="nf-card nf-card--note"
            style={{ ['--i' as string]: 4 }}
          >
            <p className="nf-card__label">A LITTLE NOTE</p>
            <p className="nf-note__text">
              Not every path leads somewhere.
              <br />
              <span>The good ones are worth finding.</span>
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default NotFound
