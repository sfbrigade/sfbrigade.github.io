import type { ImageMetadata } from "astro";

// this Vite import method requires that its parameter be a literal string,
// not even one assembled from other literals
const images = import.meta.glob<{ default: ImageMetadata }>("/src/assets/blog/**/*.{jpeg,jpg,png,gif}");

export async function getBlogImage(
	imagePath: string): Promise<ImageMetadata | null>
{
	if (images[imagePath]) {
		return (await images[imagePath]()).default;
	}

	imagePath && console.error(`Missing image: ${imagePath}`);

	return null;
}
