import type { Language } from '../i18n'

export const cvConfig = {
  es: { available: true, path: 'cv/cv-yoel-es.pdf' },
  en: { available: true, path: 'cv/cv-yoel-en.pdf' },
} as const

export const githubProfile = {
  label: 'yoel-portfolio/yoel-portfolio',
  href: 'https://github.com/yoel-portfolio/yoel-portfolio',
} as const

export const missionVisionValues: Record<
  Language,
  {
    mission: string
    vision: string
    values: Array<{ title: string; description: string }>
  }
> = {
  es: {
    mission:
      'Desarrollar soluciones de software que resuelvan necesidades de las personas y mejoren los procesos de una empresa, aplicando conocimientos de ingeniería de software, buenas prácticas de programación y trabajo en equipo.',
    vision:
      'Consolidarme como ingeniero de software especializado en desarrollo full-stack, capaz de asumir proyectos de mayor complejidad y contribuir al crecimiento de la empresa mediante aplicaciones confiables, fáciles de mantener y adaptadas a nuevas necesidades.',
    values: [
      { title: 'Responsabilidad', description: 'cumplir los compromisos y comunicar a tiempo cualquier dificultad.' },
      { title: 'Honestidad', description: 'reconocer mis límites, informar errores y presentar avances reales.' },
      { title: 'Respeto', description: 'escuchar otras opiniones y dar retroalimentación constructiva.' },
      { title: 'Colaboración', description: 'compartir conocimientos y apoyar las metas del equipo.' },
      { title: 'Adaptabilidad', description: 'aprender tecnologías y ajustar mi trabajo ante cambios.' },
      { title: 'Compromiso con la calidad', description: 'revisar, probar y documentar el código.' },
    ],
  },
  en: {
    mission:
      'Develop software solutions that address people’s needs and improve business processes by applying software engineering principles, sound programming practices, and teamwork.',
    vision:
      'Grow as a software engineer specialized in full-stack development, capable of taking on increasingly complex projects and contributing to company growth through reliable, maintainable applications adapted to evolving needs.',
    values: [
      { title: 'Responsibility', description: 'honor commitments and communicate any blockers on time.' },
      { title: 'Honesty', description: 'acknowledge my limits, report errors transparently, and show real progress.' },
      { title: 'Respect', description: 'listen to others’ perspectives and offer constructive feedback.' },
      { title: 'Collaboration', description: 'share knowledge and support team goals.' },
      { title: 'Adaptability', description: 'learn new technologies and adjust my work when priorities shift.' },
      { title: 'Commitment to quality', description: 'review, test, and document the code I write.' },
    ],
  },
}

export interface TechnicalSkillItem {
  id: string
  category: Record<Language, string>
  technologies: string
  application: Record<Language, string>
}

export const technicalSkills: TechnicalSkillItem[] = [
  {
    id: 'languages',
    category: { es: 'Lenguajes', en: 'Languages' },
    technologies: 'C#, Java, JavaScript',
    application: {
      es: 'C#, Java y JavaScript: lógica de aplicaciones y desarrollo de funcionalidades.',
      en: 'C#, Java, and JavaScript: application logic and feature development.',
    },
  },
  {
    id: 'frontend',
    category: { es: 'Frontend', en: 'Frontend' },
    technologies: 'HTML, CSS, React, Angular',
    application: {
      es: 'HTML, CSS, React y Angular: estructura, estilos e interfaces web.',
      en: 'HTML, CSS, React, and Angular: structure, styling, and web interfaces.',
    },
  },
  {
    id: 'backend',
    category: { es: 'Backend', en: 'Backend' },
    technologies: 'Node.js, Spring Boot',
    application: {
      es: 'Node.js y Spring Boot: lógica del servidor y servicios para aplicaciones.',
      en: 'Node.js and Spring Boot: server-side logic and application services.',
    },
  },
  {
    id: 'databases',
    category: { es: 'Bases de datos', en: 'Databases' },
    technologies: 'SQL, PostgreSQL, MySQL',
    application: {
      es: 'SQL, PostgreSQL y MySQL: consultas y gestión de datos relacionales.',
      en: 'SQL, PostgreSQL, and MySQL: queries and relational data management.',
    },
  },
  {
    id: 'delivery',
    category: { es: 'Entrega de software', en: 'Software Delivery' },
    technologies: 'Docker, CI/CD',
    application: {
      es: 'Docker y CI/CD: contenedores e integración y entrega continua.',
      en: 'Docker and CI/CD: containerization and continuous integration and delivery.',
    },
  },
]

export const personalSkills: Array<{ id: string; title: Record<Language, string>; description: Record<Language, string> }> = [
  {
    id: 'teamwork',
    title: { es: 'Trabajo en equipo', en: 'Teamwork' },
    description: {
      es: 'colaborar y considerar las ideas de los demás.',
      en: 'collaborate effectively and value teammates’ perspectives.',
    },
  },
  {
    id: 'organization',
    title: { es: 'Organización y responsabilidad', en: 'Organization and accountability' },
    description: {
      es: 'ordenar las tareas y cumplir los compromisos.',
      en: 'structure tasks clearly and fulfill commitments.',
    },
  },
  {
    id: 'prioritization',
    title: { es: 'Priorización bajo presión', en: 'Prioritization under pressure' },
    description: {
      es: 'mantener la calma y atender primero lo importante.',
      en: 'stay calm and focus on what matters most first.',
    },
  },
  {
    id: 'problem-solving',
    title: { es: 'Resolución de problemas y aprendizaje continuo', en: 'Problem solving and continuous learning' },
    description: {
      es: 'analizar dificultades y mejorar la forma de trabajar.',
      en: 'analyze challenges and continually refine how I work.',
    },
  },
]

export type ProjectCategory = 'backend' | 'frontend' | 'fullstack'

export interface ProjectDiagramNode {
  title: string
  subtitle?: string
}

export interface VerifiedProject {
  id: string
  category: ProjectCategory
  title: Record<Language, string>
  shortSummary: Record<Language, string>
  description: Record<Language, string>
  coreTechnologies: string[]
  technologies: string[]
  shortParticipation: Record<Language, string>
  participation: Record<Language, string>
  status: Record<Language, string>
  highlights: Record<Language, string[]>
  repoUrl: string
  diagramCaption: Record<Language, string>
  diagramNodes: [ProjectDiagramNode, ProjectDiagramNode, ProjectDiagramNode]
}

export const verifiedProjects: VerifiedProject[] = [
  {
    id: 'order-payment-microservices',
    category: 'backend',
    title: {
      es: 'OrderMS y PaymentMS',
      en: 'OrderMS & PaymentMS',
    },
    shortSummary: {
      es: 'Microservicios asíncronos de órdenes y pagos simulados con Spring Boot, Kafka, PostgreSQL y cifrado RSA.',
      en: 'Asynchronous order and simulated-payment microservices with Spring Boot, Kafka, PostgreSQL, and RSA encryption.',
    },
    description: {
      es: 'Arquitectura de dos microservicios en Java 21 y Spring Boot: OrderMS expone la API REST de órdenes (PENDIENTE, PAGADO, FALLO_PAGO), almacena datos no sensibles en PostgreSQL 16 y cifra datos de tarjeta con RSA-2048 OAEP antes de publicar eventos en Apache Kafka. PaymentMS consume el evento, descifra en memoria sin persistir tarjeta y emite el resultado.',
      en: 'Two-microservice architecture built with Java 21 and Spring Boot: OrderMS exposes the order REST API (PENDIENTE, PAGADO, FALLO_PAGO), stores non-sensitive order fields in PostgreSQL 16, and encrypts card data with RSA-2048 OAEP before publishing events to Apache Kafka. PaymentMS consumes events, decrypts in memory without persisting card fields, and publishes the payment result.',
    },
    coreTechnologies: ['Java 21', 'Spring Boot 3', 'Apache Kafka', 'PostgreSQL 16'],
    technologies: ['Java 21', 'Spring Boot 3', 'Apache Kafka', 'PostgreSQL 16', 'Docker Compose', 'Maven'],
    shortParticipation: {
      es: 'Implementé ambos microservicios, eventos Kafka, cifrado RSA y Docker Compose.',
      en: 'Built both microservices, Kafka event flow, RSA encryption, and Docker Compose.',
    },
    participation: {
      es: 'Desarrollo completo en el repositorio público (Yoerojas): implementación de order-ms, payment-ms, flujo de eventos Kafka (order-placed / payment-processed), cifrado RSA en tránsito y orquestación con Docker Compose.',
      en: 'Full implementation in the public repository (Yoerojas): order-ms and payment-ms services, Kafka event workflow (order-placed / payment-processed), RSA in-transit encryption, and Docker Compose orchestration.',
    },
    status: {
      es: 'Repositorio público reproducible con Docker Compose; simulación determinística de pagos sin pasarela bancaria real.',
      en: 'Public repository reproducible via Docker Compose; deterministic payment simulation without a live payment gateway.',
    },
    highlights: {
      es: [
        'Comunicación asíncrona desacoplada con Apache Kafka en modo KRaft.',
        'Cifrado RSA/ECB/OAEPWithSHA-256AndMGF1Padding para proteger datos en tránsito sin guardar tarjeta.',
        'Pruebas unitarias y de integración por módulo con Maven Wrapper y guía de validación reproducible.',
      ],
      en: [
        'Decoupled asynchronous messaging with Apache Kafka in KRaft mode.',
        'RSA/ECB/OAEPWithSHA-256AndMGF1Padding encryption protecting card fields in transit with zero persistence.',
        'Module-level unit and integration tests via Maven Wrapper and reproducible Docker Compose validation guide.',
      ],
    },
    repoUrl: 'https://github.com/Yoerojas/order-payment-microservices',
    diagramCaption: {
      es: 'Ilustración conceptual: OrderMS -> Kafka -> PaymentMS',
      en: 'Conceptual illustration: OrderMS -> Kafka -> PaymentMS',
    },
    diagramNodes: [
      { title: 'OrderMS', subtitle: 'REST + PG' },
      { title: 'Kafka', subtitle: 'RSA Event' },
      { title: 'PaymentMS' },
    ],
  },
  {
    id: 'velocity',
    category: 'frontend',
    title: {
      es: 'Velocity',
      en: 'Velocity',
    },
    shortSummary: {
      es: 'Prototipo FPS en navegador orientado a movimiento competitivo (Hito M0: WALK) con TypeScript, PlayCanvas y Ammo.js.',
      en: 'Browser-first competitive movement FPS prototype (Milestone M0: WALK) built with TypeScript, PlayCanvas, and Ammo.js.',
    },
    description: {
      es: 'Base técnica del cliente web para un FPS de movimiento competitivo en el navegador. Implementa el controlador de movimiento en primera persona (Pointer Lock, WASD, salto), detección de suelo con Ammo.js y el entorno de pruebas graybox Movement Lab en PlayCanvas.',
      en: 'Technical foundation for a browser-based competitive movement FPS client. Implements the first-person movement controller (Pointer Lock, WASD, jump), Ammo.js ground probing, and the graybox Movement Lab evaluation scene in PlayCanvas.',
    },
    coreTechnologies: ['TypeScript', 'PlayCanvas', 'Ammo.js', 'Vite'],
    technologies: ['TypeScript', 'Vite', 'PlayCanvas', 'Ammo.js', 'Vitest', 'ESLint'],
    shortParticipation: {
      es: 'Desarrollé CharacterMotor, Pointer Lock, GroundProbe, pruebas y MovementLab.',
      en: 'Built CharacterMotor, Pointer Lock, GroundProbe, unit tests, and MovementLab.',
    },
    participation: {
      es: 'Desarrollo en el repositorio público (yrojasar): controlador CharacterMotor, entrada Pointer Lock, módulo de física GroundProbe, pruebas unitarias movementMath.test.ts y escena MovementLab.',
      en: 'Development in the public repository (yrojasar): CharacterMotor controller, Pointer Lock input, GroundProbe physics module, movementMath.test.ts unit tests, and MovementLab scene.',
    },
    status: {
      es: 'En desarrollo (Hito M0: WALK completado; combate, servidor y multijugador siguen documentados como hitos posteriores).',
      en: 'In active development (Milestone M0: WALK completed; combat, server, and multiplayer remain documented future milestones).',
    },
    highlights: {
      es: [
        'Separación limpia de lógica matemática pura (movementMath.ts) verificada con Vitest.',
        'Sincronización responsiva de canvas WebGL 2 y telemetría de laboratorio M0.',
        'Workflow de CI configurado para lint, typecheck, test, format:check y build.',
      ],
      en: [
        'Clean decoupling of pure movement math (movementMath.ts) verified with Vitest.',
        'Responsive WebGL 2 canvas synchronization and M0 movement lab telemetry.',
        'CI workflow validating lint, typecheck, tests, formatting, and production build.',
      ],
    },
    repoUrl: 'https://github.com/yrojasar-ui/Velocity',
    diagramCaption: {
      es: 'Ilustración conceptual: Input -> CharacterMotor -> MovementLab',
      en: 'Conceptual illustration: Input -> CharacterMotor -> MovementLab',
    },
    diagramNodes: [
      { title: 'Player', subtitle: 'Input' },
      { title: 'Character', subtitle: 'Motor' },
      { title: 'Ammo.js', subtitle: 'Lab' },
    ],
  },
  {
    id: 'sistema-gestion-academica',
    category: 'fullstack',
    title: {
      es: 'Sistema de gestión académica',
      en: 'Academic Library System',
    },
    shortSummary: {
      es: 'Catálogo de biblioteca académica con motor en C++17 (Árbol B+, grafo y reservas FIFO) e interfaz React + TypeScript.',
      en: 'Academic library catalog combining a C++17 engine (B+ Tree, topic graph, FIFO queue) with a React + TypeScript interface.',
    },
    description: {
      es: 'Proyecto de Estructuras de Datos II (Universidad CENFOTEC) compuesto por un backend en C++17 con CatalogService, BPlusTree, cola de reservas FIFO, grafo de temas y persistencia JSON/MongoDB, conectado mediante API HTTP a una aplicación React + TypeScript que lista obras y visualiza nodos y hojas enlazadas del árbol B+.',
      en: 'Data Structures II project (CENFOTEC University) pairing a C++17 backend (CatalogService, B+ Tree, FIFO reservation queue, topic graph, JSON/MongoDB persistence) with a React + TypeScript frontend querying the HTTP API and visualizing B+ Tree nodes and linked leaves.',
    },
    coreTechnologies: ['C++17', 'React', 'TypeScript', 'MongoDB'],
    technologies: ['C++17', 'CMake', 'React', 'TypeScript', 'Vite', 'MongoDB'],
    shortParticipation: {
      es: 'Implementé las estructuras en C++17, las pruebas, el cliente React y CI.',
      en: 'Built the C++17 data structures, automated tests, React frontend, and CI.',
    },
    participation: {
      es: 'Autoría verificada (yrojasar / Yoel Alexander Rojas Arguedas): estructuras de datos en C++17, pruebas CTest/ASan/UBSan/Python, cliente web en frontend/ y automatización CI.',
      en: 'Verified authorship (yrojasar / Yoel Alexander Rojas Arguedas): C++17 data structures, CTest/ASan/UBSan/Python test suites, React frontend/, and CI pipeline.',
    },
    status: {
      es: 'Proyecto académico con pruebas automatizadas; la interfaz estática espera configuración de VITE_API_URL para conectar una API C++ activa.',
      en: 'Academic project with automated tests; the static frontend awaits VITE_API_URL configuration to connect to a live C++ API.',
    },
    highlights: {
      es: [
        'Mismo CatalogService y BPlusTree compartidos entre consola y API HTTP C++17.',
        'Pruebas de estructuras con sanitizers (ASan/UBSan) y pruebas de API.',
        'Frontend diseñado para fallar de forma segura sin inventar datos si la API no está configurada.',
      ],
      en: [
        'Shared CatalogService and BPlusTree powering both console mode and the C++17 HTTP API.',
        'Data structure test suite verified under ASan/UBSan sanitizers plus API integration tests.',
        'Frontend designed to handle unconfigured API states honestly without fabricating catalog entries.',
      ],
    },
    repoUrl: 'https://github.com/yrojasar-ui/Sistema-de-gestion-Academica',
    diagramCaption: {
      es: 'Ilustración conceptual: React -> API HTTP C++17 -> B+ Tree',
      en: 'Conceptual illustration: React -> C++17 HTTP API -> B+ Tree',
    },
    diagramNodes: [
      { title: 'React + TS', subtitle: 'Frontend' },
      { title: 'C++17', subtitle: 'HTTP API' },
      { title: 'B+ Tree', subtitle: 'MongoDB' },
    ],
  },
]
