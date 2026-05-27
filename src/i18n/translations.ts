export const defaultLang = 'es';
export const supportedLangs = ['es', 'en'] as const;

export type Lang = (typeof supportedLangs)[number];

export const translations = {
  es: {
    metaTitle: 'Boutique Digital Studio | Experiencias digitales inteligentes',
    metaDescription:
      'Estudio digital premium para desarrollo web estratégico, branding, UX/UI, automatización, IA aplicada, GEO, CRO y experiencias digitales inteligentes.',
    navAbout: 'Estudio',
    navServices: 'Servicios',
    navWork: 'Proyectos',
    navProcess: 'Proceso',
    navCall: 'Agendar llamada',
    heroEyebrow: 'Boutique Digital Studio',
    heroTitle: 'Experiencias digitales para marcas que piensan en futuro.',
    heroText:
      'Diseñamos webs estratégicas, sistemas de automatización e interfaces inteligentes para convertir presencia digital en crecimiento medible.',
    heroPrimary: 'Agendar llamada',
    heroSecondary: 'WhatsApp',
    heroNote: 'Estrategia, diseño y tecnología en una experiencia clara.',
    heroMetricOne: 'Web, IA y automatización',
    heroMetricTwo: 'UX/UI con criterio comercial',
    heroMetricThree: 'Optimización para conversión y AI search',
    aboutEyebrow: 'Enfoque',
    aboutTitle: 'Dirección creativa con mentalidad de producto digital.',
    aboutText:
      'Trabajamos con marcas de hospitality, real estate, lifestyle y servicios modernos que necesitan una presencia digital más sofisticada, más útil y mejor conectada a su operación.',
    aboutOneTitle: 'Estrategia antes que pantalla',
    aboutOneText:
      'Ordenamos mensaje, audiencia, conversión y datos antes de producir diseño.',
    aboutTwoTitle: 'Experiencia boutique',
    aboutTwoText:
      'Cuidamos ritmo visual, contenido, interacción y percepción de marca.',
    aboutThreeTitle: 'Sistema inteligente',
    aboutThreeText:
      'Conectamos IA, formularios, WhatsApp, CMS, analytics y automatización.',
    servicesEyebrow: 'Servicios',
    servicesTitle: 'Lo esencial para crear una experiencia digital premium.',
    servicesIntro:
      'Cada servicio está pensado como parte de un sistema: atraer mejor, explicar mejor, convertir mejor y operar con menos fricción.',
    serviceWebTitle: 'Desarrollo web estratégico',
    serviceWebText:
      'Sitios rápidos, editoriales y escalables con Astro, Next.js o CMS headless.',
    serviceBrandTitle: 'Branding & dirección visual',
    serviceBrandText:
      'Sistemas visuales sobrios, memorables y consistentes para marcas modernas.',
    serviceAiTitle: 'IA aplicada & automatización',
    serviceAiText:
      'Flujos con OpenAI, n8n, formularios inteligentes y respuestas asistidas.',
    serviceCroTitle: 'CRO & optimización',
    serviceCroText:
      'Mejora de journeys, CTAs, formularios, contenido y calidad de leads.',
    serviceGeoTitle: 'GEO / AI Search Optimization',
    serviceGeoText:
      'Contenido y estructura listos para buscadores y respuestas generativas.',
    serviceIntegrationsTitle: 'Integraciones inteligentes',
    serviceIntegrationsText:
      'WhatsApp, CRM, analytics, calendarios, CMS y herramientas operativas.',
    workEyebrow: 'Proyectos',
    workTitle: 'Conceptos digitales con estética, claridad y performance.',
    workIntro:
      'Una muestra del tipo de sistemas que diseñamos: experiencias visuales con lógica comercial y operación conectada.',
    workOneTitle: 'Hospitality direct booking',
    workOneText:
      'Sitio editorial para alojamientos boutique con consultas por WhatsApp, tracking y contenido optimizado.',
    workTwoTitle: 'Real estate lead system',
    workTwoText:
      'Landing modular para proyectos inmobiliarios con formularios inteligentes y segmentación de intención.',
    workThreeTitle: 'Lifestyle commerce experience',
    workThreeText:
      'Experiencia visual para marca lifestyle con narrativa, performance y optimización de conversión.',
    techEyebrow: 'Stack',
    techTitle: 'Tecnología sobria, rápida y preparada para crecer.',
    techText:
      'Elegimos herramientas por performance, claridad operativa y capacidad de integrarse con el negocio.',
    processEyebrow: 'Proceso',
    processTitle: 'Un proceso claro para decisiones de alto impacto.',
    processOneTitle: 'Diagnóstico',
    processOneText: 'Objetivos, audiencia, oferta, datos y fricción actual.',
    processTwoTitle: 'Estrategia',
    processTwoText: 'Arquitectura, mensajes, conversión y plan de medición.',
    processThreeTitle: 'Diseño UX/UI',
    processThreeText: 'Prototipos claros, estética premium y experiencia mobile-first.',
    processFourTitle: 'Desarrollo',
    processFourText: 'Implementación performante, accesible y mantenible.',
    processFiveTitle: 'Automatización',
    processFiveText: 'IA, WhatsApp, CRM, formularios y workflows conectados.',
    processSixTitle: 'Mejora continua',
    processSixText: 'Lectura de datos, CRO, iteración y optimización.',
    testimonialsEyebrow: 'Confianza',
    testimonialsTitle: 'La percepción premium también se diseña.',
    testimonialOne:
      'El proyecto elevó la percepción de marca y convirtió la web en una herramienta comercial real.',
    testimonialTwo:
      'La diferencia estuvo en la claridad estratégica: diseño, tecnología y operación trabajando juntos.',
    testimonialThree:
      'Pasamos de una web estática a un sistema digital que captura, ordena y activa oportunidades.',
    ctaEyebrow: 'Próximo paso',
    ctaTitle: 'Diseñemos una experiencia digital más inteligente para tu marca.',
    ctaText:
      'Agenda una llamada estratégica para revisar objetivos, oportunidades y el sistema digital que tu marca necesita.',
    ctaPrimary: 'Agendar llamada',
    ctaSecondary: 'Escribir por WhatsApp',
    footerText: 'Estudio digital boutique para marcas modernas.',
  },
  en: {
    metaTitle: 'Boutique Digital Studio | Intelligent digital experiences',
    metaDescription:
      'Premium digital studio for strategic web development, branding, UX/UI, automation, applied AI, GEO, CRO and intelligent digital experiences.',
    navAbout: 'Studio',
    navServices: 'Services',
    navWork: 'Work',
    navProcess: 'Process',
    navCall: 'Book a call',
    heroEyebrow: 'Boutique Digital Studio',
    heroTitle: 'Digital experiences for brands built around what comes next.',
    heroText:
      'We design strategic websites, automation systems and intelligent interfaces that turn digital presence into measurable growth.',
    heroPrimary: 'Book a call',
    heroSecondary: 'WhatsApp',
    heroNote: 'Strategy, design and technology in one clear experience.',
    heroMetricOne: 'Web, AI and automation',
    heroMetricTwo: 'UX/UI with business intent',
    heroMetricThree: 'Conversion and AI search optimization',
    aboutEyebrow: 'Approach',
    aboutTitle: 'Creative direction with a digital product mindset.',
    aboutText:
      'We work with hospitality, real estate, lifestyle and modern service brands that need a more refined, useful and connected digital presence.',
    aboutOneTitle: 'Strategy before screens',
    aboutOneText:
      'We align message, audience, conversion and data before producing design.',
    aboutTwoTitle: 'Boutique experience',
    aboutTwoText:
      'We craft visual rhythm, content, interaction and brand perception.',
    aboutThreeTitle: 'Intelligent system',
    aboutThreeText:
      'We connect AI, forms, WhatsApp, CMS, analytics and automation.',
    servicesEyebrow: 'Services',
    servicesTitle: 'The essentials for a premium digital experience.',
    servicesIntro:
      'Each service works as part of a system: attract better, explain better, convert better and operate with less friction.',
    serviceWebTitle: 'Strategic web development',
    serviceWebText:
      'Fast, editorial and scalable websites with Astro, Next.js or headless CMS.',
    serviceBrandTitle: 'Branding & visual direction',
    serviceBrandText:
      'Sober, memorable and consistent visual systems for modern brands.',
    serviceAiTitle: 'Applied AI & automation',
    serviceAiText:
      'OpenAI flows, n8n, intelligent forms and assisted response systems.',
    serviceCroTitle: 'CRO & optimization',
    serviceCroText:
      'Improved journeys, CTAs, forms, content and lead quality.',
    serviceGeoTitle: 'GEO / AI Search Optimization',
    serviceGeoText:
      'Content and structure prepared for search engines and generative answers.',
    serviceIntegrationsTitle: 'Intelligent integrations',
    serviceIntegrationsText:
      'WhatsApp, CRM, analytics, calendars, CMS and operational tools.',
    workEyebrow: 'Work',
    workTitle: 'Digital concepts with aesthetics, clarity and performance.',
    workIntro:
      'A sample of the systems we design: visual experiences with business logic and connected operations.',
    workOneTitle: 'Hospitality direct booking',
    workOneText:
      'Editorial site for boutique stays with WhatsApp inquiries, tracking and optimized content.',
    workTwoTitle: 'Real estate lead system',
    workTwoText:
      'Modular landing for property projects with intelligent forms and intent segmentation.',
    workThreeTitle: 'Lifestyle commerce experience',
    workThreeText:
      'Visual experience for a lifestyle brand with narrative, performance and conversion optimization.',
    techEyebrow: 'Stack',
    techTitle: 'Sober, fast technology prepared to scale.',
    techText:
      'We choose tools for performance, operational clarity and their ability to integrate with the business.',
    processEyebrow: 'Process',
    processTitle: 'A clear process for high-impact decisions.',
    processOneTitle: 'Diagnosis',
    processOneText: 'Objectives, audience, offer, data and current friction.',
    processTwoTitle: 'Strategy',
    processTwoText: 'Architecture, messaging, conversion and measurement plan.',
    processThreeTitle: 'UX/UI Design',
    processThreeText: 'Clear prototypes, premium aesthetics and mobile-first experience.',
    processFourTitle: 'Development',
    processFourText: 'Performant, accessible and maintainable implementation.',
    processFiveTitle: 'Automation',
    processFiveText: 'AI, WhatsApp, CRM, forms and connected workflows.',
    processSixTitle: 'Continuous improvement',
    processSixText: 'Data reading, CRO, iteration and optimization.',
    testimonialsEyebrow: 'Trust',
    testimonialsTitle: 'Premium perception is designed too.',
    testimonialOne:
      'The project elevated brand perception and turned the website into a real commercial tool.',
    testimonialTwo:
      'The difference was strategic clarity: design, technology and operations working together.',
    testimonialThree:
      'We moved from a static website to a digital system that captures, organizes and activates opportunities.',
    ctaEyebrow: 'Next step',
    ctaTitle: 'Let’s design a smarter digital experience for your brand.',
    ctaText:
      'Book a strategic call to review goals, opportunities and the digital system your brand needs.',
    ctaPrimary: 'Book a call',
    ctaSecondary: 'Message on WhatsApp',
    footerText: 'Boutique digital studio for modern brands.',
  },
} as const;
