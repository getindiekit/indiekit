import { tz, tzOffset } from "@date-fns/tz";
import { format, parseISO } from "date-fns";
import * as locales from "date-fns/locale";

export const dateTokens = [
  "y", // Calendar year, eg 2020
  "yyyy", // Calendar year (zero-padded), eg 2020
  "M", // Month number, eg 9
  "MM", // Month number (zero-padded), eg 09
  "MMM", // Month name (abbreviated), eg Sep
  "MMMM", // Month name (wide), eg September
  "w", // Week number, eg 1
  "ww", // Week number (zero-padded), eg 01
  "D", // Day of the year, eg 1
  "DDD", // Day of the year (zero-padded), eg 001
  "d", // Day of the month, eg 1
  "dd", // Day of the month (zero-padded), eg 01
  "h", // Hour (12-hour-cycle), eg 1
  "hh", // Hour (12-hour-cycle, zero-padded), eg 01
  "H", // Hour (24-hour-cycle), eg 1
  "HH", // Hour (24-hour-cycle, zero-padded), eg 01
  "m", // Minute, eg 1
  "mm", // Minute (zero-padded), eg 01
  "s", // Second, eg 1
  "ss", // Second (zero-padded), eg 01
  "t", // UNIX epoch seconds, eg 512969520
  "T", // UNIX epoch milliseconds, eg 51296952000
];

/**
 * Format a date
 * @param {string} string - ISO 8601 date
 * @param {string} tokens - Tokenised date format
 * @param {object} [options] - Options
 * @param {string} [options.locale] - Locale
 * @param {string} [options.timeZone] - Time zone
 * @param {boolean} [options.useAdditionalDayOfYearTokens] - Allows day of year tokens
 * @returns {string} Formatted date
 */
export const formatDate = (string, tokens, options = {}) => {
  const formattedLocale = String(options.locale || "en").replace("-", "");

  // Convert options object to options expected for `FormatOptionsWithTZ`
  const formatOptions = {
    ...options,
    // eslint-disable-next-line import/namespace
    ...(options.locale && { locale: locales[formattedLocale] }),
  };

  const date = string === "now" ? new Date() : parseISO(string);
  const dateTime = format(date, tokens, formatOptions);
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
  const dateTime = format(string, "yyyy-MM-dd'T'HH:mm", {
    in: tz(timeZone),
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
  const dateTime = dateString ? new Date(dateString) : new Date();

  // Desired time zone
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const outputTimeZone = setting === "server" ? timeZone : setting;

  // Short dates, i.e. 2019-02-01
  // Don’t covert dates without a given time
  const dateHasTime = dateString ? dateString.includes("T") : false;
  const dateIsShort = dateString && !dateHasTime;
  if (dateIsShort) {
    const offset = format(dateTime, "XXX", {
      in: tz(outputTimeZone),
    });
    return `${dateString}T00:00:00.000${offset}`;
  }

  // Return date time with desired timezone offset
  const formattedDateTime = format(dateTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {
    in: tz(outputTimeZone),
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
    designator = "+00:00";
  }

  return designator;
};

/**
 * Get offset minutes from time zone name
 * @param {string} timeZone - IANA tz timezone
 * @param {Date} date - Date time
 * @returns {number} Minutes offset from UTC
 */
export const getTimeZoneOffset = (timeZone, date) => {
  const minutes = tzOffset(timeZone, date);

  // Ensure `tzOffset()` returns same value as
  // `Date.prototype.getTimezoneOffset()`
  const offset = minutes === 0 ? 0 : minutes * -1;
  return offset;
};

/**
 * Check if a string can be parsed as a date
 * @param {string} string - String
 * @returns {boolean} String is a date
 */
export const isDate = (string) => {
  try {
    const date = new Date(string);
    date.toISOString();
    return true;
  } catch {
    return false;
  }
};
