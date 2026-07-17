import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const topics = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/topics",
    generateId: ({ entry }) => entry.replace(/\/README\.md$/i, "")
  }),
  schema: z.object({
    title: z.string()
  })
});

export const collections = { topics };
