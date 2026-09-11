import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const propiedades = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/products",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      cover: image(),
      code: z.string(),
      size: z.string(),
      order: z.number().int().default(0),
      available: z.boolean().default(true),
      specs: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .default([]),
    }),
});

export const collections = { propiedades };
