import fs from "node:fs/promises";
import path from "node:path";
import glob from "fast-glob";

const IncludeImagePattern = /^\s*\{%\s+include\s+image.html\s+(.+?)(\s+\w+="(?:[^"\\]|\\.)*")*\s*%}/mg;
const NameValuePattern = /(\w+)="((?:[^"\\]|\\.)*)"/g;
const BasePath = "../../assets/blog/";

const postPaths = glob.sync("src/content/blog/*.md");

function replaceInclude(
	include)
{
	const pairs = [...include.matchAll(NameValuePattern)];
	const data = pairs.reduce((result, [, key, value]) => ({
		...result,
		[key]: value
	}), {});
	const { name, alt, caption } = data;

	if (name) {
		return `![${alt || "Photo"}](${BasePath}${name})${caption ? `\n*${caption}*` : ""}`;
	}

	return include;
}

const updatedFiles = [];

for (const postPath of postPaths) {
	const content = await fs.readFile(postPath, "utf-8");
	const newContent = content.replace(IncludeImagePattern, replaceInclude);

	if (content !== newContent) {
		const filename = path.basename(postPath);

		updatedFiles.push(filename);
		await fs.writeFile(postPath, newContent);
	}
}

console.log("Updated blog files:\n" + updatedFiles.join("\n"));
