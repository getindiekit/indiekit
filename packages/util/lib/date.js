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
