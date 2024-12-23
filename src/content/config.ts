import { defineCollection, z } from "astro:content";
import { marked } from "marked";
import { dateStringFromSlug, parseYMD } from "@/utils";
import { globWithParser } from "@/content/globWithParser";

const SFCTRepoPattern = /^[^/]+$/;
const GHRepoPattern = /^[^/]+\/[^/]+$/;
const SFCTRepoBase = "https://github.com/sfbrigade/";
const GHRepoBase = "https://github.com/";

const assetPath = (directory: string, filename: string) => `/src/assets/${directory}/${filename}`;

const blog = defineCollection({
	loader: globWithParser({
		pattern: "**/*.md",
		base: "./src/content/blog",
		parser: async (entry) => {
			const { id, data } = entry;

			if (!data.date) {
				// cast the data object to keep TypeScript happy
				(data as { date?: string }).date = dateStringFromSlug(id);
			}

			return entry;
		}
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.string()
			.transform((value, ctx) => {
				// we treat the date as a string instead of using the built-in date parsing
				// so we can force it to be in PST, rather than the default UTC
				const date = parseYMD(value);

				if (!date.isValid()) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Invalid date",
					});

					// annoyingly, nothing about the file being validated here is available
					// to this function.  if we could get the filename, we could pull a
					// missing date out of the name.  given that we can't, we have to return
					// undefined here and make any code that iterates over the collection
					// call dateFromSlug(slug) for undefined dates, like rss.xml.js.
					return z.NEVER;
				}

				return date.toDate();
			}),
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
