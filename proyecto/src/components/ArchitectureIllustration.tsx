import { translations, type Language } from '../i18n'

export function ArchitectureIllustration({ lang }: { lang: Language }) {
  const t = translations[lang].skills

  return (
    <figure className="visual-card">
      <div className="visual-card-header">
        <div>
          <p className="visual-card-title">{t.diagramTitle}</p>
          <p className="visual-card-subtitle">{t.diagramSubtitle}</p>
        </div>
      </div>
      <svg
        className="arch-svg"
        viewBox="0 0 520 190"
        role="img"
        aria-label={t.diagramAria}
      >
        <defs>
          <pattern id="yoel-arch-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--color-grid)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="520" height="190" rx="8" fill="var(--color-background)" />
        <rect x="0" y="0" width="520" height="190" rx="8" fill="url(#yoel-arch-grid)" opacity="0.65" />

        {/* Líneas de flujo */}
        <path d="M 142 74 L 194 74" stroke="var(--color-brand)" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 326 74 L 378 74" stroke="var(--color-accent)" strokeWidth="2" />
        <path d="M 260 112 L 260 132" stroke="var(--color-brand)" strokeWidth="2" />

        {/* Nodo Frontend */}
        <rect x="22" y="40" width="120" height="68" rx="6" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="1.5" />
        <circle cx="38" cy="56" r="4" fill="var(--color-accent)" />
        <text x="48" y="60" fontSize="11" fontWeight="600" fontFamily="var(--font-heading)" fill="var(--color-text)">FRONTEND</text>
        <text x="34" y="80" fontSize="10" fontFamily="var(--font-body)" fill="var(--color-text-secondary)">React · Angular</text>
        <text x="34" y="95" fontSize="10" fontFamily="var(--font-body)" fill="var(--color-text-secondary)">HTML · CSS</text>

        {/* Nodo Backend */}
        <rect x="194" y="40" width="132" height="68" rx="6" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="1.5" />
        <circle cx="210" cy="56" r="4" fill="var(--color-brand)" />
        <text x="220" y="60" fontSize="11" fontWeight="600" fontFamily="var(--font-heading)" fill="var(--color-text)">BACKEND</text>
        <text x="206" y="80" fontSize="10" fontFamily="var(--font-body)" fill="var(--color-text-secondary)">Spring Boot · Node</text>
        <text x="206" y="95" fontSize="10" fontFamily="var(--font-body)" fill="var(--color-text-secondary)">C# · Java · JS</text>

        {/* Nodo Bases de datos */}
        <rect x="378" y="40" width="120" height="68" rx="6" fill="var(--color-surface)" stroke="var(--color-accent-text)" strokeWidth="1.5" />
        <circle cx="394" cy="56" r="4" fill="var(--color-accent)" />
        <text x="404" y="60" fontSize="11" fontWeight="600" fontFamily="var(--font-heading)" fill="var(--color-text)">SQL / DATA</text>
        <text x="390" y="80" fontSize="10" fontFamily="var(--font-body)" fill="var(--color-text-secondary)">PostgreSQL</text>
        <text x="390" y="95" fontSize="10" fontFamily="var(--font-body)" fill="var(--color-text-secondary)">MySQL</text>

        {/* Barra inferior Docker & CI/CD */}
        <rect x="120" y="132" width="280" height="36" rx="6" fill="var(--color-brand-soft)" stroke="var(--color-brand)" strokeWidth="1.2" />
        <text x="260" y="154" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="var(--font-heading)" fill="var(--color-brand-text)">DOCKER · CI/CD PIPELINE</text>
      </svg>
    </figure>
  )
}
