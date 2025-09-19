// Content Collections Configuration
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    author: z.string().default("AllOps Team"),
    tags: z.array(z.string()).default([]),
    category: z
      .enum(["devops", "aws", "kubernetes", "ci-cd", "monitoring", "security"])
      .default("devops"),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lang: z.enum(["sr", "en", "de"]),
    section: z.enum(["hero", "about", "services", "portfolio", "contact"]),
    order: z.number().optional(),
  }),
});

// UI translations collection
const ui = defineCollection({
  type: "data",
  schema: z.record(z.any()), // Flexible schema for translation files
});

export const collections = {
  blog,
  pages,
  ui,
};
