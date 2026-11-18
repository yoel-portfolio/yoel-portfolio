import { useState } from 'react'
import { personalSkills, technicalSkills } from '../data/portfolioData'
import { translations, type Language } from '../i18n'
import { ArchitectureIllustration } from './ArchitectureIllustration'
import { LottieWorkflow } from './LottieWorkflow'

type SkillFilter = 'all' | 'technical' | 'personal'

export function SkillsSection({ lang }: { lang: Language }) {
  const [filter, setFilter] = useState<SkillFilter>('all')
  const t = translations[lang].skills

  const showTechnical = filter === 'all' || filter === 'technical'
  const showPersonal = filter === 'all' || filter === 'personal'

  return (
    <section id="habilidades" aria-labelledby="skills-title" className="skills-section scroll-mt-8">
      <div className="section-header-row">
        <div>
          <p className="eyebrow section-eyebrow">
            <span aria-hidden="true">{t.eyebrowNum}</span> {t.eyebrowLabel}
          </p>
          <h2 id="skills-title">{t.title}</h2>
          <p className="section-intro">{t.intro}</p>
        </div>

        <div className="filter-group" role="group" aria-label={t.filterAria}>
          {(
            [
              { id: 'all', label: t.filterAll },
              { id: 'technical', label: t.filterTechnical },
              { id: 'personal', label: t.filterPersonal },
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
      </div>

      {showTechnical && (
        <div className="skills-block">
          <h3 className="subsection-heading">{t.technicalHeading}</h3>
          <div className="skills-grid">
            {technicalSkills.map((skill) => (
              <article key={skill.id} className="skill-card">
                <p className="skill-category">{skill.category[lang]}</p>
                <p className="skill-tech-summary">{skill.technologies}</p>
                <p className="skill-description">{skill.application[lang]}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {showPersonal && (
        <div className="skills-block">
          <h3 className="subsection-heading">{t.personalHeading}</h3>
          <ul className="personal-skills-grid">
            {personalSkills.map((item) => (
              <li key={item.id} className="personal-skill-card">
                <p className="personal-skill-title">{item.title[lang]}</p>
                <p className="personal-skill-desc">{item.description[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="visuals-row">
        <ArchitectureIllustration lang={lang} />
        <LottieWorkflow lang={lang} />
      </div>
    </section>
  )
}
