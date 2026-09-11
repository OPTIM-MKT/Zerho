/**
 * Descubrimiento de imágenes por carpeta.
 *
 * Vive en un módulo y no dentro del componente de galería porque la ficha las
 * necesita en dos sitios: el mosaico y los bloques de texto e imagen. Un solo
 * `import.meta.glob` evita que Vite mantenga dos grafos de assets idénticos.
 *
 * `eager: true` sólo trae los metadatos (ruta, ancho, alto) en build; los
 * archivos los sigue procesando `<Image>` bajo demanda.
 */
const MODULES = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}",
  { eager: true },
);

const CACHE = new Map<string, ImageMetadata[]>();

/**
 * Imágenes de `src/assets/<dir>/`, ordenadas por nombre de archivo para que el
 * orden sea estable entre builds y controlable renombrando.
 */
export function getGalleryImages(dir: string): ImageMetadata[] {
  const normalized = dir.replace(/^\/+|\/+$/g, "");

  const cached = CACHE.get(normalized);
  if (cached) return cached;

  const images = Object.entries(MODULES)
    .filter(([path]) => path.includes(`/assets/${normalized}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);

  CACHE.set(normalized, images);
  return images;
}

/**
 * Toma una imagen de la carpeta desplazando el índice.
 *
 * Las tres fichas comparten por ahora el mismo juego de fotografías; el
 * desplazamiento hace que cada una abra por una imagen distinta en lugar de
 * repetir la misma composición tres veces.
 */
export function pickGalleryImage(
  dir: string,
  index: number,
  fallback: ImageMetadata,
): ImageMetadata {
  const images = getGalleryImages(dir);
  if (!images.length) return fallback;
  return images[((index % images.length) + images.length) % images.length]!;
}

/** Identificador estable y válido como selector CSS para una carpeta. */
export function galleryId(dir: string) {
  return `pswp-${dir.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-")}`;
}
