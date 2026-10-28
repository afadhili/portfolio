export function ArticleCover({ slug }: { slug: string }) {
  const type =
    slug === 'music-in-the-terminal'
      ? 'music'
      : slug === 'small-links-useful-details'
        ? 'link'
        : 'code'
  const glyph = type === 'music' ? '♫' : type === 'link' ? '↗' : '{ }'
  return (
    <div className={`article-cover article-cover--${type}`} aria-hidden="true">
      <span className="article-cover__window">● ● ●</span>
      <span className="article-cover__glyph">{glyph}</span>
      <span className="article-cover__line" />
    </div>
  )
}
