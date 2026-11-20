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
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', translations[lang].meta.ogTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', translations[lang].meta.ogDescription)
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
      title: 'Yoel | Ingeniero de software full-stack',
      description: 'Soy Yoel Alexander Rojas Arguedas, ingeniero de software full-stack. Conocé mi perfil, habilidades técnicas, proyectos y medios de contacto.',
      ogTitle: 'Yoel | Portafolio profesional',
      ogDescription: 'Ingeniero de software con enfoque en desarrollo full-stack: Java, Spring Boot, React, TypeScript, PostgreSQL y Docker.',
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
      statusBadge: 'DISPONIBLE PARA OPORTUNIDADES',
      greetingPrefix: 'Hola, soy ',
      titleMain: 'Ingeniero de software',
      titleHighlight: 'full-stack',
      slogan: 'Código que impulsa ideas',
      announcement: 'Diseño y construyo aplicaciones web mantenibles en frontend y backend, con bases de datos relacionales e integración continua.',
      primaryCta: 'Conversemos',
      secondaryCta: 'Conocé mi perfil',
      projectsCta: 'Ver proyectos',
      cvButtonReady: 'Descargar CV',
      cvPendingLabel: 'CV en PDF (ES) — próximamente',
      cvPendingNote: 'El currículum en PDF estará disponible pronto.',
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
      title: 'Proyectos.',
      intro: 'Explorá mis proyectos, las tecnologías que utilicé y mi aporte en cada uno.',
      filterAria: 'Filtrar proyectos por categoría',
      filterAll: 'Todos',
      filterBackend: 'Backend',
      filterFrontend: 'Frontend',
      filterFullstack: 'Full-Stack',
      countLabel: (shown: number, total: number) => `Mostrando ${shown} de ${total} proyectos`,
      participationLabel: 'Mi aporte',
      statusLabel: 'Estado',
      conceptualTag: 'Ilustración conceptual',
      openDetail: 'Ver ficha completa',
      repoLink: 'Repositorio en GitHub',
      newTabSr: '(abre una pestaña nueva)',
      modalClose: 'Cerrar ficha',
      modalCloseAria: 'Cerrar detalle del proyecto',
      modalHighlightsLabel: 'Aspectos destacados',
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
      formSubtitle: 'Escribime sobre una vacante, un equipo o un proyecto y te responderé pronto.',
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
      endpointPendingTitle: 'El formulario estará disponible pronto',
      endpointPendingBody: 'Por ahora podés escribirme por correo o WhatsApp.',
      sendSuccess: 'Mensaje enviado correctamente. Gracias por contactarme; te responderé pronto.',
      sendError: 'No se pudo enviar tu mensaje en este momento. Intentá de nuevo o escribime a yoerojas03@gmail.com.',
      sendUnconfirmed: 'No pudimos confirmar el envío. También podés contactarme por correo o WhatsApp.',
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
      title: 'Yoel | Full-Stack Software Engineer',
      description: 'I am Yoel Alexander Rojas Arguedas, a full-stack software engineer. Explore my profile, technical skills, projects, and contact details.',
      ogTitle: 'Yoel | Professional Portfolio',
      ogDescription: 'Software engineer focused on full-stack development: Java, Spring Boot, React, TypeScript, PostgreSQL, and Docker.',
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
      statusBadge: 'OPEN TO OPPORTUNITIES',
      greetingPrefix: "Hi, I'm ",
      titleMain: 'Full-stack',
      titleHighlight: 'software engineer',
      slogan: 'Code that drives ideas',
      announcement: 'I design and build maintainable frontend and backend web applications with relational databases and continuous integration.',
      primaryCta: "Let's talk",
      secondaryCta: 'View my profile',
      projectsCta: 'Explore projects',
      cvButtonReady: 'Download CV',
      cvPendingLabel: 'Resume PDF (EN) — coming soon',
      cvPendingNote: 'The PDF resume will be available soon.',
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
      title: 'Projects.',
      intro: 'Explore my projects, the technologies I used, and my contribution to each one.',
      filterAria: 'Filter projects by category',
      filterAll: 'All',
      filterBackend: 'Backend',
      filterFrontend: 'Frontend',
      filterFullstack: 'Full-Stack',
      countLabel: (shown: number, total: number) => `Showing ${shown} of ${total} projects`,
      participationLabel: 'My contribution',
      statusLabel: 'Status',
      conceptualTag: 'Conceptual illustration',
      openDetail: 'View details',
      repoLink: 'GitHub Repository',
      newTabSr: '(opens in a new tab)',
      modalClose: 'Close details',
      modalCloseAria: 'Close project detail modal',
      modalHighlightsLabel: 'Key highlights',
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
      formSubtitle: 'Write to me about a role, team, or project and I will get back to you soon.',
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
      endpointPendingTitle: 'The contact form will be available soon',
      endpointPendingBody: 'For now, you can reach me directly by email or WhatsApp.',
      sendSuccess: 'Message sent successfully. Thank you for reaching out; I will reply soon.',
      sendError: 'Your message could not be sent right now. Please try again or email yoerojas03@gmail.com.',
      sendUnconfirmed: 'We couldn’t confirm that your message was sent. You can also reach me by email or WhatsApp.',
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
