import { getCollection } from "astro:content";

export async function getBlogPosts()
{
	// sort the blog posts in reverse chronological order
	return (await getCollection("blog"))
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

export async function getMinutes()
{
	// sort the minutes in reverse chronological order
	return (await getCollection("minutes"))
		.sort((a, b) => b.data.year - a.data.year || b.data.quarter - a.data.quarter);
}
