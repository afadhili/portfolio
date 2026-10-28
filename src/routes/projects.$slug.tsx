import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { SiteSidebar } from '../components/SiteSidebar'
import { caseStudies } from '../content/caseStudies'
import '../styles/case-study.css'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => {
    const study = caseStudies.find((item) => item.slug === params.slug)
    if (!study) throw notFound()
    return study
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Project'} — Case study | AIFadh` },
      {
        name: 'description',
        content: loaderData?.summary ?? 'Project case studies by AIFadh.',
      },
      {
        property: 'og:title',
        content: `${loaderData?.title ?? 'Project'} — AIFadh`,
      },
      {
        property: 'og:description',
        content: loaderData?.summary ?? 'Project case studies by AIFadh.',
      },
      { property: 'og:image', content: '/og-placeholder.svg' },
    ],
    links: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  }),
  component: CaseStudyPage,
  notFoundComponent: CaseStudyNotFound,
})

function CaseStudyNotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteSidebar />
      <main id="main" className="container case-study case-study-not-found">
        <h1>Project not found.</h1>
        <p>There isn’t a case study at this address.</p>
        <Link to="/" hash="work" className="case-study-back">
          ← Back to projects
        </Link>
      </main>
    </>
  )
}

function CaseStudyPage() {
  const study = Route.useLoaderData()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteSidebar />
      <main id="main" className="container case-study">
        <nav aria-label="Breadcrumb" className="case-study-breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{study.title}</span>
        </nav>
        <article>
          <header className="case-study-header">
            <span className="case-study-label">PROJECT / CASE STUDY</span>
            <h1>{study.title}</h1>
            <p>{study.summary}</p>
            <a
              className="case-study-back"
              href={study.repository}
              target="_blank"
              rel="noreferrer"
            >
              View GitHub repository ↗
            </a>
          </header>
          <div className="case-study-grid">
            <section
              className="case-study-panel"
              aria-labelledby="problem-title"
            >
              <h2 id="problem-title">Problem</h2>
              <p>{study.problem}</p>
            </section>
            <section
              className="case-study-panel"
              aria-labelledby="approach-title"
            >
              <h2 id="approach-title">Approach</h2>
              <p>{study.approach}</p>
            </section>
            <section className="case-study-panel" aria-labelledby="stack-title">
              <h2 id="stack-title">Stack</h2>
              {study.stack.length ? (
                <ul className="case-study-tags">
                  {study.stack.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              ) : (
                <p>Technology details haven’t been verified yet.</p>
              )}
            </section>
            <section
              className="case-study-panel"
              aria-labelledby="outcome-title"
            >
              <h2 id="outcome-title">Outcome</h2>
              <p>{study.outcome}</p>
            </section>
          </div>
          <section
            className="case-study-gallery"
            aria-labelledby="screenshots-title"
          >
            <h2 id="screenshots-title">Screenshots</h2>
            {study.screenshots.length ? (
              <div className="case-study-grid">
                {study.screenshots.map((screenshot) => (
                  <figure className="case-study-panel" key={screenshot.src}>
                    <img
                      src={screenshot.src}
                      alt={screenshot.alt}
                      loading="lazy"
                      width={screenshot.width}
                      height={screenshot.height}
                    />
                    <figcaption>{screenshot.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="case-study-panel case-study-empty">
                <p>
                  No screenshots available yet. Real project images will appear
                  here when they’re ready.
                </p>
              </div>
            )}
          </section>
        </article>
        <Link to="/" hash="work" className="case-study-back">
          ← Back to projects
        </Link>
      </main>
    </>
  )
}
