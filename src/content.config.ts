import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';


const blog = defineCollection({
	loader: glob({base: './src/blog', pattern: '**/[^_]*.{md,mdx}'}),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		draft: z.coerce.boolean().optional()
	}),
});

export const collections = { blog:blog };