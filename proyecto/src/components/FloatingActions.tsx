import { useEffect, useState } from 'react'
import { translations, type Language } from '../i18n'
import { Icon } from './Icon'

const whatsappBaseUrl = 'https://wa.me/50683904194'

export function FloatingActions({ lang }: { lang: Language }) {
  const t = translations[lang].floating
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [waOpen, setWaOpen] = useState(false)
  const [waMessage, setWaMessage] = useState<string>(t.whatsappDefaultMessage)

  useEffect(() => {
    setWaMessage((prev) => {
      const esDefault = translations.es.floating.whatsappDefaultMessage
      const enDefault = translations.en.floating.whatsappDefaultMessage
      if (prev === esDefault || prev === enDefault) {
        return t.whatsappDefaultMessage
      }
      return prev
    })
  }, [t.whatsappDefaultMessage])

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 320)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!waOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setWaOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [waOpen])

  function scrollToTop() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  const encodedText = encodeURIComponent(waMessage.trim())
  const waHref = encodedText ? `${whatsappBaseUrl}?text=${encodedText}` : whatsappBaseUrl

  return (
    <div className="floating-dock">
      {waOpen && (
        <div
          id="whatsapp-quick-panel"
          role="dialog"
          aria-label={t.whatsappPanelTitle}
          className="wa-panel"
        >
          <div className="wa-panel-header">
            <div>
              <p className="wa-panel-title">{t.whatsappPanelTitle}</p>
              <p className="wa-panel-number">{t.whatsappNumberLabel}</p>
            </div>
            <button
              type="button"
              className="wa-panel-close"
              aria-label={t.whatsappPanelClose}
              onClick={() => setWaOpen(false)}
            >
              <Icon name="close" />
            </button>
          </div>

          <div className="wa-panel-body">
            <label htmlFor="wa-message-input" className="wa-panel-label">
              {t.whatsappMessageLabel}
            </label>
            <textarea
              id="wa-message-input"
              rows={3}
              className="wa-panel-textarea"
              value={waMessage}
              onChange={(event) => setWaMessage(event.target.value)}
            />
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button wa-panel-send inline-flex items-center"
            >
              <Icon name="whatsapp" />
              <span>{t.whatsappSendCta}</span>
              <Icon name="arrow" />
            </a>
          </div>
        </div>
      )}

      <div className="floating-buttons-row">
        {showScrollTop && (
          <button
            type="button"
            className="floating-btn floating-scrolltop"
            aria-label={t.scrollTopAria}
            title={t.scrollTopTitle}
            onClick={scrollToTop}
          >
            <Icon name="chevronUp" />
          </button>
        )}

        <button
          type="button"
          className="floating-btn floating-whatsapp"
          aria-expanded={waOpen}
          aria-controls="whatsapp-quick-panel"
          aria-label={t.whatsappAria}
          title={t.whatsappTitle}
          onClick={() => setWaOpen((prev) => !prev)}
        >
          <Icon name="whatsapp" />
          <span className="floating-wa-label">{t.whatsappTitle}</span>
        </button>
      </div>
    </div>
  )
}
