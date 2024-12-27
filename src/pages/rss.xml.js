import rss from "@astrojs/rss";
import { getBlogPosts } from "@/content";

const DescriptionPattern = /\s*<p>(.*)<\/p>/;

export async function GET(context)
{
	const posts = await getBlogPosts();
	const items = posts.map((post) => {
		const {
			slug,
			data: {
				title,
				descriptionHTML,
				date,
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
