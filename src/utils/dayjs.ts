import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.tz.setDefault("America/Los_Angeles");

export default dayjs;

// TODO: need to pass in an offset or timezone?  otw it will parse based on server's timezone
export const parseYMD = (date: string) => dayjs(date, "YYYY-MM-DD", true);
export const parseYMDToDate = (date: string) => parseYMD(date).toDate();
