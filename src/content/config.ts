import { z, defineCollection } from "astro:content";
import { marked } from "marked";
import { parseYMD } from "@/utils";

const blogCollection = defineCollection({
	type: "content", // v2.5.0 and later
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.string()
			.transform((value, ctx) => {
				const date = parseYMD(value);

				if (!date.isValid()) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Invalid date",
					});

					return z.NEVER;
				}

				return date.toDate();
			})
			.optional(),
		image: z.string()
			.transform((value) => {
				if (!value) {
					return z.NEVER;
				}

				return "/src/assets/blog/" + value.replace(/^\/img\/uploads\//, "");
			})
			.optional(),
		image_alt: z.string().optional(),
		image_list_only: z.boolean().optional(),
	}).transform((data) => ({
		...data,
		// some description fields contain markdown, which we want to convert to
		// formatted paragraph tags in a separate field, so that we can still access
		// the raw text for use in og:description meta tags
		descriptionHTML: marked.parse(data.description),
	})),
});

export const collections = {
	"blog": blogCollection,
};
