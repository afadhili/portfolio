import { useSyncExternalStore } from 'react'
import { THEMES } from './themes'
import type { Mode, ThemeId } from './themes'

type Selection = { theme: ThemeId; mode: Mode }
const validTheme = (id: string | undefined): ThemeId | undefined =>
  THEMES.find((item) => item.id === id)?.id
const validMode = (value: string | undefined): Mode | undefined =>
  value === 'light' || value === 'dark' ? value : undefined

function systemMode(): Mode {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function fromStorage(): Selection {
  let id: string | null = null
  let mode: string | null = null
  let legacy: string | null = null
  try {
    id = localStorage.getItem('theme-id')
    mode = localStorage.getItem('theme-mode')
    legacy = localStorage.getItem('theme')
  } catch {
    // Private browsing or disabled storage must not prevent theme changes.
  }
  const theme = validTheme(id ?? undefined) ?? 'default'
  const savedMode = mode ?? legacy
  if ((id && !validTheme(id)) || (savedMode && !validMode(savedMode))) {
    return { theme: 'default', mode: systemMode() }
  }
  const requested = validMode(savedMode ?? undefined) ?? systemMode()
  const entry = THEMES.find((item) => item.id === theme)!
  return {
    theme,
    mode: entry.modes.some((allowed) => allowed === requested)
      ? requested
      : entry.modes[0],
  }
}

let current: Selection =
  typeof document === 'undefined'
    ? { theme: 'default', mode: 'light' }
    : {
        theme: validTheme(document.documentElement.dataset.theme) ?? 'default',
        mode: validMode(document.documentElement.dataset.mode) ?? systemMode(),
      }
const listeners = new Set<() => void>()
const serverSelection: Selection = { theme: 'default', mode: 'light' }

function updateMeta() {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg')
    .trim()
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  )
  if (color) meta?.setAttribute('content', color)
}

function apply(selection: Selection, persist: boolean, animate = false) {
  const commit = () => {
    document.documentElement.dataset.theme = selection.theme
    document.documentElement.dataset.mode = selection.mode
    current = selection
    updateMeta()
    listeners.forEach((listener) => listener())
    if (persist) {
      try {
        localStorage.setItem('theme-id', selection.theme)
        localStorage.setItem('theme-mode', selection.mode)
      } catch {
        // Still apply the selection when storage is unavailable.
      }
    }
  }
  if (
    animate &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    document.documentElement.classList.add('theme-changing')
    if ('startViewTransition' in document) {
      const transition = document.startViewTransition(commit)
      void transition.finished.finally(() => {
        document.documentElement.classList.remove('theme-changing')
      })
    } else {
      commit()
      window.setTimeout(() => {
        document.documentElement.classList.remove('theme-changing')
      }, 250)
    }
  } else {
    commit()
  }
}

if (typeof window !== 'undefined') {
  // The inline head script has already set the same attributes before CSS loads.
  updateMeta()
  try {
    if (
      !localStorage.getItem('theme-mode') &&
      !localStorage.getItem('theme-id')
    ) {
      const legacy = validMode(localStorage.getItem('theme') ?? undefined)
      if (legacy) {
        localStorage.setItem('theme-id', 'default')
        localStorage.setItem('theme-mode', legacy)
      }
    }
  } catch {
    // Storage can be blocked even when DOM theming works.
  }
  window.addEventListener('storage', (event) => {
    if (['theme-id', 'theme-mode', 'theme'].includes(event.key ?? '')) {
      apply(fromStorage(), false)
    }
  })
}

export function useTheme() {
  const { theme, mode } = useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => current,
    () => serverSelection,
  )
  const entry = THEMES.find((item) => item.id === theme)!
  return {
    theme,
    mode,
    canToggleMode: entry.modes.length > 1,
    setTheme(id: ThemeId) {
      const target = THEMES.find((item) => item.id === id)!
      apply(
        {
          theme: id,
          mode: target.modes.some((allowed) => allowed === mode)
            ? mode
            : target.modes[0],
        },
        true,
        true,
      )
    },
    toggleMode() {
      if (entry.modes.length < 2) return
      apply({ theme, mode: mode === 'dark' ? 'light' : 'dark' }, true, true)
    },
  }
}
