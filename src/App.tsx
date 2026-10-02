import { content } from './content'
import { Icon } from './components/Icon'
import { useTheme } from './useTheme'

const brandPath = `${import.meta.env.BASE_URL}brand/`

function BrandArtwork() {
  return (
    <div className="brand-artwork" aria-hidden="true">
      <div className="artwork-grid" />
      <div className="artwork-diagonal artwork-diagonal-back" />
      <div className="artwork-diagonal artwork-diagonal-front" />
      <span className="artwork-caption">DE LA IDEA AL CÓDIGO</span>
      <span className="artwork-cross artwork-cross-top">+</span>
      <span className="artwork-cross artwork-cross-bottom">+</span>
      <div className="symbol-frame">
        <span className="symbol-corner corner-top" />
        <img src={`${brandPath}favicon-yoel.svg`} width="224" height="224" alt="" className="hero-symbol" />
        <span className="symbol-corner corner-bottom" />
      </div>
      <span className="artwork-note"><span /> IDEAS EN MOVIMIENTO</span>
      <span className="artwork-coordinate">Y / 01</span>
    </div>
  )
}

function Profile() {
  return (
    <section id="perfil" aria-labelledby="profile-title" className="profile-section scroll-mt-8">
      <p className="eyebrow section-eyebrow"><span aria-hidden="true">01 /</span> MI PERFIL</p>
      <h2 id="profile-title">Software con propósito.</h2>
      <p className="profile-copy">{content.profile}</p>
      <ul className="tech-list flex flex-wrap gap-2" aria-label="Tecnologías que utilizo">
        {content.technologies.map((technology) => <li key={technology}>{technology}</li>)}
      </ul>
    </section>
  )
}

function Contact() {
  return (
    <section id="contacto" aria-labelledby="contact-title" className="contact-section scroll-mt-8">
      <p className="eyebrow section-eyebrow"><span aria-hidden="true">02 /</span> CONTACTO</p>
      <h2 id="contact-title">Hablemos.</h2>
      <p className="contact-intro">Toda buena idea empieza con una conversación.</p>
      <div className="contact-links">
        <a className="contact-link group" href={content.email.href}>
          <span className="contact-icon"><Icon name="mail" /></span>
          <span className="contact-details"><span className="contact-label">Correo electrónico</span><span>{content.email.label}</span></span>
          <Icon name="arrow" className="contact-arrow" />
        </a>
        <a className="contact-link group" href={content.whatsapp.href} target="_blank" rel="noopener noreferrer">
          <span className="contact-icon"><Icon name="whatsapp" /></span>
          <span className="contact-details"><span className="contact-label">WhatsApp <span className="sr-only">(abre una pestaña nueva)</span></span><span>{content.whatsapp.label}</span></span>
          <Icon name="arrow" className="contact-arrow" />
        </a>
      </div>
    </section>
  )
}

export function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="site-shell" id="inicio">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <header className="site-header page-width flex items-center">
        <a href="#inicio" className="brand-link" aria-label="Yoel, inicio">
          <img src={`${brandPath}logo-yoel-${theme === 'dark' ? 'oscuro' : 'claro'}.svg`} alt="Yoel" width="310" height="88" className="brand-logo" />
        </a>
        <nav aria-label="Navegación principal" className="main-nav flex items-center">
          <a href="#perfil">Mi perfil</a>
          <a href="#contacto">Contacto <Icon name="arrow" /></a>
        </nav>
        <div className="theme-control">
          <button type="button" className="theme-toggle" aria-label="Modo oscuro" aria-pressed={theme === 'dark'} title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'} onClick={toggleTheme}>
            <span className="theme-option theme-option-light"><Icon name="sun" /></span>
            <span className="theme-option theme-option-dark"><Icon name="moon" /></span>
          </button>
        </div>
      </header>

      <main id="contenido" tabIndex={-1} className="page-width">
        <section className="hero grid items-center" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="status-badge inline-flex items-center"><span className="status-dot" aria-hidden="true" /> UN NUEVO ESPACIO, EN CAMINO</p>
            <p className="hero-greeting">Hola, soy {content.name}<span className="brand-period">.</span></p>
            <h1 id="hero-title">Portafolio <span>en construcción</span></h1>
            <p className="hero-slogan">{content.slogan}</p>
            <p className="hero-description">{content.announcement}</p>
            <div className="hero-actions flex flex-wrap items-center">
              <a className="primary-button inline-flex items-center" href={content.email.href}>Conversemos <Icon name="arrow" /></a>
              <a className="secondary-link inline-flex items-center" href="#perfil">Conocé mi perfil <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <BrandArtwork />
        </section>

        <div className="details-grid grid">
          <Profile />
          <Contact />
        </div>
      </main>

      <footer className="site-footer page-width flex flex-wrap items-center justify-between">
        <p>© {new Date().getFullYear()} {content.name}. Todos los derechos reservados.</p>
        <p className="footer-note inline-flex items-center"><Icon name="code" /> Aprender. Construir. Mejorar.</p>
      </footer>
    </div>
  )
}
