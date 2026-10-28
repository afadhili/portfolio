import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteSidebar } from '../components/SiteSidebar'
import { ArticleCover } from '../components/ArticleCover'
import { caseStudies } from '../content/caseStudies'
import { posts } from '../content/posts'
import '../styles/articles-index.css'

export const Route = createFileRoute('/articles/')({
  component: ArticlesIndex,
  head: () => ({
    meta: [
      { title: 'Writing & case studies — AIFadh' },
      {
        name: 'description',
        content: 'Project notes and case studies by Ahmad Isnainil Fadhili.',
      },
      { property: 'og:title', content: 'Writing & case studies — AIFadh' },
      {
        property: 'og:description',
        content: 'Notes from building for the web, terminal, and beyond.',
      },
    ],
  }),
})

function ArticlesIndex() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteSidebar />
      <main id="main" className="container articles-index">
        <header className="articles-index__header">
          <span className="eyebrow">— NOTES FROM THE BUILD</span>
          <h1>
            Writing<span className="accent-dot">.</span>
          </h1>
          <p>
            Project notes. Things worth pulling apart and putting back together.
          </p>
          <Link to="/" hash="work" className="back-link">
            ← Back to portfolio
          </Link>
        </header>
        <section aria-labelledby="articles-title">
          <div className="articles-index__heading">
            <h2 id="articles-title">Articles</h2>
            <span className="eyebrow">
              {String(posts.length).padStart(2, '0')} STORIES
            </span>
          </div>
          <div className="articles-index__grid">
            {posts.map((post, index) => (
              <Link
                to="/articles/$slug"
                params={{ slug: post.slug }}
                className="card article-card articles-index__card"
                key={post.slug}
              >
                <div className="article-top">
                  <span className="eyebrow">{post.category}</span>
                  <span className="article-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <ArticleCover slug={post.slug} />
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                </div>
                <div className="articles-index__card-bottom">
                  <div className="tags">
                    {post.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="article-bottom">
                    <span>{post.readingTime}</span>
                    <span className="article-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="articles-index__swipe">Swipe for more articles ↔</p>
        </section>
        <section
          className="articles-index__studies"
          aria-labelledby="studies-title"
        >
          <div className="articles-index__heading">
            <h2 id="studies-title">Case studies</h2>
            <span className="eyebrow">BEHIND THE BUILD</span>
          </div>
          <div className="case-studies-grid">
            {caseStudies.map((study, index) => (
              <Link
                to="/projects/$slug"
                params={{ slug: study.slug }}
                className="card case-study-card"
                key={study.slug}
              >
                <div className="case-study-card__top">
                  <span className="eyebrow">CASE STUDY / 0{index + 1}</span>
                  <span className="case-study-card__arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="case-study-card__mark" aria-hidden="true">
                  {index === 0 ? '{ }' : '♫'}
                </div>
                <div className="case-study-card__body">
                  <h3>{study.title}</h3>
                  <p>{study.summary}</p>
                  <div className="tags">
                    {study.stack.slice(0, 3).map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
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
      </footer>
    </>
  )
}
