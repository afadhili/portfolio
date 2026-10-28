import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import '../styles/features.css'
import '../styles/credibility.css'
import '../styles/github-projects.css'
import '../styles/section-polish.css'
import '../styles/mobile.css'
import NotFound from '#/components/NotFound'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  useEffect(() => {
    const loader = document.getElementById('site-loader')
    if (!loader) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const elapsed = performance.now() - Number(loader.dataset.started || 0)
    const timer = window.setTimeout(
      () => {
        document.getElementById('app')?.removeAttribute('inert')
        loader.classList.add('is-exiting')
        if (reducedMotion) {
          loader.remove()
        } else {
          loader.addEventListener('transitionend', () => loader.remove(), {
            once: true,
          })
          window.setTimeout(() => loader.remove(), 300)
        }
      },
      reducedMotion ? 0 : Math.max(0, 1800 - elapsed),
    )
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <HeadContent />
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
