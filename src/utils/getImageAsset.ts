import type { ImageMetadata } from "astro";
import { posix } from "path";

// this Vite import method requires that its parameter be a literal string,
// not even one assembled from other literals
const images = import.meta.glob<{ default: ImageMetadata }>("/src/assets/**/*.{webp,jpeg,jpg,png,gif,svg}");

export async function getImageAsset(
	imagePath: string): Promise<ImageMetadata | null>
{
	// decode the imagePath, since the files returned by the glob will not be
	// encoded.  use posix.normalize() to keep / separators, even on Windows.
	const path = posix.normalize(decodeURIComponent(imagePath));

	if (images[path]) {
		return (await images[path]()).default;
	}

	imagePath && console.error(`Missing image: ${path}`);

	return null;
}
