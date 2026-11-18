import { useEffect, useState } from 'react'

export type Language = 'es' | 'en'

const langStorageKey = 'yoel-lang'

function savedLanguage(): Language | null {
  try {
    const value = localStorage.getItem(langStorageKey)
    return value === 'es' || value === 'en' ? value : null
  } catch {
    return null
  }
}

export function useLanguage() {
  const [lang, setLangState] = useState<Language>(() => {
    const initial = savedLanguage()
    if (initial) return initial
    return document.documentElement.lang === 'en' ? 'en' : 'es'
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translations[lang].meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', translations[lang].meta.description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'es' ? 'es_CR' : 'en_US')
  }, [lang])

  useEffect(() => {
    const synchronizeTabs = (event: StorageEvent) => {
      if (event.key !== langStorageKey && event.key !== null) return
      const saved = savedLanguage()
      if (saved) setLangState(saved)
    }
    window.addEventListener('storage', synchronizeTabs)
    return () => window.removeEventListener('storage', synchronizeTabs)
  }, [])

  function setLang(nextLang: Language) {
    setLangState(nextLang)
    try {
      localStorage.setItem(langStorageKey, nextLang)
    } catch {
      /* Funciona sin persistencia si el navegador bloquea localStorage. */
    }
  }

  return { lang, setLang }
}

export const translations = {
  es: {
    meta: {
      title: 'Yoel | Portafolio en construcción',
      description: 'Soy Yoel, ingeniero de software con enfoque en desarrollo full-stack. Conocé mi perfil y contactame. Mis proyectos estarán disponibles próximamente.',
    },
    skipLink: 'Saltar al contenido',
    header: {
      homeAria: 'Yoel, inicio',
      navAria: 'Navegación principal',
      navProfile: 'Mi perfil',
      navSkills: 'Habilidades',
      navProjects: 'Proyectos',
      navContact: 'Contacto',
      langGroupAria: 'Selector de idioma',
      langEsTitle: 'Cambiar idioma a español',
      langEnTitle: 'Switch language to English',
      themeAria: 'Modo oscuro',
      themeToLight: 'Activar modo claro',
      themeToDark: 'Activar modo oscuro',
    },
    hero: {
      statusBadge: 'UN NUEVO ESPACIO, EN CAMINO',
      greetingPrefix: 'Hola, soy ',
      titleMain: 'Portafolio',
      titleHighlight: 'en construcción',
      slogan: 'Código que impulsa ideas',
      announcement: 'Pronto vas a encontrar acá mis proyectos y las ideas que estoy convirtiendo en software.',
      primaryCta: 'Conversemos',
      secondaryCta: 'Conocé mi perfil',
      projectsCta: 'Ver proyectos',
      cvButtonReady: 'Descargar CV (ES)',
      cvPendingLabel: 'CV PDF (ES) — pendiente de adjuntar',
      cvPendingNote: 'El archivo PDF aprobado aún no está adjunto en el repositorio.',
      artworkCaption: 'DE LA IDEA AL CÓDIGO',
      artworkNote: 'IDEAS EN MOVIMIENTO',
    },
    profile: {
      eyebrowNum: '01 /',
      eyebrowLabel: 'MI PERFIL',
      title: 'Software con propósito.',
      copy: 'Ingeniero de software con enfoque en desarrollo full-stack. Desarrollo aplicaciones con C#, Java y JavaScript, utilizando React, Angular, Node.js y Spring Boot. Trabajo con HTML, CSS y bases de datos PostgreSQL y MySQL, e integro Docker y CI/CD para facilitar la entrega de software.',
      techListAria: 'Tecnologías que utilizo',
      aboutTitle: 'Sobre mí',
      aboutCopy: 'Valoro el trabajo en equipo, las ideas de los demás y el cumplimiento de mis compromisos. Organizo mi trabajo y mantengo la calma bajo presión para definir prioridades y resolver problemas. Me motiva aprender y mejorar lo que hago.',
      missionTitle: 'Misión',
      visionTitle: 'Visión',
      valuesTitle: 'Valores',
    },
    skills: {
      eyebrowNum: '02 /',
      eyebrowLabel: 'HABILIDADES',
      title: 'Habilidades técnicas y personales',
      intro: 'Desarrollo aplicaciones web en frontend y backend, trabajo con bases de datos relacionales e integro herramientas para la entrega de software.',
      filterAria: 'Filtrar habilidades por tipo',
      filterAll: 'Todas',
      filterTechnical: 'Técnicas',
      filterPersonal: 'Personales',
      technicalHeading: 'Habilidades técnicas',
      personalHeading: 'Habilidades personales',
      diagramTitle: 'Ilustración conceptual del flujo full-stack',
      diagramSubtitle: 'Representación vectorial propia de arquitectura web y entrega continua.',
      diagramAria: 'Ilustración vectorial conceptual: interfaz React o Angular conectada a API Spring Boot o Node.js, bases de datos PostgreSQL o MySQL y entrega con Docker y CI/CD.',
      lottieTitle: 'Animación de flujo en tiempo real (JSON)',
      lottieSubtitle: 'Reproducción vectorial ligera basada en Lottie JSON.',
      lottiePlay: 'Reproducir animación',
      lottiePause: 'Pausar animación',
      lottieStaticFallback: 'Vista estática por preferencia de movimiento reducido.',
    },
    projects: {
      eyebrowNum: '03 /',
      eyebrowLabel: 'PROYECTOS',
      title: 'Proyectos verificados.',
      intro: 'Repositorios públicos revisados directamente. Cada ficha muestra el alcance técnico real, las tecnologías utilizadas y la participación confirmada, sin métricas ni demos ficticias.',
      filterAria: 'Filtrar proyectos por categoría',
      filterAll: 'Todos',
      filterBackend: 'Backend',
      filterFrontend: 'Frontend',
      filterFullstack: 'Full-Stack',
      countLabel: (shown: number, total: number) => `Mostrando ${shown} de ${total} proyectos`,
      participationLabel: 'Participación confirmada',
      statusLabel: 'Estado real',
      conceptualTag: 'Ilustración conceptual',
      openDetail: 'Ver ficha completa',
      repoLink: 'Repositorio en GitHub',
      newTabSr: '(abre una pestaña nueva)',
      modalClose: 'Cerrar ficha',
      modalCloseAria: 'Cerrar detalle del proyecto',
      modalHighlightsLabel: 'Aspectos técnicos comprobados',
    },
    contact: {
      eyebrowNum: '04 /',
      eyebrowLabel: 'CONTACTO',
      title: 'Hablemos.',
      intro: 'Toda buena idea empieza con una conversación.',
      emailLabel: 'Correo electrónico',
      whatsappLabel: 'WhatsApp',
      linkedinLabel: 'LinkedIn',
      githubLabel: 'GitHub',
      githubValue: 'yoel-portfolio/yoel-portfolio',
      newTabSr: '(abre una pestaña nueva)',
      formTitle: 'Enviame un mensaje',
      formSubtitle: 'Formulario preparado para envío directo en alojamiento estático.',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Tu nombre',
      emailInputLabel: 'Correo electrónico',
      emailPlaceholder: 'nombre@ejemplo.com',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Contame brevemente sobre la oportunidad o proyecto...',
      submitIdle: 'Enviar mensaje',
      submitSending: 'Enviando...',
      validationNameRequired: 'Ingresá tu nombre (mínimo 2 caracteres).',
      validationEmailInvalid: 'Ingresá un correo electrónico válido.',
      validationMessageRequired: 'Escribí un mensaje de al menos 10 caracteres.',
      endpointPendingTitle: 'Envío externo pendiente de configuración',
      endpointPendingBody: 'Falta configurar la variable pública VITE_CONTACT_ENDPOINT (por ejemplo Formspree) para confirmar envíos reales desde el sitio estático. Podés escribirme directo por correo o WhatsApp.',
      sendSuccess: 'Mensaje enviado correctamente. Gracias por contactarme; te responderé pronto.',
      sendError: 'No se pudo confirmar el envío con el servicio externo. Intentá de nuevo o escribime a yoerojas03@gmail.com.',
    },
    floating: {
      scrollTopAria: 'Volver arriba',
      scrollTopTitle: 'Volver arriba',
      whatsappAria: 'Abrir acceso rápido a WhatsApp',
      whatsappTitle: 'WhatsApp',
      whatsappPanelTitle: 'Escribir por WhatsApp',
      whatsappPanelClose: 'Cerrar panel de WhatsApp',
      whatsappNumberLabel: 'Número directo: +506 8390 4194',
      whatsappMessageLabel: 'Mensaje inicial (editable)',
      whatsappDefaultMessage: 'Hola Yoel, vi tu portafolio y me gustaría conversar sobre una oportunidad.',
      whatsappSendCta: 'Continuar en WhatsApp',
    },
    footer: {
      rights: (year: number, name: string) => `© ${year} ${name}. Todos los derechos reservados.`,
      note: 'Aprender. Construir. Mejorar.',
    },
  },
  en: {
    meta: {
      title: 'Yoel | Portfolio Under Construction',
      description: 'I am Yoel, a software engineer focused on full-stack development. Explore my profile, skills, verified projects, and contact details.',
    },
    skipLink: 'Skip to content',
    header: {
      homeAria: 'Yoel, home',
      navAria: 'Main navigation',
      navProfile: 'Profile',
      navSkills: 'Skills',
      navProjects: 'Projects',
      navContact: 'Contact',
      langGroupAria: 'Language selector',
      langEsTitle: 'Cambiar idioma a español',
      langEnTitle: 'Switch language to English',
      themeAria: 'Dark mode',
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
    },
    hero: {
      statusBadge: 'A NEW SPACE, ON THE WAY',
      greetingPrefix: "Hi, I'm ",
      titleMain: 'Portfolio',
      titleHighlight: 'under construction',
      slogan: 'Code that drives ideas',
      announcement: 'Soon you will find my projects here along with the ideas I am turning into software.',
      primaryCta: "Let's talk",
      secondaryCta: 'View my profile',
      projectsCta: 'Explore projects',
      cvButtonReady: 'Download Resume (EN)',
      cvPendingLabel: 'Resume PDF (EN) — attachment pending',
      cvPendingNote: 'The approved PDF file is not attached to the repository yet.',
      artworkCaption: 'FROM IDEA TO CODE',
      artworkNote: 'IDEAS IN MOTION',
    },
    profile: {
      eyebrowNum: '01 /',
      eyebrowLabel: 'MY PROFILE',
      title: 'Software with purpose.',
      copy: 'Software engineer focused on full-stack development. I build applications with C#, Java, and JavaScript using React, Angular, Node.js, and Spring Boot. I work with HTML, CSS, PostgreSQL, and MySQL databases, and integrate Docker and CI/CD to streamline software delivery.',
      techListAria: 'Technologies I use',
      aboutTitle: 'About me',
      aboutCopy: 'I value teamwork, others’ ideas, and honoring my commitments. I organize my work and stay calm under pressure to set priorities and solve problems. I am motivated by learning and continuously improving what I do.',
      missionTitle: 'Mission',
      visionTitle: 'Vision',
      valuesTitle: 'Values',
    },
    skills: {
      eyebrowNum: '02 /',
      eyebrowLabel: 'SKILLS',
      title: 'Technical and Personal Skills',
      intro: 'I build frontend and backend web applications, work with relational databases, and integrate tools for software delivery.',
      filterAria: 'Filter skills by type',
      filterAll: 'All',
      filterTechnical: 'Technical',
      filterPersonal: 'Personal',
      technicalHeading: 'Technical skills',
      personalHeading: 'Personal skills',
      diagramTitle: 'Conceptual full-stack flow illustration',
      diagramSubtitle: 'Original vector representation of web architecture and continuous delivery.',
      diagramAria: 'Conceptual vector diagram: React or Angular interface connected to a Spring Boot or Node.js API, PostgreSQL or MySQL databases, and delivery via Docker and CI/CD.',
      lottieTitle: 'Real-time pipeline animation (JSON)',
      lottieSubtitle: 'Lightweight vector playback powered by Lottie JSON.',
      lottiePlay: 'Play animation',
      lottiePause: 'Pause animation',
      lottieStaticFallback: 'Static view enabled due to reduced-motion preference.',
    },
    projects: {
      eyebrowNum: '03 /',
      eyebrowLabel: 'PROJECTS',
      title: 'Verified Projects.',
      intro: 'Public repositories reviewed directly. Each card presents real technical scope, technologies used, and confirmed contribution without fabricated metrics or demos.',
      filterAria: 'Filter projects by category',
      filterAll: 'All',
      filterBackend: 'Backend',
      filterFrontend: 'Frontend',
      filterFullstack: 'Full-Stack',
      countLabel: (shown: number, total: number) => `Showing ${shown} of ${total} projects`,
      participationLabel: 'Confirmed contribution',
      statusLabel: 'Current status',
      conceptualTag: 'Conceptual illustration',
      openDetail: 'View details',
      repoLink: 'GitHub Repository',
      newTabSr: '(opens in a new tab)',
      modalClose: 'Close details',
      modalCloseAria: 'Close project detail modal',
      modalHighlightsLabel: 'Verified technical highlights',
    },
    contact: {
      eyebrowNum: '04 /',
      eyebrowLabel: 'CONTACT',
      title: "Let's talk.",
      intro: 'Every good idea starts with a conversation.',
      emailLabel: 'Email',
      whatsappLabel: 'WhatsApp',
      linkedinLabel: 'LinkedIn',
      githubLabel: 'GitHub',
      githubValue: 'yoel-portfolio/yoel-portfolio',
      newTabSr: '(opens in a new tab)',
      formTitle: 'Send me a message',
      formSubtitle: 'Contact form prepared for static hosting delivery.',
      nameLabel: 'Full name',
      namePlaceholder: 'Your name',
      emailInputLabel: 'Email address',
      emailPlaceholder: 'name@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Briefly share the role, team, or project details...',
      submitIdle: 'Send message',
      submitSending: 'Sending...',
      validationNameRequired: 'Please enter your name (at least 2 characters).',
      validationEmailInvalid: 'Please enter a valid email address.',
      validationMessageRequired: 'Please write a message of at least 10 characters.',
      endpointPendingTitle: 'External form endpoint pending configuration',
      endpointPendingBody: 'The public VITE_CONTACT_ENDPOINT variable (e.g., Formspree) must be configured before confirming live static submissions. You can reach me directly via email or WhatsApp.',
      sendSuccess: 'Message sent successfully. Thank you for reaching out; I will reply soon.',
      sendError: 'Could not confirm delivery with the external service. Please try again or email yoerojas03@gmail.com.',
    },
    floating: {
      scrollTopAria: 'Back to top',
      scrollTopTitle: 'Back to top',
      whatsappAria: 'Open WhatsApp quick panel',
      whatsappTitle: 'WhatsApp',
      whatsappPanelTitle: 'Message on WhatsApp',
      whatsappPanelClose: 'Close WhatsApp panel',
      whatsappNumberLabel: 'Direct number: +506 8390 4194',
      whatsappMessageLabel: 'Initial message (editable)',
      whatsappDefaultMessage: "Hi Yoel, I reviewed your portfolio and I'd like to connect about an opportunity.",
      whatsappSendCta: 'Continue on WhatsApp',
    },
    footer: {
      rights: (year: number, name: string) => `© ${year} ${name}. All rights reserved.`,
      note: 'Learn. Build. Improve.',
    },
  },
} as const
