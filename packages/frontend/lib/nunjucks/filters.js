import Color from 'color';
import dateFns from 'date-fns';
import markdownIt from '../markdown-it.js';

const {format, parseISO} = dateFns;

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
 * @returns {string} Formatted date
 */
export const date = (string, tokens) => {
  const date = (string === 'now') ? new Date() : parseISO(string);
  const datetime = format(date, tokens);
  return datetime;
};

/**
 * Transform errors provided by express-validator into array that can be
 * consumed by the error summary component.
 *
 * @param {object} errorMap Mapped error response from express-validator
 * @returns {Array} List of errors
 */
export const errorList = errorMap => {
  const camelToSnakeCase = string =>
    string.replace(/[A-Z]/g, letter =>
      `-${letter.toLowerCase()}`);

  // For each field that has errors, return only the first error
  const errorList = [];
  const fieldsWithErrors = Object.entries(errorMap);
  fieldsWithErrors.forEach(fieldError => {
    errorList.push({
      text: fieldError[1].msg,
      href: `#${camelToSnakeCase(fieldError[1].param)}`
    });
  });

  return errorList;
};

/**
 * Render Markdown string as HTML
 *
 * @param {string} string Markdown
 * @param {string} value If 'inline', HTML rendered without paragraph tags
 * @returns {string} HTML
 */
export const markdown = (string, value) => {
  if (string) {
    if (value === 'inline') {
      return markdownIt.renderInline(string);
    }

    return markdownIt.render(string);
  }
};
