import { useEffect, useRef, useState } from 'react'
import lottie from 'lottie-web/build/player/lottie_light'
import type { AnimationItem } from 'lottie-web'
import { translations, type Language } from '../i18n'
import { Icon } from './Icon'

const animationPath = `${import.meta.env.BASE_URL}animations/fullstack-flow.json`

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function LottieWorkflow({ lang }: { lang: Language }) {
  const t = translations[lang].skills
  const containerRef = useRef<HTMLDivElement | null>(null)
  const animRef = useRef<AnimationItem | null>(null)
  const [reducedMotion, setReducedMotion] = useState<boolean>(prefersReducedMotion)
  const [isPlaying, setIsPlaying] = useState<boolean>(() => !prefersReducedMotion())
  const [loadFailed, setLoadFailed] = useState<boolean>(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      const reduced = media.matches
      setReducedMotion(reduced)
      if (reduced) {
        animRef.current?.pause()
        setIsPlaying(false)
      }
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let instance: AnimationItem | null = null

    fetch(animationPath)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((animationData) => {
        if (cancelled || !containerRef.current) return
        instance = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: !prefersReducedMotion(),
          animationData,
        })
        animRef.current = instance
        if (prefersReducedMotion()) {
          instance.goToAndStop(45, true)
        }
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true)
      })

    return () => {
      cancelled = true
      instance?.destroy()
      animRef.current = null
    }
  }, [])

  function togglePlayback() {
    const instance = animRef.current
    if (!instance) return
    if (isPlaying) {
      instance.pause()
      setIsPlaying(false)
    } else {
      instance.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className="visual-card">
      <div className="visual-card-header">
        <div>
          <p className="visual-card-title">{t.lottieTitle}</p>
          <p className="visual-card-subtitle">{t.lottieSubtitle}</p>
        </div>
        {!loadFailed && (
          <button
            type="button"
            className="lottie-control-btn"
            aria-pressed={isPlaying}
            aria-label={isPlaying ? t.lottiePause : t.lottiePlay}
            onClick={togglePlayback}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} />
            <span>{isPlaying ? t.lottiePause : t.lottiePlay}</span>
          </button>
        )}
      </div>

      <div className="lottie-stage-wrap">
        {loadFailed ? (
          <svg viewBox="0 0 240 110" className="lottie-fallback-svg" aria-hidden="true">
            <line x1="42" y1="55" x2="198" y2="55" stroke="var(--color-brand)" strokeWidth="3" strokeOpacity="0.45" />
            <rect x="27" y="40" width="30" height="30" rx="7" fill="var(--color-brand-soft)" stroke="var(--color-brand)" strokeWidth="2" />
            <rect x="105" y="40" width="30" height="30" rx="7" fill="var(--color-brand-soft)" stroke="var(--color-brand)" strokeWidth="2" />
            <rect x="183" y="40" width="30" height="30" rx="7" fill="var(--color-brand-soft)" stroke="var(--color-brand)" strokeWidth="2" />
            <circle cx="120" cy="55" r="7" fill="var(--color-accent)" />
          </svg>
        ) : (
          <div
            ref={containerRef}
            className="lottie-stage"
            role="img"
            aria-label={t.lottieTitle}
          />
        )}
        <div className="lottie-labels" aria-hidden="true">
          <span>UI</span>
          <span>API</span>
          <span>DB</span>
        </div>
        {reducedMotion && !isPlaying && (
          <p className="lottie-reduced-note">{t.lottieStaticFallback}</p>
        )}
      </div>
    </div>
  )
}
