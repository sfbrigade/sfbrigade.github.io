import { parseYMDToDate } from "@/utils/dayjs";

export function dateFromSlug(
	slug: string)
{
	const leadingDate = slug.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

	if (leadingDate) {
		return parseYMDToDate(leadingDate);
	}

	console.warn(`WARNING: dateFromSlug(): No date found in "${slug}"`);

	return new Date(0);
}
