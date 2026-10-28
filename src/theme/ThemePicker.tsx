import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { THEMES } from './themes.ts'
import type { ThemeId } from './themes.ts'
import { useTheme } from './useTheme.ts'
import './picker.css'

export function ThemePicker() {
  const { theme, mode, setTheme, toggleMode, canToggleMode } = useTheme()
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const previewRef = useRef<ThemeId | null>(null)
  const committedRef = useRef(theme)
  const titleId = useId()
  const modesId = useId()
  committedRef.current = theme

  function clearPreview() {
    if (previewRef.current !== null) {
      document.documentElement.dataset.theme = committedRef.current
      document.documentElement.dataset.mode = mode
      previewRef.current = null
    }
  }

  function preview(id: ThemeId) {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      previewRef.current = id
      document.documentElement.dataset.theme = id
      if (THEMES.find((item) => item.id === id)?.modes.length === 1) {
        document.documentElement.dataset.mode = 'dark'
      }
    }
  }

  function close() {
    clearPreview()
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : triggerRef.current
    const dialog = dialogRef.current
    dialog
      ?.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')
      ?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      } else if (event.key === 'Tab' && dialog) {
        const items = Array.from(
          dialog.querySelectorAll<HTMLElement>('button:not([disabled])'),
        )
        const first = items[0]
        const last = items[items.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      clearPreview()
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus()
      else triggerRef.current?.focus()
    }
  }, [open])

  function onRadioKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const columns = 2
    const step =
      event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowLeft'
          ? -1
          : event.key === 'ArrowDown'
            ? columns
            : event.key === 'ArrowUp'
              ? -columns
              : 0
    if (step) {
      event.preventDefault()
      const next = (index + step + THEMES.length) % THEMES.length
      dialogRef.current
        ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
        [next]?.focus()
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const next = event.key === 'Home' ? 0 : THEMES.length - 1
      dialogRef.current
        ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
        [next]?.focus()
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="theme-picker-trigger"
        aria-label="Choose theme"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.4-3.4 1.5 1.5 0 0 1 1.1-2.6H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3Z" />
          <circle cx="7.5" cy="12" r="1" />
          <circle cx="10" cy="7.5" r="1" />
          <circle cx="16" cy="8.5" r="1" />
        </svg>
      </button>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Theme set to {THEMES.find((item) => item.id === theme)?.label}, {mode}
      </span>
      {open &&
        createPortal(
          <div
            className="theme-picker-backdrop"
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) close()
            }}
          >
            <div
              className="theme-picker-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              ref={dialogRef}
            >
              <span className="theme-picker-handle" aria-hidden="true" />
              <div className="theme-picker-heading">
                <div>
                  <h2 id={titleId}>Choose a theme</h2>
                  <p>Make this space yours.</p>
                </div>
                <button
                  type="button"
                  className="theme-picker-close"
                  onClick={close}
                  aria-label="Close theme picker"
                >
                  ✕
                </button>
              </div>
              <div
                role="radiogroup"
                aria-label="Color theme"
                className="theme-picker-grid"
              >
                {THEMES.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={theme === item.id}
                    tabIndex={theme === item.id ? 0 : -1}
                    className="theme-picker-option"
                    onKeyDown={(event) => onRadioKeyDown(event, index)}
                    onFocus={() => preview(item.id)}
                    onBlur={() => clearPreview()}
                    onMouseEnter={() => preview(item.id)}
                    onMouseLeave={() => clearPreview()}
                    onClick={() => {
                      clearPreview()
                      setTheme(item.id)
                      close()
                    }}
                  >
                    <span
                      className="theme-picker-swatch"
                      style={{ background: item.swatch[2] }}
                      aria-hidden="true"
                    >
                      <i style={{ background: item.swatch[0] }} />
                      <i style={{ background: item.swatch[1] }} />
                    </span>
                    <span className="theme-picker-option-label">
                      {item.label}
                      {item.modes.length === 1 && <small>dark only</small>}
                    </span>
                    <span className="theme-picker-check" aria-hidden="true">
                      {theme === item.id ? '✓' : ''}
                    </span>
                  </button>
                ))}
              </div>
              <div className="theme-picker-modes" aria-labelledby={modesId}>
                <span id={modesId}>Appearance</span>
                <div
                  className="theme-picker-segment"
                  role="group"
                  aria-label="Appearance mode"
                  title={!canToggleMode ? 'This theme is dark only' : undefined}
                >
                  <button
                    type="button"
                    aria-pressed={mode === 'light'}
                    disabled={!canToggleMode}
                    onClick={() => {
                      if (mode !== 'light') toggleMode()
                    }}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    aria-pressed={mode === 'dark'}
                    disabled={!canToggleMode}
                    onClick={() => {
                      if (mode !== 'dark') toggleMode()
                    }}
                  >
                    Dark
                  </button>
                </div>
                {!canToggleMode && (
                  <span className="theme-picker-mode-note">Dark mode only</span>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
