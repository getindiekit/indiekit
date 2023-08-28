import { parseISO } from "date-fns";
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
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
 * Format a date as local date
 * Used to convert date to value consumable by input[type="datetime-local"]
 * @param {Date|string|number} string - Zoned date, i.e. 2023-08-28T12:30+01:00
 * @param {string} timeZone - Time zone
 * @returns {string} Formatted local date, i.e. 2023-08-28T12:30
 */
export const formatDateToLocal = (string, timeZone) => {
  const zonedDateTime = zonedTimeToUtc(string, timeZone);
  const dateTime = format(zonedDateTime, "yyyy-MM-dd'T'HH:mm", {
    timeZone,
  });

  return dateTime;
};

/**
 * Converts date to use configured time zone
 * @param {string} setting - Time zone setting
 * @param {string} [dateString] - Date string
 * @returns {string} Converted date
 *
 * setting options:
 *   `client`: don’t transform incoming date
 *   `server`: use server’s time zone
 *   [IANA tz timezone]: use specified time zone
 */
export const getDate = (setting, dateString = "") => {
  if (setting === "client") {
    // Return given date string or create ISO string using current date
    return dateString || new Date().toISOString();
  }

  // Date time is given date or new date, set us UTC
  let dateTime = dateString ? new Date(dateString) : new Date();

  // Desired time zone
  const serverTimeZone = getTimeZoneDesignator();
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
 * @param {number} [minutes] - Time zone offset in minutes
 * @returns {string} Local time zone designator, i.e. +05:30, -06:00 or Z
 */
export const getTimeZoneDesignator = (minutes) => {
  minutes = minutes || minutes === 0 ? minutes : new Date().getTimezoneOffset();
  const hours = Math.abs(minutes / 60).toString();

  const offsetHours = Number.parseInt(hours, 10);
  const offsetMinutes = Math.abs(minutes % 60);

  const hh = String(offsetHours).padStart(2, "0");
  const mm = String(offsetMinutes).padStart(2, "0");

  // Prepend positive/negative symbol to designator
  // If offset minutes is 0, time zone is UTC, so use Z
  let designator;
  if (minutes < 0) {
    designator = `+${hh}:${mm}`;
  } else if (minutes > 0) {
    designator = `-${hh}:${mm}`;
  } else if (minutes === 0) {
    designator = "Z";
  }

  return designator;
};
