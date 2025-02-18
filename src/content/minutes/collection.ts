import { defineCollection, z } from "astro:content";
import type { drive_v3 } from "googleapis";
import { createLoader } from "./loader.ts";

const MinutesPDFPattern = /(\d{4})[- _]+Q(\d)/;
const DraftPDFPattern = /^DRAFT\s+(\d{4})[- _]+Q(\d)/i;
// strip this unnecessary param from the viewLinks
const USPPattern = /\?usp=\w+$/;

const credentials = JSON.parse(import.meta.env.BOARD_MINUTES_DRIVE_KEYS_JSON ?? "");
const driveID = import.meta.env.BOARD_MINUTES_DRIVE_ID ?? "";
// the path should be from the root of the shared drive to the folder containing
// the PDFs of the minutes
const minutesFolder = import.meta.env.BOARD_MINUTES_DRIVE_FOLDER ?? "";

const MinutesSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdTime: z.string(),
	url: z.string(),
	year: z.number(),
	quarter: z.number(),
	isDraft: z.boolean().default(false),
});

async function preprocess(
	files: drive_v3.Schema$File[])
{
	// use flatMap() so we can filter out files we want to skip without TS
	// complaining that the array might contain nulls
	return files.flatMap((file) => {
		const result = file.name?.match(MinutesPDFPattern);

		if (!result || file.mimeType !== "application/pdf") {
			return [];
		}

		const year = parseInt(result[1]);
		const quarter = parseInt(result[2]);
		const isDraft = DraftPDFPattern.test(file.name ?? "");

		return {
			...file,
			year,
			quarter,
			isDraft,
			url: file.webViewLink?.replace(USPPattern, "") ?? "",
		};
	});
}

export const minutes = defineCollection({
	loader: createLoader("minutes", credentials, driveID, [minutesFolder], preprocess),
	schema: MinutesSchema
});
