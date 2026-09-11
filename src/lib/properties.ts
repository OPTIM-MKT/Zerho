import { getCollection, type CollectionEntry } from "astro:content";

export type Property = CollectionEntry<"propiedades">;

/**
 * Todas las propiedades publicadas, en el orden editorial definido por
 * `order`. Es el único punto donde se lee la colección: portada, `[slug]`,
 * cabecera y pie parten siempre de la misma lista.
 */
export async function getProperties(): Promise<Property[]> {
  const entries = await getCollection(
    "propiedades",
    ({ data }) => data.available,
  );
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/**
 * La residencia que abre el sitio.
 *
 * El contrato es estricto —exactamente una ficha con `featured: true`— porque
 * de él depende que cada residencia tenga una sola URL: la destacada vive en
 * `/` y las demás en `/[slug]`. Si el contrato se rompe, la build falla con un
 * mensaje claro en lugar de publicar contenido duplicado en dos direcciones.
 */
export async function getFeaturedProperty(): Promise<Property> {
  const all = await getProperties();
  const featured = all.filter((p) => p.data.featured);

  if (featured.length === 1) return featured[0]!;

  const detail = all.length
    ? `Marcadas: ${featured.length} (${all.map((p) => p.id).join(", ")}).`
    : "No hay ninguna ficha publicada en src/content/propiedades/.";

  throw new Error(
    `Se esperaba exactamente una propiedad con "featured: true". ${detail}`,
  );
}

/** Las residencias que se publican bajo `/[slug]`. */
export async function getSecondaryProperties(): Promise<Property[]> {
  const [all, featured] = await Promise.all([
    getProperties(),
    getFeaturedProperty(),
  ]);
  return all.filter((p) => p.id !== featured.id);
}

/** Las demás residencias, en orden, excluyendo la que se está viendo. */
export async function getOtherProperties(current: Property) {
  const all = await getProperties();
  return all.filter((p) => p.id !== current.id);
}

/** Una sola URL canónica por residencia: la destacada es la portada. */
export function propertyHref(property: Property) {
  return property.data.featured ? "/" : `/${property.id}`;
}

const CURRENCY_FORMATTERS = new Map<string, Intl.NumberFormat>();

/** `67000000` → `$67,000,000 MXN`. Sin decimales: son cifras redondas. */
export function formatPrice(amount: number, currency = "MXN") {
  let formatter = CURRENCY_FORMATTERS.get(currency);

  if (!formatter) {
    formatter = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    CURRENCY_FORMATTERS.set(currency, formatter);
  }

  return `${formatter.format(amount)} ${currency}`;
}
