import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>("/src/assets/blog/*.{jpeg,jpg,png,gif}");

export async function getBlogImage(
	filename: string = ""): Promise<ImageMetadata | null>
{
	if (filename) {
		// this Vite import method requires that its parameter be a literal string,
		// not even one assembled from other literals
		const imagePath = "/src/assets/blog/" + filename.replace(/^\/img\/uploads\//, "");

		if (images[imagePath]) {
			return (await images[imagePath]()).default;
		}

		console.error(`Missing image: ${imagePath}`);
	}

	return null;
}
