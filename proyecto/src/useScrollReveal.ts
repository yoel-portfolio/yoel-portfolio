import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const root = document.documentElement
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (elements.length === 0) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const revealAll = () => {
      for (const el of elements) {
        el.dataset.revealed = 'true'
      }
      root.classList.remove('has-scroll-reveal')
    }

    if (motionQuery.matches || typeof IntersectionObserver === 'undefined') {
      revealAll()
      return
    }

    root.classList.add('has-scroll-reveal')

    const viewportCutoff = window.innerHeight * 0.94
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.dataset.revealed = 'true'
            observer.unobserve(target)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
    )

    for (const el of elements) {
      if (el.getBoundingClientRect().top < viewportCutoff) {
        el.dataset.revealed = 'true'
      } else {
        observer.observe(el)
      }
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        observer.disconnect()
        revealAll()
      }
    }

    motionQuery.addEventListener?.('change', handleMotionChange)

    return () => {
      observer.disconnect()
      motionQuery.removeEventListener?.('change', handleMotionChange)
      root.classList.remove('has-scroll-reveal')
    }
  }, [])
}
