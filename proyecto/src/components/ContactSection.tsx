import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { content } from '../content'
import { githubProfile } from '../data/portfolioData'
import { translations, type Language } from '../i18n'
import { Icon } from './Icon'

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'

interface FormValues {
  name: string
  email: string
  message: string
  honeypot?: string
}

const contactEndpoint = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim() || ''

export function ContactSection({ lang }: { lang: Language }) {
  const t = translations[lang].contact
  const [submitState, setSubmitState] = useState<SubmissionState>('idle')

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t.validationNameRequired),
        email: z.string().trim().email(t.validationEmailInvalid),
        message: z.string().trim().min(10, t.validationMessageRequired),
        honeypot: z.string().optional(),
      }),
    [t.validationEmailInvalid, t.validationMessageRequired, t.validationNameRequired],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '', honeypot: '' },
  })

  async function onSubmit(values: FormValues) {
    if (values.honeypot) return

    if (!contactEndpoint) {
      // Nunca simular envío exitoso cuando falta configurar el endpoint real.
      setSubmitState('unconfigured')
      return
    }

    setSubmitState('submitting')
    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      })

      if (!response.ok) {
        setSubmitState('error')
        return
      }

      setSubmitState('success')
      reset()
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <section id="contacto" aria-labelledby="contact-title" className="contact-section-full scroll-mt-8">
      <div className="contact-layout-grid">
        <div className="contact-info-col">
          <p className="eyebrow section-eyebrow">
            <span aria-hidden="true">{t.eyebrowNum}</span> {t.eyebrowLabel}
          </p>
          <h2 id="contact-title">{t.title}</h2>
          <p className="contact-intro">{t.intro}</p>

          <div className="contact-links">
            <a className="contact-link group" href={content.email.href}>
              <span className="contact-icon"><Icon name="mail" /></span>
              <span className="contact-details">
                <span className="contact-label">{t.emailLabel}</span>
                <span>{content.email.label}</span>
              </span>
              <Icon name="arrow" className="contact-arrow" />
            </a>

            <a className="contact-link group" href={content.whatsapp.href} target="_blank" rel="noopener noreferrer">
              <span className="contact-icon"><Icon name="whatsapp" /></span>
              <span className="contact-details">
                <span className="contact-label">
                  {t.whatsappLabel} <span className="sr-only">{t.newTabSr}</span>
                </span>
                <span>{content.whatsapp.label}</span>
              </span>
              <Icon name="arrow" className="contact-arrow" />
            </a>

            <a className="contact-link group" href={content.linkedin.href} target="_blank" rel="noopener noreferrer">
              <span className="contact-icon"><Icon name="linkedin" /></span>
              <span className="contact-details">
                <span className="contact-label">
                  {t.linkedinLabel} <span className="sr-only">{t.newTabSr}</span>
                </span>
                <span>{content.linkedin.label}</span>
              </span>
              <Icon name="arrow" className="contact-arrow" />
            </a>

            <a className="contact-link group" href={githubProfile.href} target="_blank" rel="noopener noreferrer">
              <span className="contact-icon"><Icon name="github" /></span>
              <span className="contact-details">
                <span className="contact-label">
                  {t.githubLabel} <span className="sr-only">{t.newTabSr}</span>
                </span>
                <span>{t.githubValue}</span>
              </span>
              <Icon name="arrow" className="contact-arrow" />
            </a>
          </div>
        </div>

        <div className="contact-form-card">
          <h3 className="contact-form-title">{t.formTitle}</h3>
          <p className="contact-form-subtitle">{t.formSubtitle}</p>

          <form className="contact-form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="contact-hp">Website</label>
              <input id="contact-hp" type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
            </div>

            <div className="form-field">
              <label htmlFor="contact-name" className="form-label">{t.nameLabel}</label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                placeholder={t.namePlaceholder}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                className="form-input"
                {...register('name')}
              />
              {errors.name && (
                <p id="contact-name-error" role="alert" className="form-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="contact-email" className="form-label">{t.emailInputLabel}</label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className="form-input"
                {...register('email')}
              />
              {errors.email && (
                <p id="contact-email-error" role="alert" className="form-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="contact-message" className="form-label">{t.messageLabel}</label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder={t.messagePlaceholder}
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                className="form-input form-textarea"
                {...register('message')}
              />
              {errors.message && (
                <p id="contact-message-error" role="alert" className="form-error">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="primary-button form-submit-btn inline-flex items-center"
              disabled={submitState === 'submitting'}
            >
              <span>{submitState === 'submitting' ? t.submitSending : t.submitIdle}</span>
              <Icon name="arrow" />
            </button>

            {submitState === 'success' && (
              <div role="status" className="form-feedback form-feedback-success">
                <Icon name="check" />
                <p>{t.sendSuccess}</p>
              </div>
            )}

            {submitState === 'error' && (
              <div role="alert" className="form-feedback form-feedback-error">
                <Icon name="alert" />
                <p>{t.sendError}</p>
              </div>
            )}

            {submitState === 'unconfigured' && (
              <div role="status" className="form-feedback form-feedback-pending">
                <Icon name="alert" />
                <div>
                  <p className="form-feedback-heading">{t.endpointPendingTitle}</p>
                  <p>{t.endpointPendingBody}</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
