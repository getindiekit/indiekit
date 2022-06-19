import dateFns from "date-fns";
import locales from "date-fns/locale/index.js";
import languages from "iso-639-1";

const { format, parseISO } = dateFns;

/**
 * Format a date
 *
 * @param {string} string - ISO 8601 date
 * @param {string} tokens - Tokenised date format
 * @param {string} locale - ISO 639-1 (plus optional country code)
 * @returns {string} Formatted date
 */
export const date = (string, tokens, locale = "en") => {
  locale = locales[locale.replace("-", "")];
  const date = string === "now" ? new Date() : parseISO(string);
  const dateTime = format(date, tokens, { locale });
  return dateTime;
};

/**
 * Get native language name
 *
 * @param {string} string - ISO 639-1 language code
 * @returns {string} Native language name
 *
 * @example language('de') => Deutsch
 */
export const language = (string) => languages.getNativeName(string);
