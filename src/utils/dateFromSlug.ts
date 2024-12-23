import { parseYMDToDate } from "@/utils/dayjs";

const YMDPattern = /^\d{4}-\d{2}-\d{2}/;

export function dateFromSlug(
	slug: string)
{
	const leadingDate = slug.match(YMDPattern)?.[0];

	if (leadingDate) {
		return parseYMDToDate(leadingDate);
	}

	console.warn(`WARNING: dateFromSlug(): No date found in "${slug}"`);

	return new Date(0);
}

export function dateStringFromSlug(
	slug: string)
{
	return slug.match(YMDPattern)?.[0];
}
