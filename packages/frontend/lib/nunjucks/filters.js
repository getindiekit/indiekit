import path from "node:path";
import Color from "color";
import dateFns from "date-fns";
import languages from "iso-639-1";
import locales from "date-fns/locale/index.js";
import markdownIt from "../markdown-it.js";

const { format, parseISO } = dateFns;

/**
 * Get absolute URL or path
 *
 * @param {string} string URL or path
 * @param {string} baseUrl Base URL
 * @returns {URL} Absolute URL
 */
export const absoluteUrl = (string, baseUrl) => {
  string = String(string);

  try {
    return new URL(string, baseUrl).href;
  } catch {
    return path.posix.join(baseUrl, string);
  }
};

/**
 * Darken a color
 *
 * @param {string} string Color string
 * @param {string} value Darken amount
 * @returns {string} Hex color
 */
export const darken = (string, value) => {
  const color = new Color(string);
  return color.darken(value).hex();
};

/**
 * Lighten a color
 *
 * @param {string} string Color string
 * @param {string} value Lighten amount
 * @returns {string} Hex color
 */
export const lighten = (string, value) => {
  const color = new Color(string);
  return color.lighten(value).hex();
};

/**
 * Format a date
 *
 * @param {string} string ISO 8601 date
 * @param {string} tokens Tokenised date format
 * @param {string} locale ISO 639-1 (plus optional country code)
 * @returns {string} Formatted date
 */
export const date = (string, tokens, locale = "en") => {
  locale = locales[locale.replace("-", "")];
  const date = string === "now" ? new Date() : parseISO(string);
  const dateTime = format(date, tokens, { locale });
  return dateTime;
};

/**
 * Transform errors provided by express-validator into array that can be
 * consumed by the error summary component.
 *
 * @param {object} errorMap Mapped error response from express-validator
 * @returns {Array} List of errors
 */
export const errorList = (errorMap) => {
  const camelToSnakeCase = (string) =>
    string.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

  // For each field that has errors, return only the first error
  const errorList = [];
  const fieldsWithErrors = Object.entries(errorMap);
  for (const fieldError of fieldsWithErrors) {
    errorList.push({
      text: fieldError[1].msg,
      href: `#${camelToSnakeCase(fieldError[1].param)}`,
    });
  }

  return errorList;
};

/**
 * Get native language name
 *
 * @param {string} string ISO 639-1 language code
 * @returns {string} Native language name
 * @example language('de') => Deutsch
 */
export const language = (string) => languages.getNativeName(string);

/**
 * Render Markdown string as HTML
 *
 * @param {string} string Markdown
 * @param {string} value If 'inline', HTML rendered without paragraph tags
 * @returns {string} HTML
 */
export const markdown = (string, value) => {
  if (string) {
    if (value === "inline") {
      return markdownIt.renderInline(string);
    }

    return markdownIt.render(string);
  }
};

/**
 * Transform object into an array that can be consumed by the summary component.
 *
 * @param {object} object Object
 * @returns {Array} Rows
 */
export const summaryRows = (object) => {
  const rows = [];

  for (const [key, value] of Object.entries(object)) {
    rows.push({
      key: {
        text: key,
      },
      value: {
        text:
          typeof value === "string"
            ? value
            : markdown(`~~~json\n${JSON.stringify(value, 0, 2)}\n~~~`),
      },
    });
  }

  return rows;
};
