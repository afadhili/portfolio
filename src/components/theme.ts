export type Theme = 'light' | 'dark'

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem('theme', next)
  } catch {
    /* Storage can be unavailable. */
  }
  window.dispatchEvent(new Event('themechange'))
}
