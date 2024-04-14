import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
	type: "content", // v2.5.0 and later
	schema: z.object({
		title: z.string(),
		date: z.coerce.date().optional(),
		image: z.string().optional(),
		image_alt: z.string().optional(),
		description: z.string().optional(),
	}),
});

export const collections = {
	"blog": blogCollection,
};
