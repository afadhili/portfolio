import { useEffect, useRef, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { SiteSidebar } from '../components/SiteSidebar'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectPagination } from '../components/ProjectPagination'
import { Marquee } from '../components/Marquee'
import { CopyEmail } from '../components/CopyEmail'

import { Timeline } from '../components/Timeline'
import { GithubActivity } from '../components/GithubActivity'
import { useGithubActivity } from '../components/useGithubActivity'
import { pinnedProjects, projectsFromRepositories } from '../content/data'

import { links } from '../content/links'

import { uses } from '../content/uses'
import { lastUpdated, projectsPerPage } from '../content/site'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: 'Ahmad Isnainil Fadhili — Frontend & Backend Developer' },
      {
        name: 'description',
        content:
          'AIFadh is Ahmad Isnainil Fadhili, a frontend and backend developer and university student in Indonesia studying network security and AI.',
      },
      { property: 'og:title', content: 'Ahmad Isnainil Fadhili — AIFadh' },
      {
        property: 'og:description',
        content: 'Both sides of the stack. Curiosity meets craft.',
      },
      { property: 'og:image', content: '/og-placeholder.svg' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
})

function Home() {
  const { data: github, error: githubError } = useGithubActivity()
  const projects = projectsFromRepositories(github.repositories)
  const curated = pinnedProjects.flatMap(({ name }) => {
    const project = projects.find((item) => item.slug === name)
    return project ? [project] : []
  })
  const archive = projects.filter((project) => !project.pinned)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [usesExpanded, setUsesExpanded] = useState(false)
  const [featuredSlide, setFeaturedSlide] = useState(0)
  const featuredRow = useRef<HTMLDivElement>(null)
  const featured = curated.slice(0, 2)
  function scrollFeatured(index: number) {
    const row = featuredRow.current
    const card = row?.children.item(index)
    if (!(card instanceof HTMLElement)) return
    row?.scrollTo({
      left: card.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
    setFeaturedSlide(index)
  }
  function onFeaturedScroll() {
    const row = featuredRow.current
    if (!row) return
    const cards = Array.from(row.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    )
    if (!cards.length) return
    const nearest = cards.reduce(
      (best, card, index) =>
        Math.abs(card.offsetLeft - row.scrollLeft) <
        Math.abs(cards[best].offsetLeft - row.scrollLeft)
          ? index
          : best,
      0,
    )
    setFeaturedSlide(nearest)
  }
  const [projectPage, setProjectPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(archive.length / projectsPerPage))
  const currentPage = Math.min(projectPage, pageCount)
  const firstProject = (currentPage - 1) * projectsPerPage
  const visibleProjects = archive.slice(
    firstProject,
    firstProject + projectsPerPage,
  )
  const languageCounts = projects.reduce<Record<string, number>>(
    (counts, project) => {
      const language = project.language ?? 'Other'
      counts[language] = (counts[language] ?? 0) + 1
      return counts
    },
    {},
  )
  const languages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0)

  useEffect(() => {
    setProjectPage((page) => Math.min(page, pageCount))
  }, [pageCount])

  function changeProjectPage(page: number) {
    if (page === currentPage) return
    setProjectPage(page)
    requestAnimationFrame(() =>
      document.getElementById('archive-title')?.focus(),
    )
  }

  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('.main-content .card'),
    )
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return
    }
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          reveal.unobserve(entry.target)
        })
      },
      { threshold: 0.15 },
    )
    if (!reduced)
      cards.forEach((card) => {
        if (!card.closest('.intro-grid')) {
          card.classList.add('reveal-ready')
          reveal.observe(card)
        }
      })
    else cards.forEach((card) => card.classList.add('is-visible'))
    const onPointerMove = (event: PointerEvent) => {
      const card = (event.target as Element).closest<HTMLElement>('.card')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      card.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }
    if (window.matchMedia('(hover: hover)').matches && !reduced)
      document
        .querySelector('.main-content')
        ?.addEventListener('pointermove', onPointerMove as EventListener)
    return () => {
      reveal.disconnect()
      document
        .querySelector('.main-content')
        ?.removeEventListener('pointermove', onPointerMove as EventListener)
    }
  }, [])
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteSidebar />
      <main id="main" className="container main-content">
        <section id="about" className="intro-section" aria-label="Introduction">
          <div className="section-kicker">
            <span className="kicker-line" /> HELLO, WORLD{' '}
            <span className="kicker-muted">/ 001</span>
          </div>
          <div className="bento intro-grid">
            <div
              className="card hero-card span-2x2"
              style={{ '--i': 0 } as React.CSSProperties}
            >
              <div className="hero-top">
                <img
                  className="hero-avatar-mobile"
                  src={github.profile.avatarUrl}
                  alt=""
                  width="72"
                  height="72"
                  fetchPriority="high"
                />
                <span className="eyebrow">
                  FRONTEND + BACKEND DEVELOPER{' '}
                  <span className="hero-cursor" aria-hidden="true">
                    _
                  </span>
                </span>
                <span className="hero-sparkle" aria-hidden="true">
                  ✳
                </span>
              </div>
              <div className="hero-content">
                <h1>
                  <span className="hero-word">Hi,</span>{' '}
                  <span className="hero-word">I’m Ahmad</span>
                  <span className="hero-name-secondary">
                    <span className="hero-word">Isnainil</span>{' '}
                    <span className="hero-word">
                      Fadhili<span className="accent-dot">.</span>
                    </span>
                  </span>
                </h1>
                <p>
                  Better known as <strong>AIFadh</strong>. I’m a university
                  student in Indonesia studying network security and AI. I build
                  thoughtful interfaces and the systems behind them.
                </p>
                <div className="profile-stats">
                  {github.profile.location && (
                    <span>⌁ {github.profile.location}</span>
                  )}
                  <span>
                    <strong>{github.profile.publicRepos}</strong> public
                    repositories
                  </span>
                </div>
                <div className="hero-actions">
                  <a href="#work" className="button button-primary">
                    View projects ↓
                  </a>
                  {links.cv ? (
                    <a
                      className="button button-secondary"
                      href={links.cv}
                      download
                    >
                      Download CV ↓
                    </a>
                  ) : (
                    <button
                      className="button button-secondary"
                      type="button"
                      disabled
                      title="CV not available yet"
                    >
                      Download CV ↓
                    </button>
                  )}
                </div>
              </div>
              <div className="hero-bottom">
                <span>DESIGN-MINDED. CODE-DRIVEN.</span>
                <span aria-hidden="true">↘ SCROLL TO EXPLORE</span>
              </div>
            </div>
            <div
              className="card portrait-card span-1x2"
              style={{ '--i': 1 } as React.CSSProperties}
            >
              <div className="portrait-grid" aria-hidden="true" />
              <div className="portrait-halo" aria-hidden="true" />
              <div className="portrait-monogram" aria-hidden="true">
                a<span>i</span>f<span className="portrait-dot">.</span>
              </div>
              <img
                className="portrait-photo"
                src={github.profile.avatarUrl}
                alt="Ahmad Isnainil Fadhili’s GitHub avatar"
                width="180"
                height="180"
                loading="lazy"
                fetchPriority="low"
              />
              <div className="portrait-caption">
                <span>GITHUB / @{github.profile.username}</span>
                <span>↗</span>
              </div>
            </div>
            <div
              className="card specialty-card span-1x1"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              <span className="eyebrow">01 / WHAT I DO</span>
              <div className="specialty-icon" aria-hidden="true">
                {'{ }'}
              </div>
              <h2>
                Both sides
                <br />
                of the stack<span className="accent-dot">.</span>
              </h2>
              <p>From first interaction to the last API call.</p>
            </div>
            <div
              className="card mindset-card span-1x1"
              style={{ '--i': 3 } as React.CSSProperties}
            >
              <span className="eyebrow">02 / HOW I WORK</span>
              <div className="mindset-symbol" aria-hidden="true">
                ✳
              </div>
              <h2>
                Curiosity
                <br />
                meets craft<span className="accent-dot">.</span>
              </h2>
              <p>Always learning. Always making it better.</p>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="content-section"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <div className="section-kicker">
                <span className="kicker-line" /> PUBLIC WORK{' '}
                <span className="kicker-muted">/ 002</span>
              </div>
              <h2 id="work-title" tabIndex={-1}>
                Projects<span className="accent-dot">.</span>
              </h2>
            </div>
            <p>
              A few things I’ve made. More experiments in the archive below.
            </p>
          </div>

          <div
            className="project-grid bento-projects"
            aria-label="Selected projects"
          >
            <div
              className="featured-project-row"
              ref={featuredRow}
              onScroll={onFeaturedScroll}
              role="group"
              aria-label="Featured projects"
            >
              {featured.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </div>
            <nav
              className="featured-project-dots"
              aria-label="Featured project slides"
            >
              {featured.map((project, index) => (
                <button
                  type="button"
                  key={project.slug}
                  onClick={() => scrollFeatured(index)}
                  aria-label={`Show ${project.title}`}
                  aria-current={featuredSlide === index ? 'true' : undefined}
                >
                  <span />
                </button>
              ))}
            </nav>
            <div
              className="card project-insight project-insight--stats"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              <span className="eyebrow">BY THE NUMBERS</span>
              <div className="project-mini-stats">
                <span>
                  <strong>{projects.length}</strong>
                  <small>REPOS</small>
                </span>
                <span>
                  <strong>{totalStars}</strong>
                  <small>STARS</small>
                </span>
                <span>
                  <strong>
                    {
                      languages.filter(([language]) => language !== 'Other')
                        .length
                    }
                  </strong>
                  <small>LANGS</small>
                </span>
              </div>
              <div className="project-sparkline" aria-hidden="true">
                {languages.map(([language, count]) => (
                  <i
                    key={language}
                    style={
                      {
                        '--bar': count / Math.max(1, languages[0]?.[1] ?? 1),
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
            {curated.slice(2, 5).map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index + 3}
              />
            ))}
            <div
              className="card project-insight project-insight--languages"
              style={{ '--i': 6 } as React.CSSProperties}
            >
              <span className="eyebrow">LANGUAGES / PUBLIC REPOS</span>
              <div
                className="language-breakdown"
                role="img"
                aria-label={`Repository languages: ${languages.map(([language, count]) => `${language} ${count}`).join(', ')}`}
              >
                {languages.map(([language, count], index) => (
                  <div
                    key={language}
                    title={`${language}: ${count} repositories`}
                    style={
                      {
                        flex: count,
                        '--language-color': `var(--language-${Math.min(index + 1, 4)})`,
                      } as React.CSSProperties
                    }
                    className="language-breakdown__segment"
                  />
                ))}
              </div>
              <span className="language-legend">
                {languages.map(([language, count], index) => (
                  <span key={language}>
                    <i
                      className="language-legend__dot"
                      aria-hidden="true"
                      style={
                        {
                          '--language-color': `var(--language-${Math.min(index + 1, 4)})`,
                        } as React.CSSProperties
                      }
                    />
                    {language}{' '}
                    {Math.round((count / Math.max(1, projects.length)) * 100)}%
                  </span>
                ))}
              </span>
            </div>
            {curated.slice(5).map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index + 7}
              />
            ))}

            <div
              className="card project-insight project-insight--focus"
              style={{ '--i': 8 } as React.CSSProperties}
            >
              <span className="eyebrow">FOCUS AREAS</span>
              <strong>
                Security, AI & the web<span className="accent-dot">.</span>
              </strong>
              <span>Building across disciplines</span>
            </div>
          </div>
          <div className="archive-header">
            <div>
              <span className="eyebrow">THE REST OF THE STORY</span>
              <h3 id="archive-title" tabIndex={-1}>
                All repositories<span className="accent-dot">.</span>
              </h3>
            </div>
            <button
              type="button"
              className="archive-toggle"
              aria-expanded={archiveOpen}
              aria-controls="repository-archive"
              onClick={() => setArchiveOpen(!archiveOpen)}
            >
              {archiveOpen
                ? 'Hide archive −'
                : `Browse ${archive.length} more ↗`}
            </button>
          </div>
          <div
            id="repository-archive"
            className="repository-archive"
            hidden={!archiveOpen}
          >
            <ul className="repository-list" key={currentPage}>
              {visibleProjects.map((project, index) => (
                <li
                  key={project.slug}
                  style={{ '--i': index } as React.CSSProperties}
                >
                  <a href={project.url} target="_blank" rel="noreferrer">
                    <span className="repository-list__name">
                      {project.title}
                    </span>
                    <span className="repository-list__description">
                      {project.description}
                    </span>
                    <span className="repository-list__meta">
                      {project.language ?? 'Other'} · ★ {project.stars}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  {project.demo && (
                    <a
                      className="repository-list__demo"
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live demo ↗
                      <span className="sr-only">
                        {' '}
                        of {project.title} (opens in new tab)
                      </span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <ProjectPagination
              page={currentPage}
              pageCount={pageCount}
              total={archive.length}
              from={firstProject + 1}
              to={Math.min(firstProject + projectsPerPage, archive.length)}
              onPageChange={changeProjectPage}
            />
          </div>
        </section>

        <section
          id="beyond"
          className="content-section more-section"
          aria-labelledby="beyond-title"
        >
          <div className="section-heading">
            <div>
              <div className="section-kicker">
                <span className="kicker-line" /> TOOLS & APPROACH{' '}
                <span className="kicker-muted">/ 003</span>
              </div>
              <h2 id="beyond-title">
                Beyond the code<span className="accent-dot">.</span>
              </h2>
            </div>
          </div>
          <div className="bento more-grid">
            <div className="card stack-card span-2x1">
              <div className="stack-heading">
                <span className="eyebrow">THE TOOLBOX</span>
                <span className="stack-asterisk" aria-hidden="true">
                  ✳
                </span>
              </div>
              <h2>
                Tools are a means.
                <br />
                <span>Good experiences are the goal.</span>
              </h2>
              <Marquee />
            </div>
            <div className="card philosophy-card span-2x1">
              <span className="eyebrow">A LITTLE PHILOSOPHY</span>
              <div className="quote-mark" aria-hidden="true">
                “
              </div>
              <blockquote>
                Build things that work well, feel good, and make someone’s day a
                little easier.
              </blockquote>
              <span className="philosophy-footer">
                — THE WAY I LIKE TO WORK
              </span>
            </div>

            <div
              id="uses-setup"
              className={`card uses-card span-2x1${usesExpanded ? ' is-expanded' : ''}`}
            >
              <span className="eyebrow">USES / MY SETUP</span>
              <div className="uses-terminal">
                <div className="uses-terminal-top">
                  <span aria-hidden="true">● ● ●</span> setup.txt
                </div>
                <dl>
                  {uses.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label.toLowerCase()}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="uses-toggle"
            aria-expanded={usesExpanded}
            aria-controls="uses-setup"
            onClick={() => setUsesExpanded(!usesExpanded)}
          >
            {usesExpanded ? 'Hide setup −' : 'Show my setup +'}
          </button>
        </section>

        <section
          id="journey"
          className="content-section credibility-section"
          aria-labelledby="journey-title"
        >
          <div className="section-heading">
            <div>
              <div className="section-kicker">
                <span className="kicker-line" /> THE PATH SO FAR{' '}
                <span className="kicker-muted">/ 004</span>
              </div>
              <h2 id="journey-title">
                Journey<span className="accent-dot">.</span>
              </h2>
            </div>
          </div>
          <div className="bento credibility-grid">
            <div className="card timeline-card span-2x1">
              <span className="eyebrow">EXPERIENCE & EDUCATION</span>
              <h2>
                Learning by doing<span className="accent-dot">.</span>
              </h2>
              <Timeline />
              <div className="timeline-focus">
                <span className="eyebrow">AREAS OF INTEREST</span>
                <div className="tags">
                  {['Network security', 'AI', 'Frontend', 'Backend'].map(
                    (focus) => (
                      <span className="tag" key={focus}>
                        {focus}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="card activity-card span-2x1">
              <span className="eyebrow">A LITTLE ACTIVITY</span>
              <h2>
                On GitHub<span className="accent-dot">.</span>
              </h2>
              <GithubActivity data={github} error={githubError} />
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="content-section contact-section"
          aria-labelledby="contact-title"
        >
          <div className="card contact-card">
            <div className="contact-glow" aria-hidden="true" />
            <div>
              <span className="eyebrow">05 / LET’S CONNECT</span>
              <h2 id="contact-title">
                Have something in mind?
                <br />
                <span>Let’s make it happen.</span>
              </h2>
              <p>
                Have a project, an idea, or just want to say hello? I’d love to
                hear about it.
              </p>
            </div>
            <div className="contact-actions">
              <CopyEmail />
              <a
                href={links.github || undefined}
                className={`button button-outline${!links.github ? ' is-disabled' : ''}`}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!links.github}
              >
                GitHub ↗
              </a>
              <a
                href={links.linkedin || undefined}
                className={`button button-outline${!links.linkedin ? ' is-disabled' : ''}`}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!links.linkedin}
              >
                LinkedIn ↗
              </a>
              <a
                href={links.cv || undefined}
                className={`button button-outline${!links.cv ? ' is-disabled' : ''}`}
                download={Boolean(links.cv)}
                aria-disabled={!links.cv}
              >
                Download CV ↓
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <span>
          © {new Date().getFullYear()} AIFadh · Ahmad Isnainil Fadhili
        </span>
        <span>
          Made with intention <span className="accent-dot">✳</span>
        </span>
        <span>Last updated {lastUpdated}</span>
        <a href="#main">Back to top ↑</a>
      </footer>
    </>
  )
}
