import { useEffect, useState } from 'react'
import {
  fallbackGithubData,
  githubCacheDuration,
  loadGithubData,
  loadGithubEvents,
  readGithubCache,
} from '../content/github-api'
import type { GithubData } from '../content/github-api'

export function useGithubActivity() {
  const [data, setData] = useState<GithubData>(fallbackGithubData)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = readGithubCache()
    if (cached) setData(cached)
    let active = true
    let activityVisible = false
    function refresh() {
      void loadGithubData()
        .then((next) => {
          if (active) {
            setData(next)
            setError(next.source === 'snapshot')
            setLoading(false)
          }
        })
        .catch(() => {
          if (active) {
            setError(true)
            setLoading(false)
          }
        })
    }
    function onFocus() {
      if (activityVisible) refreshEvents()
      else refresh()
    }
    refresh()
    function refreshEvents() {
      void loadGithubData()
        .then(loadGithubEvents)
        .then((next) => {
          if (active) {
            setData(next)
            setError(next.source === 'snapshot')
            setLoading(false)
          }
        })
        .catch(() => {
          if (active) setError(true)
        })
    }
    const activity = document.querySelector('.activity-card')
    let observer: IntersectionObserver | undefined
    if (activity && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect()
            activityVisible = true
            refreshEvents()
          }
        },
        { rootMargin: '250px' },
      )
      observer.observe(activity)
    } else if (activity) {
      activityVisible = true
      refreshEvents()
    }
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        if (activityVisible) refreshEvents()
        else refresh()
      }
    }, githubCacheDuration)
    window.addEventListener('focus', onFocus)
    return () => {
      active = false
      observer?.disconnect()
      window.clearInterval(timer)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return { data, error, loading }
}
