import { useTheme } from '../theme/useTheme.ts'

export function ThemeToggle() {
  const { mode, toggleMode, canToggleMode } = useTheme()

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleMode}
      disabled={!canToggleMode}
      aria-label="Toggle light or dark mode"
      aria-pressed={mode === 'dark'}
      title={
        canToggleMode ? 'Toggle light or dark mode' : 'This theme is dark only'
      }
    >
      {mode === 'dark' ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1 9 9 0 1 0 20.9 13.3Z" />
        </svg>
      )}
    </button>
  )
}
