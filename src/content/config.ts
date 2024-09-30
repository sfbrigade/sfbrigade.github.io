import { z, defineCollection } from "astro:content";
import { marked } from "marked";
import { parseYMD } from "@/utils";

const SFCTRepoPattern = /^[^/]+$/;
const GHRepoPattern = /^[^/]+\/[^/]+$/;
const SFCTRepoBase = "https://github.com/sfbrigade/";
const GHRepoBase = "https://github.com/";

const assetPath = (directory: string, filename: string) => `/src/assets/${directory}/${filename}`;

const blog = defineCollection({
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

				return assetPath("blog", value.replace(/^\/img\/uploads\//, ""));
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

const projects = defineCollection({
	type: "content", // v2.5.0 and later
	schema: z.object({
		status: z.enum(["active", "inactive", "completed"]),
		name: z.string(),
		thumbnail: z.string()
			.transform((value) => {
				if (!value) {
					return z.NEVER;
				} else if (value.startsWith("http")) {
					// some thumbnails may link to external images, so return just the URL
					return value;
				}

				return assetPath("projects", value);
			})
			.optional(),
		description: z.string(),
		technologies: z.array(z.string()).optional(),
		repos: z.array(z.string())
			.transform((value) => value.map((url) => {
				// the value may be the name of an sfbrigade repo, or a username/reponame
				// GitHub path, or a URL to something off GitHub entirely.  so normalize
				// them all to full URLs.
				if (SFCTRepoPattern.test(url)) {
					return SFCTRepoBase + url;
				} else if (GHRepoPattern.test(url)) {
					return GHRepoBase + url;
				}

				return url;
			}))
			.optional(),
		slack: z.object({
			name: z.string(),
			url: z.string(),
		})
			.optional(),
		website: z.string().optional(),
	}).transform((data) => ({
		...data,
		// some description fields contain markdown, which we want to convert to
		// formatted paragraph tags in a separate field, so that we can still access
		// the raw text for use in og:description meta tags
		descriptionHTML: marked.parse(data.description),
	})),
});

export const collections = {
	blog,
	projects,
};
