import type { CSSProperties } from 'react'
import { personalSkills, technicalSkills } from '../data/portfolioData'
import { translations, type Language } from '../i18n'

export function SkillsSection({ lang }: { lang: Language }) {
  const t = translations[lang].skills

  return (
    <section id="habilidades" aria-labelledby="skills-title" className="skills-section scroll-mt-8">
      <div className="section-header-row" data-reveal>
        <div>
          <p className="eyebrow section-eyebrow">
            <span aria-hidden="true">{t.eyebrowNum}</span> {t.eyebrowLabel}
          </p>
          <h2 id="skills-title">{t.title}</h2>
        </div>
      </div>

      <div className="skills-block skills-block-technical">
        <div className="subsection-header" data-reveal>
          <h3 className="subsection-heading">{t.technicalHeading}</h3>
        </div>
        <div className="skills-grid">
          {technicalSkills.map((skill, index) => (
            <article
              key={skill.id}
              className="skill-card"
              data-reveal
              style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
            >
              <p className="skill-category">{skill.category[lang]}</p>
              <p className="skill-tech-summary">{skill.technologies}</p>
              <p className="skill-description">{skill.application[lang]}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="skills-block skills-block-personal">
        <div className="subsection-header" data-reveal>
          <h3 className="subsection-heading">{t.personalHeading}</h3>
        </div>
        <ul className="personal-skills-grid">
          {personalSkills.map((item, index) => (
            <li
              key={item.id}
              className="personal-skill-card"
              data-reveal
              style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties}
            >
              <p className="personal-skill-title">{item.title[lang]}</p>
              <p className="personal-skill-desc">{item.description[lang]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

