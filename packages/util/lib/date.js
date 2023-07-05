import { parseISO } from "date-fns";
import { format, utcToZonedTime } from "date-fns-tz";
import locales from "date-fns/locale/index.js";

/**
 * Format a date
 * @param {string} string - ISO 8601 date
 * @param {string} tokens - Tokenised date format
 * @param {string} lang - ISO 639-1 (plus optional country code)
 * @returns {string} Formatted date
 */
export const formatDate = (string, tokens, lang = "en") => {
  const locale = locales[lang.replace("-", "")];
  const date = string === "now" ? new Date() : parseISO(string);
  const dateTime = format(date, tokens, { locale });
  return dateTime;
};

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

/**
 * Get local time zone offset in hours and minutes
 * @returns {string} Local time zone offset, i.e. +5:30, -6:00 or Z
 */
export const getServerTimeZone = () => {
  const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
  const timeZoneOffsetHours = Math.abs(timeZoneOffsetMinutes / 60).toString();

  const offsetHours = Number.parseInt(timeZoneOffsetHours, 10);
  const offsetMinutes = Math.abs(timeZoneOffsetMinutes % 60);

  const hh = String(offsetHours).padStart(2, "0");
  const mm = String(offsetMinutes).padStart(2, "0");

  // Add an opposite sign to the offset
  // If offset is 0, timezone is UTC
  let timeZoneOffset;
  if (timeZoneOffsetMinutes < 0) {
    timeZoneOffset = `+${hh}:${mm}`;
  } else if (timeZoneOffsetMinutes > 0) {
    timeZoneOffset = `-${hh}:${mm}`;
  } else if (timeZoneOffsetMinutes === 0) {
    timeZoneOffset = "Z";
  }

  return timeZoneOffset;
};
