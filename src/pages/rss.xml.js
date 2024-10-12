import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { dateFromSlug } from "@/utils";

const DescriptionPattern = /\s*<p>(.*)<\/p>/;

export async function GET(context)
{
	const blog = await getCollection("blog");
	const items = blog.map((post) => {
		const {
			slug,
			data: {
				title,
				descriptionHTML,
				// pubDate is required, but some posts don't have a date specified, so
				// create one from the filename
				date = dateFromSlug(slug),
			},
		} = post;
		// we want to include any embedded HTML, like anchors, but don't want the
		// description surrounded by <p> tags
		const description = descriptionHTML.match(DescriptionPattern)?.[1] || descriptionHTML;


		return {
			title,
			description,
			pubDate: date,
			link: `/blog/${slug}`,
		};
	});

	return rss({
		title: "SF Civic Tech Blog",
		description: "News from SF Civic Tech",
		site: context.site,
		trailingSlash: false,
		items,
	});
}
