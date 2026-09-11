# Zerho — Arquitectura Extraordinaria

Sitio de residencias de Zerho. No tiene páginas institucionales: **el sitio son
las fichas de propiedad**. La destacada abre en `/` y las demás cuelgan de
`/[slug]`. Monolingüe (`es-MX`).

## Cómo está organizado

```text
src/
├── content/propiedades/        # ← las tres fichas. Una propiedad = un .md
│   ├── encinos-8.md            #   featured: true → se publica en /
│   ├── balcones-del-campestre.md
│   └── sierra-alta-24.md
├── content.config.ts           # esquema Zod de la colección `propiedades`
├── data/site.ts                # marca, contacto, compromisos, garantía, secciones
├── lib/
│   ├── properties.ts           # acceso a la colección, URLs canónicas, precios
│   └── gallery.ts              # descubrimiento de imágenes por carpeta
├── components/
│   ├── property/PropertyView   # el único montaje de ficha (portada y [slug])
│   ├── shared/                 # secciones y piezas reutilizables
│   └── ui/                     # Button, Icon
├── layouts/Layout.astro        # <head>, SEO, cabecera, pie
├── scripts/indicator.ts        # indicador con muelle (nav y control de planos)
├── styles/global.css           # sistema de diseño completo (tokens + utilidades)
└── pages/                      # index · [slug] · 404
```

## Añadir o editar una propiedad

1. Crear un `.md` en `src/content/propiedades/`. El nombre del archivo es el
   slug (`balcones-del-campestre.md` → `/balcones-del-campestre`).
2. Rellenar el frontmatter siguiendo el esquema de `src/content.config.ts`. El
   esquema es estricto: si falta un campo o cambia un tipo, la build falla con
   el error señalado.
3. El **cuerpo del `.md`** es la narrativa editorial y se renderiza como prosa.
   Todo lo estructurado (cifras, listas, planos) va en el frontmatter.

### Reglas de contenido

- **Exactamente una** ficha lleva `featured: true`. Esa es la portada y **no**
  se publica además bajo su slug: una sola URL canónica por residencia. Si hay
  cero o más de una, la build se detiene con un mensaje explícito.
- `order` define el orden en cabecera, pie y bloque de "otras residencias".
- `galleryDir` apunta a una carpeta bajo `src/assets/`. Añadir una foto a esa
  carpeta la publica en la galería: no hay que tocar el `.md`.
- En YAML, un valor sin comillas **no puede contener `: `**. Entrecomillar o
  reescribir con raya (`—`).

## Sistema de diseño

Todo el color, la tipografía, la elevación y el ritmo viven en `@theme` dentro
de `src/styles/global.css`. Ningún componente escribe un hex: consumen tokens
(`bg-primary`, `text-accent-deep`, `rounded-panel`, `shadow-e2`, `type-title`).

Paleta Pantone de marca:

| Pantone      | Hex       | Token                 | Uso                       |
| ------------ | --------- | --------------------- | ------------------------- |
| 553 C        | `#333A30` | `primary`             | Secciones estructurales   |
| Black 7 C    | `#2B2A26` | `ink`                 | Tipografía                |
| Black 6 C    | `#000000` | `base-black`          | Velos y visor             |
| 465 C        | `#93774A` | `accent`              | Acento                    |
| Warm Gray 2C | `#C2B6AA` | `sand`                | Texto secundario oscuro   |
| Cool Gray 1C | `#E9E1D1` | `canvas` / `bone`     | Lienzo                    |

`accent-deep` y `accent-light` son matices del 465 C para que el acento cumpla
contraste AA en texto pequeño sobre fondo claro y sobre fondo verde.

## Movimiento

Lo que se puede agarrar con el dedo se anima con muelles en JS
(`src/scripts/indicator.ts`), no con transiciones CSS: un muelle re-apunta desde
la posición y la velocidad actuales, una transición reinicia y salta. Lo que no
es interrumpible (hover, revelado al scroll) usa curvas CSS.

El sitio responde a `prefers-reduced-motion`, `prefers-reduced-transparency` y
`prefers-contrast`.

## Comandos

| Comando         | Acción                                  |
| --------------- | --------------------------------------- |
| `npm run dev`   | Servidor local en `localhost:4321`      |
| `npm run build` | Build de producción en `./dist/`        |
| `npm run preview` | Previsualiza el build                 |
| `npx @astrojs/check` | Comprobación de tipos              |

## Pendiente

- Logotipo definitivo: la cabecera y el pie usan un monograma provisional.
- Datos de contacto reales en `src/data/site.ts` (marcados con `TODO`).
- Fotografía propia y planos definitivos (ahora se reutiliza
  `src/assets/images/gal/prueba/`).
- Confirmar los datos comerciales de `sierra-alta-24.md`, que es una ficha de
  demostración.
