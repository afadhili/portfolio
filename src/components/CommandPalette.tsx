import { useEffect, useMemo, useRef, useState } from 'react'
import { links } from '../content/links'
import { THEMES } from '../theme/themes.ts'
import { useTheme } from '../theme/useTheme.ts'

type Action = {
  id: string
  label: string
  hint: string
  run: () => void
  disabled?: boolean
}

function fuzzyMatch(text: string, query: string) {
  const letters = query.toLowerCase().replace(/\s+/g, '')
  const target = text.toLowerCase()
  let position = 0
  for (const letter of letters) {
    position = target.indexOf(letter, position)
    if (position < 0) return false
    position++
  }
  return true
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { theme, setTheme, toggleMode, canToggleMode } = useTheme()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    inputRef.current?.focus()
    return () => previousFocus.current?.focus()
  }, [open])

  const actions: Action[] = useMemo(
    () => [
      ...(['about', 'work', 'writing', 'contact'] as const).map((id) => ({
        id,
        label: `Go to ${id === 'work' ? 'projects' : id === 'writing' ? 'articles' : id}`,
        hint: id === 'work' ? 'G P' : 'JUMP',
        run: () => {
          window.location.assign(id === 'writing' ? '/articles' : `/#${id}`)
        },
      })),
      {
        id: 'theme',
        label: 'Toggle dark/light',
        hint: 'APPEARANCE',
        disabled: !canToggleMode,
        run: toggleMode,
      },
      ...THEMES.map((item) => ({
        id: `theme-${item.id}`,
        label: `Theme: ${item.label}`,
        hint: theme === item.id ? 'CURRENT THEME' : 'APPEARANCE',
        run: () => setTheme(item.id),
      })),
      {
        id: 'email',
        label: 'Copy email',
        hint: 'CONTACT',
        disabled: !links.email,
        run: () => {
          if (links.email) void navigator.clipboard.writeText(links.email)
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: 'EXTERNAL',
        disabled: !links.github,
        run: () => {
          if (links.github)
            window.open(links.github, '_blank', 'noopener,noreferrer')
        },
      },
    ],
    [theme, setTheme, toggleMode, canToggleMode],
  )
  const results = actions.filter((action) => fuzzyMatch(action.label, query))
  const active = Math.min(selected, results.length - 1)

  function choose(action: Action) {
    if (action.disabled) return
    action.run()
    onClose()
    setQuery('')
    setSelected(0)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelected((active + 1) % Math.max(results.length, 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelected(
        (active - 1 + Math.max(results.length, 1)) %
          Math.max(results.length, 1),
      )
    }
    if (event.key === 'Enter' && results[active]) {
      event.preventDefault()
      choose(results[active])
    }
    if (event.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, button:not([disabled])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  if (!open) return null
  return (
    <div
      className="palette-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="presentation"
    >
      <div
        className="palette-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        ref={dialogRef}
        onKeyDown={onKeyDown}
      >
        <div className="palette-search">
          <span aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelected(0)
            }}
            role="combobox"
            aria-label="Search commands"
            aria-controls="palette-results"
            aria-expanded="true"
            aria-activedescendant={
              results[active] ? `palette-${results[active].id}` : undefined
            }
            placeholder="What would you like to do?"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
          >
            ESC
          </button>
        </div>
        <div
          className="palette-results"
          id="palette-results"
          role="listbox"
          aria-label="Commands"
        >
          {results.length ? (
            results.map((action, index) => (
              <div
                role="option"
                aria-selected={index === active}
                aria-disabled={action.disabled}
                id={`palette-${action.id}`}
                key={action.id}
                className={`palette-option${index === active ? ' is-selected' : ''}${action.disabled ? ' is-disabled' : ''}`}
                onMouseEnter={() => setSelected(index)}
                onClick={() => choose(action)}
              >
                <span>{action.label}</span>
                <small>{action.disabled ? 'NOT AVAILABLE' : action.hint}</small>
              </div>
            ))
          ) : (
            <p className="palette-empty">No matching commands.</p>
          )}
        </div>
        <div className="palette-help">
          ↑ ↓ to navigate <span>↵ select</span> <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
