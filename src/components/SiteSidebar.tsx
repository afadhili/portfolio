import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'
import { ThemePicker } from '../theme/ThemePicker'
import { CommandPalette } from './CommandPalette'
import { links } from '../content/links'

const navigation = [
  { id: 'about', label: 'About', number: '01', icon: '⌂' },
  { id: 'work', label: 'Projects', number: '02', icon: '▦' },
  { id: 'beyond', label: 'Beyond the code', number: '03', icon: '✳' },
  { id: 'journey', label: 'Journey', number: '04', icon: '◇' },
  { id: 'contact', label: 'Contact', number: '05', icon: '✉' },
  { id: 'writing', label: 'Articles', number: '—', icon: '✎' },
] as const

function Logo() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-monogram">
        a<span>i</span>f<span className="brand-monogram__dot">.</span>
      </span>
    </span>
  )
}

export function SiteSidebar() {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [active, setActive] = useState('')
  const pathname = useLocation({ select: (location) => location.pathname })
  const [localTime, setLocalTime] = useState('')
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const lastScroll = useRef(0)
  const lastG = useRef(0)

  useEffect(() => {
    document.documentElement.classList.toggle('sidebar-collapsed', collapsed)
    try {
      localStorage.setItem('sidebar-collapsed', String(collapsed))
    } catch {
      // The sidebar still works when storage is unavailable.
    }
  }, [collapsed])

  useEffect(() => {
    function updateTime() {
      setLocalTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date()),
      )
    }
    updateTime()
    const timer = window.setInterval(updateTime, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function updateProgress() {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0)
      setScrolled(window.scrollY > 600)
      const delta = window.scrollY - lastScroll.current
      if (Math.abs(delta) > 6) {
        setNavVisible(window.scrollY < 160 || delta < 0)
        lastScroll.current = window.scrollY
      }
    }
    lastScroll.current = window.scrollY
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [pathname])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((value) => !value)
      }
      if (event.key === 'Escape') setOpen(false)
      const target = event.target
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable) ||
        document.querySelector('[role="dialog"]')
      )
        return
      if (event.key.toLowerCase() === 'g') lastG.current = Date.now()
      else if (
        event.key.toLowerCase() === 'p' &&
        Date.now() - lastG.current < 800
      ) {
        lastG.current = 0
        window.location.assign('/#work')
      } else lastG.current = 0
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null)
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="mobile-scroll-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <header className="mobile-bar">
        <Link
          to="/"
          className="brand"
          aria-label="AIFadh home"
          onClick={() => setOpen(false)}
        >
          <Logo />
          <span className="brand-name">
            AIFadh<span className="brand-period">.</span>
          </span>
        </Link>
        <div className="mobile-actions">
          <ThemePicker />
          <ThemeToggle />
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-controls="site-sidebar"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </header>
      {open && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        id="site-sidebar"
        className={`site-sidebar${open ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}
      >
        <div
          className="sidebar-progress"
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="sidebar-top">
          <div className="sidebar-brand-row">
            <Link
              to="/"
              className="brand"
              aria-label="AIFadh home"
              onClick={() => setOpen(false)}
            >
              <Logo />
              <span className="brand-text">
                <strong>
                  AIFadh<span className="brand-period">.</span>
                </strong>
                <small>DEVELOPER & CREATOR</small>
              </span>
            </Link>
            <button
              type="button"
              className="sidebar-collapse-toggle"
              aria-label={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
              aria-controls="site-sidebar"
              aria-expanded={!collapsed}
              title={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
              onClick={() => setCollapsed(!collapsed)}
            >
              <span aria-hidden="true">{collapsed ? '»' : '«'}</span>
            </button>
          </div>
          <div className="sidebar-rule" />
          <span className="sidebar-label">EXPLORE</span>
          <nav className="sidebar-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.id === 'writing' ? '/articles' : '/'}
                hash={item.id === 'writing' ? undefined : item.id}
                activeOptions={{
                  includeHash: true,
                  exact: item.id !== 'writing',
                }}
                data-scroll-active={
                  pathname === '/' && active === item.id ? 'true' : undefined
                }
                aria-current={
                  item.id === 'writing' && pathname.startsWith('/articles')
                    ? 'page'
                    : pathname === '/' && active === item.id
                      ? 'location'
                      : undefined
                }
                onClick={() => setOpen(false)}
                aria-label={item.label}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-number">{item.number}</span>
                <span className="sidebar-nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="sidebar-nav-label">{item.label}</span>
                <span className="nav-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </nav>
          <button
            className="palette-trigger"
            type="button"
            aria-label="Quick search"
            title={collapsed ? 'Quick search' : undefined}
            onClick={() => {
              setOpen(false)
              setPaletteOpen(true)
            }}
          >
            <span className="palette-trigger-icon" aria-hidden="true">
              ⌕
            </span>
            <span className="palette-trigger-label">Quick search</span>
            <kbd>⌘ K</kbd>
          </button>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-presence">
            <div>
              <span className="eyebrow">LOCAL TIME / GRESIK</span>
              <strong>
                {localTime || '—'} <small>WIB</small>
              </strong>
            </div>
            <span className="sidebar-presence__status">
              <span className="status-dot" aria-hidden="true" /> Building &
              learning
            </span>
            <div className="sidebar-socials">
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile (opens in new tab)"
              >
                GitHub ↗
              </a>
              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile (opens in new tab)"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>
          {/* <div className="sidebar-note">
            <span className="sidebar-note-icon" aria-hidden="true">
              ✳
            </span>
            <p>Making thoughtful things for the web, inside and out.</p>
          </div>*/}
          <div className="sidebar-controls">
            <span>APPEARANCE</span>
            <ThemePicker />
            <ThemeToggle />
          </div>
          <span className="sidebar-signoff">
            © {new Date().getFullYear()} AIFADH
          </span>
        </div>
      </aside>
      <nav
        className={`mobile-bottom-nav${navVisible && !open ? '' : ' is-hidden'}`}
        aria-label="Mobile quick navigation"
        inert={!navVisible || open}
      >
        {(
          [
            { id: 'about', label: 'About', icon: '⌂' },
            { id: 'work', label: 'Projects', icon: '▦' },
            { id: 'writing', label: 'Articles', icon: '✎' },
            { id: 'contact', label: 'Contact', icon: '✉' },
          ] as const
        ).map((item) => (
          <Link
            key={item.id}
            to={item.id === 'writing' ? '/articles' : '/'}
            hash={item.id === 'writing' ? undefined : item.id}
            activeOptions={{ includeHash: true, exact: item.id !== 'writing' }}
            className="mobile-bottom-nav__link"
            data-scroll-active={
              pathname === '/' && active === item.id ? 'true' : undefined
            }
            aria-label={item.label}
          >
            <span aria-hidden="true">{item.icon}</span>
            <small>{item.label}</small>
          </Link>
        ))}
      </nav>
      {scrolled && (
        <button
          type="button"
          className="mobile-back-to-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                .matches
                ? 'auto'
                : 'smooth',
            })
          }
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  )
}
