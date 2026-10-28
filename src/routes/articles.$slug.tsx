import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import { SiteSidebar } from '../components/SiteSidebar'
import { posts, getPostContent } from '../content/posts'

export const Route = createFileRoute('/articles/$slug')({
  loader: ({ params }) => {
    const article = posts.find((item) => item.slug === params.slug)
    const content = getPostContent(params.slug)
    if (!article || content === undefined) throw notFound()
    return { ...article, content }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Article'} — AIFadh` },
      {
        name: 'description',
        content: loaderData?.summary ?? 'Articles by AIFadh',
      },
    ],
  }),
  component: ArticlePage,
  notFoundComponent: () => (
    <div className="not-found container">
      <h1>Article not found.</h1>
      <Link to="/articles">← All articles</Link>
    </div>
  ),
})

function ArticlePage() {
  const article = Route.useLoaderData()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteSidebar />
      <main id="main" className="container article-page">
        <Link to="/articles" className="back-link">
          ← All articles
        </Link>
        <article className="card article-full">
          <span className="eyebrow">
            {article.category} / {article.readingTime}
          </span>
          <h1>{article.title}</h1>
          <p className="article-lede">{article.summary}</p>
          <div className="article-rule" />
          <div className="article-body">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
          <div className="article-end">
            <span>
              THANKS FOR READING <span className="accent-dot">✳</span>
            </span>
            <Link to="/articles">More articles ↗</Link>
          </div>
        </article>
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
