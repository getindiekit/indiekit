import { format, parseISO } from "date-fns";
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
