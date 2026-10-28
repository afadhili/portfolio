type ProjectPaginationProps = {
  page: number
  pageCount: number
  total: number
  from: number
  to: number
  onPageChange: (page: number) => void
}

export function ProjectPagination({
  page,
  pageCount,
  total,
  from,
  to,
  onPageChange,
}: ProjectPaginationProps) {
  if (total === 0) return null
  const pages: Array<number | 'ellipsis'> = []
  for (let number = 1; number <= pageCount; number++) {
    if (number === 1 || number === pageCount || Math.abs(number - page) <= 1) {
      pages.push(number)
    } else if (pages.at(-1) !== 'ellipsis') {
      pages.push('ellipsis')
    }
  }

  return (
    <nav className="project-pagination" aria-label="Repository archive pages">
      <p className="project-pagination__status" aria-live="polite">
        Showing {from}–{to} of {total} repositories
      </p>
      {pageCount > 1 && (
        <div className="project-pagination__controls">
          <button
            type="button"
            className="project-pagination__arrow"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous repository page"
          >
            ←
          </button>
          {pages.map((number, index) =>
            number === 'ellipsis' ? (
              <span
                className="project-pagination__ellipsis"
                aria-hidden="true"
                key={`gap-${index}`}
              >
                …
              </span>
            ) : (
              <button
                type="button"
                key={number}
                className="project-pagination__number"
                onClick={() => onPageChange(number)}
                aria-label={`Repository page ${number}`}
                aria-current={number === page ? 'page' : undefined}
              >
                {number}
              </button>
            ),
          )}
          <button
            type="button"
            className="project-pagination__arrow"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
            aria-label="Next repository page"
          >
            →
          </button>
        </div>
      )}
    </nav>
  )
}
