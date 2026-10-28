const logos = {
  TypeScript: 'typescript.svg',
  React: 'react.svg',
  Express: 'express.svg',
  'Socket.IO': 'socketdotio.svg',
  PostgreSQL: 'postgresql.svg',
  Drizzle: 'drizzle.svg',
  Rust: 'rust.svg',
  Python: 'python.svg',
  Linux: 'linux.svg',
  Git: 'git.svg',
  ArchLinux: 'archlinux.svg',
  Zed: 'zedindustries.svg',
  Foot: 'foot.svg',
  zsh: 'zsh.svg',
  Catppuccin: 'catppuccin.webp',
} as const

type ToolName = keyof typeof logos

export function ToolLogo({ name }: { name: ToolName }) {
  const darkInk = name === 'Express' || name === 'Socket.IO' || name === 'Rust'
  return (
    <img
      className={`tool-logo${darkInk ? ' tool-logo--dark-ink' : ''}`}
      src={`/tool-logos/${logos[name]}`}
      alt=""
      aria-hidden="true"
      width="18"
      height="18"
      decoding="async"
    />
  )
}
