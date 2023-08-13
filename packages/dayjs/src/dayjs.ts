import anotherDayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

anotherDayjs.extend(timezone);
anotherDayjs.extend(utc);
anotherDayjs.extend(relativeTime);

export default function dayjs(
  date?: string | number | anotherDayjs.Dayjs | Date | null | undefined
) {
  return anotherDayjs(date).tz("Asia/Hong_Kong");
}

export function formatDate(date: Date | null, defaultValue = "-") {
  if (date) {
    return dayjs(date).format("YYYY-MM-DD HH:mm");
  } else {
    return defaultValue;
  }
}

export function displayDateOrTime(date: Date) {
  const inputDay = dayjs(date);

  if (!inputDay.isValid()) {
    return "";
  }

  const now = dayjs();

  if (now.diff(inputDay, "hour") > 24) {
    return inputDay.format("YYYY-MM-DD");
  } else {
    return inputDay.format("HH:mm");
  }
}

export function fromNow(date: Date | null, defaultValue = "-") {
  if (date) {
    return dayjs(date).fromNow();
  } else {
    return defaultValue;
  }
}
