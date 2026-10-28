import { useEffect, useRef, useState } from 'react'
import { links } from '../content/links'

export function CopyEmail({
  className = 'button button-light',
}: {
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    [],
  )

  async function copy() {
    if (!links.email) return
    try {
      await navigator.clipboard.writeText(links.email)
      setCopied(true)
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={copy}
      disabled={!links.email}
      title={!links.email ? 'Email address not available yet' : undefined}
      aria-label={copied ? 'Email copied' : 'Copy email address'}
    >
      {links.email &&
        (copied ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        ))}
      {copied ? 'Copied' : links.email ? links.email : 'Email coming soon'}
    </button>
  )
}
