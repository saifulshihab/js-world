import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

const topics = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/topics" })
});

export const collections = { topics };
