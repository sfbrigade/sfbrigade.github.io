import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { dateFromSlug, formatRSSDate } from "@/utils";

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

		return {
			title,
			description: descriptionHTML,
			pubDate: formatRSSDate(date),
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
