import { useEffect, useRef, useState } from 'react'
import { verifiedProjects, type ProjectCategory, type VerifiedProject } from '../data/portfolioData'
import { translations, type Language } from '../i18n'
import { Icon } from './Icon'

type ProjectFilter = 'all' | ProjectCategory

function ProjectConceptualSvg({ project, tag, lang }: { project: VerifiedProject; tag: string; lang: Language }) {
  return (
    <div className="project-diagram-wrap">
      <span className="project-conceptual-badge">{tag}</span>
      <svg
        className="project-diagram-svg"
        viewBox="0 0 360 100"
        role="img"
        aria-label={project.diagramCaption[lang]}
      >
        <rect x="0" y="0" width="360" height="100" rx="6" fill="var(--color-background)" />
        <line x1="65" y1="50" x2="295" y2="50" stroke="var(--color-brand)" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="14" y="28" width="98" height="44" rx="5" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.2" />
        <rect x="131" y="28" width="98" height="44" rx="5" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="1.4" />
        <rect x="248" y="28" width="98" height="44" rx="5" fill="var(--color-surface)" stroke="var(--color-accent-text)" strokeWidth="1.4" />
        <text x="63" y="54" textAnchor="middle" fontSize="9.5" fontWeight="500" fontFamily="var(--font-body)" fill="var(--color-text)">{project.diagramNodes[0]}</text>
        <text x="180" y="54" textAnchor="middle" fontSize="9.5" fontWeight="600" fontFamily="var(--font-heading)" fill="var(--color-brand-text)">{project.diagramNodes[1]}</text>
        <text x="297" y="54" textAnchor="middle" fontSize="9.5" fontWeight="500" fontFamily="var(--font-body)" fill="var(--color-text)">{project.diagramNodes[2]}</text>
      </svg>
    </div>
  )
}

export function ProjectsSection({ lang }: { lang: Language }) {
  const [filter, setFilter] = useState<ProjectFilter>('all')
  const [selectedProject, setSelectedProject] = useState<VerifiedProject | null>(null)
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const t = translations[lang].projects

  const filtered = filter === 'all' ? verifiedProjects : verifiedProjects.filter((p) => p.category === filter)

  useEffect(() => {
    if (!selectedProject) return
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject])

  function openModal(project: VerifiedProject, buttonElement: HTMLButtonElement) {
    triggerButtonRef.current = buttonElement
    setSelectedProject(project)
  }

  function closeModal() {
    setSelectedProject(null)
    requestAnimationFrame(() => {
      triggerButtonRef.current?.focus()
    })
  }

  return (
    <section id="proyectos" aria-labelledby="projects-title" className="projects-section scroll-mt-8">
      <div className="section-header-row">
        <div>
          <p className="eyebrow section-eyebrow">
            <span aria-hidden="true">{t.eyebrowNum}</span> {t.eyebrowLabel}
          </p>
          <h2 id="projects-title">{t.title}</h2>
          <p className="section-intro">{t.intro}</p>
        </div>

        <div className="projects-filter-col">
          <div className="filter-group" role="group" aria-label={t.filterAria}>
            {(
              [
                { id: 'all', label: t.filterAll },
                { id: 'backend', label: t.filterBackend },
                { id: 'frontend', label: t.filterFrontend },
                { id: 'fullstack', label: t.filterFullstack },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                className="filter-pill"
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="projects-count" aria-live="polite">
            {t.countLabel(filtered.length, verifiedProjects.length)}
          </p>
        </div>
      </div>

      <div className="projects-grid">
        {filtered.map((project) => (
          <article key={project.id} className="project-card">
            <ProjectConceptualSvg project={project} tag={t.conceptualTag} lang={lang} />

            <div className="project-card-body">
              <h3 className="project-title">{project.title[lang]}</h3>
              <p className="project-summary">{project.shortSummary[lang]}</p>

              <ul className="project-tech-list" aria-label={project.title[lang]}>
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>

              <p className="project-participation">
                <strong>{t.participationLabel}:</strong> {project.participation[lang]}
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

      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="project-modal"
          >
            <div className="project-modal-header">
              <div>
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

            <div className="project-modal-body">
              <ProjectConceptualSvg project={selectedProject} tag={t.conceptualTag} lang={lang} />
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
        </div>
      )}
    </section>
  )
}
