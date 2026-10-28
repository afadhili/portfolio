import { readFileSync } from 'node:fs'

import { THEMES } from '../src/theme/themes'

const css = readFileSync(
  new URL('../src/styles/tokens.css', import.meta.url),
  'utf8',
)
type RGB = [number, number, number]
const blocks = [
  ...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g),
].map(([, selectors, body]) => ({
  selectors: selectors.split(',').map((s) => s.trim()),
  values: Object.fromEntries(
    [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, key, value]) => [
      key,
      value.trim(),
    ]),
  ),
}))

function mix(a: RGB, b: RGB, weight: number): RGB {
  return a.map((v, i) => v * weight + b[i] * (1 - weight)) as RGB
}
function rgb(value: string): RGB {
  if (!/^#[\da-f]{6}$/i.test(value)) throw Error(`Unsupported color: ${value}`)
  return [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)) as RGB
}
function luminance(color: RGB): number {
  const [r, g, b] = color.map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

let failed = false
const columns = [
  'Text/bg',
  'Text/surface',
  'Muted/surface',
  'On-accent',
  'Accent/surface',
]
function row(name: string, values: string[]): string {
  return `${name.padEnd(22)}${values.map((value) => value.padStart(16)).join('')}`
}
console.log(row('Theme / mode', columns))
console.log(
  row(
    'Minimum',
    columns.map(() => '4.50'),
  ),
)
for (const theme of THEMES)
  for (const mode of theme.modes) {
    const selector = `:root[data-theme='${theme.id}']`
    if (
      theme.id !== 'default' &&
      !blocks.some((block) => block.selectors.includes(selector))
    )
      throw Error(`No CSS palette for ${theme.id}`)
    if (
      mode === 'dark' &&
      theme.modes.length > 1 &&
      !blocks.some((block) =>
        block.selectors.includes(`${selector}[data-mode='dark']`),
      )
    )
      throw Error(`No dark CSS palette for ${theme.id}`)
    const values: Record<string, string> = {}
    for (const block of blocks) {
      if (
        block.selectors.some(
          (rule) =>
            rule === ':root' ||
            rule === `:root[data-theme='${theme.id}']` ||
            rule === `:root[data-theme='${theme.id}'][data-mode='${mode}']` ||
            (theme.id !== 'default' &&
              rule === ":root[data-theme]:not([data-theme='default'])"),
        )
      ) {
        Object.assign(values, block.values)
      }
    }
    function resolve(name: string, stack: string[] = []): RGB {
      if (stack.includes(name))
        throw Error(`Cyclic token: ${[...stack, name].join(' → ')}`)
      const value = values[name]
      if (!value) throw Error(`Missing ${name} in ${theme.id}/${mode}`)
      const next = [...stack, name]
      if (value.startsWith('#')) return rgb(value)
      const variable = /^var\((--[\w-]+)\)$/.exec(value)
      if (variable) return resolve(variable[1], next)
      const mixed =
        /^color-mix\(in srgb, var\((--[\w-]+)\) (\d+)%, (var\((--[\w-]+)\)|transparent)\)$/.exec(
          value,
        )
      if (mixed) {
        const base = resolve(mixed[1], next)
        // A transparent stop is composited over the active surface for this check.
        const other =
          mixed[3] === 'transparent'
            ? resolve('--surface', next)
            : resolve(mixed[4], next)
        return mix(base, other, Number(mixed[2]) / 100)
      }
      throw Error(`Unsupported ${name}: ${value}`)
    }
    const surface = resolve('--surface')
    const checks = [
      ['text/bg', contrast(resolve('--text'), resolve('--bg')), 4.5],
      ['text/surface', contrast(resolve('--text'), surface), 4.5],
      ['muted/surface', contrast(resolve('--text-muted'), surface), 4.5],
      ['on-accent', contrast(resolve('--on-accent'), resolve('--accent')), 4.5],
      ['accent/surface', contrast(resolve('--accent'), surface), 4.5],
    ] as const
    const misses = checks.filter(([, ratio, minimum]) => ratio < minimum)
    failed ||= misses.length > 0
    console.log(
      `${row(
        `${theme.label} / ${mode}`,
        checks.map(([, ratio]) => ratio.toFixed(2)),
      )}${misses.length ? `  FAIL: ${misses.map(([name]) => name).join(', ')}` : ''}`,
    )
  }
if (failed) process.exitCode = 1
