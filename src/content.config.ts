import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { marked } from "marked";
import {
	dayjs,
	dateStringFromSlug,
	isValidYMD,
	parseYMDToDate
} from "@/utils";
import { globWithParser } from "@/content/globWithParser";
import { minutes } from "@/content/minutes/collection";

const SFCTRepoPattern = /^[^/]+$/;
const GHRepoPattern = /^[^/]+\/[^/]+$/;
const SFCTRepoBase = "https://github.com/sfbrigade/";
const GHRepoBase = "https://github.com/";
const MarkdownPattern = "**/[^_]*.md";

const assetPath = (directory: string, filename: string) => `/src/assets/${directory}/${filename}`;

const blog = defineCollection({
	// this loader calls the parser function after the markdown has been parsed but
	// before the data has been checked against the schema, which gives us a chance
	// to extract the date from the slug if it's missing from the frontmatter.  the
	// APIs aren't really documented, so it's possible this will break in a future
	// rev of Astro.  if it does, we can go back to replacing missing dates in
	// getBlogPosts() instead, by making the date in the schema optional.
	loader: globWithParser({
		pattern: MarkdownPattern,
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
		// use preprocess() so we can handle either strings or Date objects
		date: z.preprocess((value) => {
			if (value instanceof Date && !isNaN(value.getTime())) {
				// this value is from frontmatter of the form `date: YYYY-MM-DD`, with
				// no quotes, which Astro parses as a UTC date.  convert that to a dayjs
				// object, call utc() to force it back to UTC (since we've set the default
				// timezone to PST), and then format its calendar date as a YMD string.
				// we can then continue with string parsing logic below.
				value = dayjs(value).utc().format("YYYY-MM-DD");
			}

			return isValidYMD(value)
				? parseYMDToDate(value)
				: value;
			},
			z.date()),
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
	loader: glob({
		pattern: MarkdownPattern,
		base: "./src/content/projects"
	}),
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
	minutes,
};
