import { getServerTimeZone } from "@indiekit/util";
import { format, utcToZonedTime } from "date-fns-tz";

/**
 * Converts date to use configured time zone
 * @param {string} setting - Time zone setting
 * @param {string} dateString - Date string
 * @returns {string} Converted date
 *
 * setting options:
 *   `client`: don’t transform incoming date
 *   `server`: use server’s time zone
 *   [IANA tz timezone]: use specified time zone
 */
export const getDate = (setting, dateString) => {
  if (setting === "client") {
    // Return given date string or create ISO string using current date
    return dateString || new Date().toISOString();
  }

  // Date time is given date or new date, set us UTC
  let dateTime = dateString ? new Date(dateString) : new Date();

  // Desired time zone
  const serverTimeZone = getServerTimeZone();
  const outputTimeZone = setting === "server" ? serverTimeZone : setting;

  // Short dates, i.e. 2019-02-01
  // Don’t covert dates without a given time
  const dateHasTime = dateString ? dateString.includes("T") : false;
  const dateIsShort = dateString && !dateHasTime;
  if (dateIsShort) {
    const offset = format(dateTime, "XXX", {
      timeZone: outputTimeZone,
    });
    return `${dateString}T00:00:00.000${offset}`;
  }

  // JS converts dateString to UTC, so need to convert it to output zoned time
  dateTime = utcToZonedTime(dateTime, outputTimeZone);

  // Return date time with desired timezone offset
  const formattedDateTime = format(dateTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {
    timeZone: outputTimeZone,
  });

  return formattedDateTime;
};
