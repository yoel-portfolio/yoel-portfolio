import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { verifiedProjects, type VerifiedProject } from '../data/portfolioData'
import { translations, type Language } from '../i18n'
import { Icon } from './Icon'

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      element.getClientRects().length > 0,
  )
}

function ProjectConceptualSvg({ project, lang }: { project: VerifiedProject; lang: Language }) {
  const positions = [
    { x: 6, cx: 54 },
    { x: 117, cx: 165 },
    { x: 228, cx: 276 },
  ] as const

  return (
    <div className="project-diagram-wrap">
      <svg
        className="project-diagram-svg"
        viewBox="0 0 330 108"
        role="img"
        aria-label={project.diagramCaption[lang]}
      >
        <rect x="0" y="0" width="330" height="108" rx="8" fill="var(--color-background)" />
        <line
          className="project-diagram-flow"
          x1="102"
          y1="54"
          x2="117"
          y2="54"
          stroke="var(--color-brand)"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <polygon points="117,54 111,50 111,58" fill="var(--color-brand)" />
        <line
          className="project-diagram-flow"
          x1="213"
          y1="54"
          x2="228"
          y2="54"
          stroke="var(--color-brand)"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <polygon points="228,54 222,50 222,58" fill="var(--color-brand)" />

        {project.diagramNodes.map((node, idx) => {
          const { x, cx } = positions[idx]
          const isMiddle = idx === 1
          const isLast = idx === 2
          const stroke = isMiddle
            ? 'var(--color-brand)'
            : isLast
              ? 'var(--color-accent-text)'
              : 'var(--color-border)'
          const strokeWidth = idx === 0 ? '1.3' : '1.6'
          const titleFill = isMiddle ? 'var(--color-brand-text)' : 'var(--color-text)'

          return (
            <g key={node.title}>
              <rect
                className={isMiddle ? 'project-diagram-node project-diagram-node-mid' : 'project-diagram-node'}
                x={x}
                y="22"
                width="96"
                height="64"
                rx="8"
                fill="var(--color-surface)"
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              {node.subtitle ? (
                <>
                  <text
                    x={cx}
                    y="49"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="var(--font-heading)"
                    fill={titleFill}
                  >
                    {node.title}
                  </text>
                  <text
                    x={cx}
                    y="67"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="500"
                    fontFamily="var(--font-body)"
                    fill="var(--color-text-secondary)"
                  >
                    {node.subtitle}
                  </text>
                </>
              ) : (
                <text
                  x={cx}
                  y="58"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="var(--font-heading)"
                  fill={titleFill}
                >
                  {node.title}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function ProjectsSection({ lang }: { lang: Language }) {
  const [selectedProject, setSelectedProject] = useState<VerifiedProject | null>(null)
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const shouldRestoreFocusRef = useRef(false)
  const t = translations[lang].projects

  useEffect(() => {
    if (!selectedProject) {
      if (shouldRestoreFocusRef.current) {
        shouldRestoreFocusRef.current = false
        triggerButtonRef.current?.focus()
      }
      return
    }

    const appRoot = document.getElementById('root')
    const previousInert = appRoot?.inert ?? false
    const previousAriaHidden = appRoot?.getAttribute('aria-hidden') ?? null
    const previousOverflow = document.body.style.overflow

    if (appRoot) {
      appRoot.inert = true
      appRoot.setAttribute('aria-hidden', 'true')
    }
    document.body.style.overflow = 'hidden'

    const focusTarget = closeButtonRef.current ?? modalRef.current
    focusTarget?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
        return
      }

      if (event.key === 'Tab') {
        const container = modalRef.current
        if (!container) return
        const focusables = getFocusableElements(container)
        if (focusables.length === 0) {
          event.preventDefault()
          container.focus()
          return
        }

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null

        if (event.shiftKey) {
          if (!active || active === first || !container.contains(active)) {
            event.preventDefault()
            last.focus()
          }
        } else if (!active || active === last || !container.contains(active)) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      const container = modalRef.current
      const target = event.target as Node | null
      if (container && target && !container.contains(target)) {
        const focusables = getFocusableElements(container)
        ;(focusables[0] ?? container).focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
      if (appRoot) {
        appRoot.inert = previousInert
        if (previousAriaHidden === null) {
          appRoot.removeAttribute('aria-hidden')
        } else {
          appRoot.setAttribute('aria-hidden', previousAriaHidden)
        }
      }
      document.body.style.overflow = previousOverflow
    }
  }, [selectedProject])

  function openModal(project: VerifiedProject, buttonElement: HTMLButtonElement) {
    triggerButtonRef.current = buttonElement
    shouldRestoreFocusRef.current = false
    setSelectedProject(project)
  }

  function closeModal() {
    shouldRestoreFocusRef.current = true
    setSelectedProject(null)
  }

  return (
    <section id="proyectos" aria-labelledby="projects-title" className="projects-section scroll-mt-8">
      <div className="section-header-row" data-reveal>
        <div>
          <p className="eyebrow section-eyebrow">
            <span aria-hidden="true">{t.eyebrowNum}</span> {t.eyebrowLabel}
          </p>
          <h2 id="projects-title">{t.title}</h2>
          <p className="section-intro">{t.intro}</p>
        </div>
      </div>

      <div className="projects-grid">
        {verifiedProjects.map((project, index) => (
          <article
            key={project.id}
            className="project-card"
            data-reveal
            style={{ '--reveal-delay': `${index * 110}ms` } as CSSProperties}
          >
            <ProjectConceptualSvg project={project} lang={lang} />

            <div className="project-card-body">
              <h3 className="project-title">{project.title[lang]}</h3>
              <p className="project-summary">{project.shortSummary[lang]}</p>

              <ul className="project-tech-list" aria-label={project.title[lang]}>
                {project.coreTechnologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>

              <p className="project-participation project-participation-brief">
                <strong>{t.participationLabel}:</strong> {project.shortParticipation[lang]}
              </p>

              <div className="project-actions">
                <button
                  type="button"
                  className="project-detail-btn"
                  onClick={(e) => openModal(project, e.currentTarget)}
                >
                  {t.openDetail}
                </button>
                <a
                  className="project-repo-link"
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="github" />
                  <span>{t.repoLink}</span>
                  <span className="sr-only">{t.newTabSr}</span>
                  <Icon name="arrow" className="project-arrow" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedProject &&
        createPortal(
          <div
            className="project-modal-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) closeModal()
            }}
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              className="project-modal"
            >
              <div className="project-modal-header">
                <div className="project-modal-heading-group">
                  <p className="eyebrow">{t.eyebrowLabel}</p>
                  <h3 id="project-modal-title" className="project-modal-title">
                    {selectedProject.title[lang]}
                  </h3>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="modal-close-btn"
                  aria-label={t.modalCloseAria}
                  onClick={closeModal}
                >
                  <Icon name="close" />
                </button>
              </div>

              <div
                className="project-modal-body-scroll"
                tabIndex={0}
                aria-label={selectedProject.title[lang]}
              >
                <div className="project-modal-body">
                  <ProjectConceptualSvg project={selectedProject} lang={lang} />
                  <p className="project-modal-desc">{selectedProject.description[lang]}</p>

                  <div className="project-modal-block">
                    <p className="project-modal-label">{t.modalHighlightsLabel}</p>
                    <ul className="project-highlights">
                      {selectedProject.highlights[lang].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="project-modal-block">
                    <p className="project-modal-label">{t.participationLabel}</p>
                    <p className="project-modal-text">{selectedProject.participation[lang]}</p>
                  </div>

                  <div className="project-modal-block">
                    <p className="project-modal-label">{t.statusLabel}</p>
                    <p className="project-modal-text">{selectedProject.status[lang]}</p>
                  </div>

                  <ul className="project-tech-list">
                    {selectedProject.technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="project-modal-footer">
                <a
                  className="primary-button inline-flex items-center"
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="github" />
                  <span>{t.repoLink}</span>
                  <span className="sr-only">{t.newTabSr}</span>
                  <Icon name="arrow" />
                </a>
                <button type="button" className="project-detail-btn" onClick={closeModal}>
                  {t.modalClose}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
