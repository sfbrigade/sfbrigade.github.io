import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// interpret all date strings as Pacific time, in case this gets built in some
// other time zone
dayjs.tz.setDefault("America/Los_Angeles");

export default dayjs;

export const parseYMD = (date: string) => dayjs(date, "YYYY-MM-DD", true);
export const parseYMDToDate = (date: string) => parseYMD(date).toDate();
export const formatShortMDY = (date: Date) => date ? dayjs(date).format("MMM D, YYYY") : "";