import { parseYMDToDate } from "@/utils";

export function dateFromSlug(
	slug: string)
{
	const leadingDate = slug.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

	if (leadingDate) {
		return parseYMDToDate(leadingDate);
	}

	return null;
}
