import type { CSSProperties } from 'react'
import { content } from './content'
import { cvConfig, missionVisionValues } from './data/portfolioData'
import { translations, useLanguage, type Language } from './i18n'
import { Icon } from './components/Icon'
import { SkillsSection } from './components/SkillsSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ContactSection } from './components/ContactSection'
import { FloatingActions } from './components/FloatingActions'
import { useScrollReveal } from './useScrollReveal'
import { useTheme } from './useTheme'

const brandPath = `${import.meta.env.BASE_URL}brand/`

function BrandArtwork({ lang }: { lang: Language }) {
  const t = translations[lang].hero
  return (
    <div className="brand-artwork" aria-hidden="true">
      <div className="artwork-grid" />
      <div className="artwork-diagonal artwork-diagonal-back" />
      <div className="artwork-diagonal artwork-diagonal-front" />
      <span className="artwork-caption">{t.artworkCaption}</span>
      <span className="artwork-cross artwork-cross-top">+</span>
      <span className="artwork-cross artwork-cross-bottom">+</span>
      <div className="symbol-frame">
        <span className="symbol-corner corner-top" />
        <img src={`${brandPath}favicon-yoel.svg`} width="224" height="224" alt="" className="hero-symbol" />
        <span className="symbol-corner corner-bottom" />
      </div>
      <span className="artwork-note"><span /> {t.artworkNote}</span>
      <span className="artwork-coordinate">Y / 01</span>
    </div>
  )
}

function Profile({ lang }: { lang: Language }) {
  const t = translations[lang].profile
  const mvv = missionVisionValues[lang]

  return (
    <section id="perfil" aria-labelledby="profile-title" className="profile-section profile-section-full scroll-mt-8">
      <div className="profile-top-grid" data-reveal>
        <div>
          <p className="eyebrow section-eyebrow"><span aria-hidden="true">{t.eyebrowNum}</span> {t.eyebrowLabel}</p>
          <h2 id="profile-title">{t.title}</h2>
          <p className="profile-copy">{t.copy}</p>
          <ul className="tech-list flex flex-wrap gap-2" aria-label={t.techListAria}>
            {content.technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
        </div>
        <div className="profile-about">
          <h3>{t.aboutTitle}</h3>
          <p className="about-copy">{t.aboutCopy}</p>
        </div>
      </div>

      <div className="profile-mvv-grid">
        <article className="mvv-card" data-reveal style={{ '--reveal-delay': '0ms' } as CSSProperties}>
          <h3 className="mvv-title">{t.missionTitle}</h3>
          <p className="mvv-copy">{mvv.mission}</p>
        </article>
        <article className="mvv-card" data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties}>
          <h3 className="mvv-title">{t.visionTitle}</h3>
          <p className="mvv-copy">{mvv.vision}</p>
        </article>
        <article className="mvv-card mvv-card-values" data-reveal style={{ '--reveal-delay': '150ms' } as CSSProperties}>
          <h3 className="mvv-title">{t.valuesTitle}</h3>
          <ul className="values-list">
            {mvv.values.map((val) => (
              <li key={val.title}>
                <strong>{val.title}:</strong> {val.description}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export function App() {
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLanguage()
  useScrollReveal()
  const t = translations[lang]
  const activeCv = cvConfig[lang]

  return (
    <div className="site-shell" id="inicio">
      <a href="#contenido" className="skip-link">{t.skipLink}</a>

      <header className="site-header page-width flex items-center">
        <a href="#inicio" className="brand-link" aria-label={t.header.homeAria}>
          <img
            src={`${brandPath}logo-yoel-${theme === 'dark' ? 'oscuro' : 'claro'}.svg`}
            alt={content.name}
            width="310"
            height="88"
            className="brand-logo"
          />
        </a>

        <nav aria-label={t.header.navAria} className="main-nav flex items-center">
          <a href="#perfil">{t.header.navProfile}</a>
          <a href="#habilidades">{t.header.navSkills}</a>
          <a href="#proyectos">{t.header.navProjects}</a>
          <a href="#contacto">{t.header.navContact} <Icon name="arrow" /></a>
        </nav>

        <div className="header-controls">
          <div className="lang-toggle" role="group" aria-label={t.header.langGroupAria}>
            <button
              type="button"
              className="lang-btn"
              aria-pressed={lang === 'es'}
              title={t.header.langEsTitle}
              onClick={() => setLang('es')}
            >
              ES
            </button>
            <button
              type="button"
              className="lang-btn"
              aria-pressed={lang === 'en'}
              title={t.header.langEnTitle}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>

          <div className="theme-control">
            <button
              type="button"
              className="theme-toggle"
              aria-label={t.header.themeAria}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? t.header.themeToLight : t.header.themeToDark}
              onClick={toggleTheme}
            >
              <span className="theme-option theme-option-light"><Icon name="sun" /></span>
              <span className="theme-option theme-option-dark"><Icon name="moon" /></span>
            </button>
          </div>
        </div>
      </header>

      <main id="contenido" tabIndex={-1} className="page-width">
        <section className="hero grid items-center" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="status-badge inline-flex items-center">
              <span className="status-dot" aria-hidden="true" /> {t.hero.statusBadge}
            </p>
            <p className="hero-greeting">
              {t.hero.greetingPrefix}{content.name}<span className="brand-period">.</span>
            </p>
            <h1 id="hero-title">
              {t.hero.titleMain} <span>{t.hero.titleHighlight}</span>
            </h1>
            <p className="hero-slogan">{t.hero.slogan}</p>
            <p className="hero-description">{t.hero.announcement}</p>

            <div className="hero-actions hero-cv-actions flex flex-wrap items-center">
              {activeCv.available ? (
                <a
                  className="primary-button cv-control cv-control-ready inline-flex items-center"
                  href={`${import.meta.env.BASE_URL}${activeCv.path}`}
                  download
                >
                  <Icon name="download" />
                  <span>{t.hero.cvButtonReady}</span>
                </a>
              ) : (
                <span className="cv-control" title={t.hero.cvPendingNote}>
                  <Icon name="download" />
                  <span>{t.hero.cvPendingLabel}</span>
                </span>
              )}
            </div>
          </div>

          <BrandArtwork lang={lang} />
        </section>

        <Profile lang={lang} />
        <SkillsSection lang={lang} />
        <ProjectsSection lang={lang} />
        <ContactSection lang={lang} />
      </main>

      <footer className="site-footer page-width flex flex-wrap items-center justify-between">
        <p>{t.footer.rights(new Date().getFullYear(), content.name)}</p>
        <p className="footer-note inline-flex items-center">
          <Icon name="code" /> {t.footer.note}
        </p>
      </footer>

      <FloatingActions lang={lang} />
    </div>
  )
}
