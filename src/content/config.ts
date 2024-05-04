import { z, defineCollection } from "astro:content";
import { parseYMD } from "@/utils";

const blogCollection = defineCollection({
	type: "content", // v2.5.0 and later
	schema: z.object({
		title: z.string(),
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
		description: z.string().optional(),
	}),
});

export const collections = {
	"blog": blogCollection,
};
