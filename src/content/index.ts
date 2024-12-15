import { getCollection, type CollectionEntry } from "astro:content";
import { dateFromSlug } from "@/utils";

type BlogEntry = CollectionEntry<"blog">;
export type Post = Omit<BlogEntry, "data"> & { data: Omit<BlogEntry["data"], "date"> & { date: Date } };

export async function getBlogPosts() : Promise<Post[]>
{
	return (await getCollection("blog"))
		.map((post) => {
			const { slug, data } = post;

			// some posts don't have a date specified, so create one from the filename
			if (!data.date) {
				data.date = dateFromSlug(slug);
			}

			return post as Post;
		})
		// sort the blog posts in reverse chronological order
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getProjects()
{
	// sort the projects in alphabetical order by name
	return (await getCollection("projects"))
		.sort((a, b) => a.data.name < b.data.name
			? -1
			: a.data.name > b.data.name
				? 1
				: 0);
}
