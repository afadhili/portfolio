export type Mode = 'light' | 'dark'

export const THEMES = [
  {
    id: 'default',
    label: 'AIFadh',
    modes: ['light', 'dark'],
    swatch: ['#8b8bff', '#ff7ab0', '#09090b'],
  },
  {
    id: 'catppuccin',
    label: 'Catppuccin',
    modes: ['light', 'dark'],
    swatch: ['#cba6f7', '#f5c2e7', '#1e1e2e'],
  },
  {
    id: 'gruvbox',
    label: 'Gruvbox',
    modes: ['light', 'dark'],
    swatch: ['#fe8019', '#d3869b', '#282828'],
  },
  {
    id: 'dracula',
    label: 'Dracula',
    modes: ['dark'],
    swatch: ['#bd93f9', '#ff79c6', '#282a36'],
  },
  {
    id: 'nord',
    label: 'Nord',
    modes: ['light', 'dark'],
    swatch: ['#88c0d0', '#b48ead', '#2e3440'],
  },
  {
    id: 'kanagawa',
    label: 'Kanagawa',
    modes: ['light', 'dark'],
    swatch: ['#7e9cd8', '#d27e99', '#1f1f28'],
  },
  {
    id: 'rosepine',
    label: 'Rosé Pine',
    modes: ['light', 'dark'],
    swatch: ['#c4a7e7', '#ebbcba', '#1f1d2e'],
  },
  {
    id: 'tokyonight',
    label: 'Tokyo Night',
    modes: ['dark'],
    swatch: ['#7aa2f7', '#bb9af7', '#1a1b26'],
  },
] as const satisfies readonly {
  id: string
  label: string
  modes: readonly Mode[]
  swatch: readonly [accent: string, accent2: string, bg: string]
}[]

export type ThemeId = (typeof THEMES)[number]['id']
