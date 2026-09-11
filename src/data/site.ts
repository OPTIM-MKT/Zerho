/**
 * Datos de estudio: lo que no pertenece a ninguna propiedad en concreto.
 *
 * El compromiso y la garantía son de Zerho, no de una casa: viven aquí y no
 * duplicados en los tres .md. Si algún día una ficha necesita su propia
 * variante, se añade el campo opcional al esquema y se sobreescribe allí.
 */

export const SITE = {
  name: "Zerho",
  slogan: "Arquitectura Extraordinaria",
  legalName: "Zerho Arquitectos",
  description:
    "Residencias de autor en San Pedro Garza García y Monterrey, con certeza total de costos, aportaciones programadas y diez años de garantía.",
  director: "Jorge Antonio López",
  directorRole: "Dirección de proyecto",
  // TODO(cliente): sustituir por los datos de contacto reales de Zerho.
  email: "contacto@zerho.mx",
  phone: "+52 81 1234 5678",
  phoneHref: "+528112345678",
  whatsapp: "528112345678",
  city: "San Pedro Garza García, Nuevo León",
  instagram: "https://www.instagram.com/",
} as const;

/** Navegación del sitio: es una sola página larga por propiedad. */
export const SECTIONS = [
  { id: "residencia", label: "Residencia" },
  { id: "caracteristicas", label: "Características" },
  { id: "galeria", label: "Galería" },
  { id: "planos", label: "Planos" },
  { id: "compromiso", label: "Compromiso" },
  { id: "contacto", label: "Contacto" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Los cinco compromisos que Zerho firma con cada cliente. */
export const COMMITMENTS = [
  {
    title: "Contratos a precio alzado",
    body: "Certeza total de costos: sin sorpresas financieras, sin costos ocultos y sin incrementos durante la obra.",
  },
  {
    title: "Aportaciones programadas",
    body: "Un calendario de pagos transparente, vinculado directamente al avance real verificable de la construcción.",
  },
  {
    title: "Comunicación directa",
    body: "Atención personal con el equipo directivo y técnico. Sin intermediarios ni triangulaciones.",
  },
  {
    title: "Diseño con visión a futuro",
    body: "Espacios multifuncionales y centros de comando familiares que evolucionan con cada etapa de tu vida.",
  },
  {
    title: "Tu tranquilidad como prioridad",
    body: "Asumimos la responsabilidad operativa completa para que disfrutes el proceso sin el estrés de la obra.",
  },
] as const;

export const WARRANTY = {
  years: "10",
  title: "Garantía y respaldo por diez años",
  body: "Un horizonte largo para proteger tu patrimonio y asegurar su plusvalía. Nuestro compromiso no termina al entregar las llaves.",
} as const;

/** Mensaje de marca que abre la sección de compromiso en todas las fichas. */
export const PROMISE = {
  eyebrow: "Nuestro compromiso",
  title: "Tu hogar es el activo más importante de tu patrimonio",
  body: "Entendemos que es también el espacio donde tu familia construirá sus mejores recuerdos. Por eso ofrecemos residencias en preventa exclusiva respaldadas por una absoluta certeza constructiva y financiera, acompañándote paso a paso para garantizar que el resultado final sea, sin excepciones, la casa que siempre soñaste.",
} as const;

/** Enlace de WhatsApp prellenado con la propiedad que se está viendo. */
export function whatsappHref(propertyTitle?: string) {
  const text = propertyTitle
    ? `Hola Zerho, me interesa la residencia ${propertyTitle}. ¿Podemos agendar un recorrido?`
    : `Hola Zerho, me gustaría conocer sus residencias disponibles.`;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Asunto prellenado para el correo de contacto. */
export function mailHref(propertyTitle?: string) {
  const subject = propertyTitle
    ? `Interés en ${propertyTitle}`
    : `Contacto desde zerho.mx`;
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}
