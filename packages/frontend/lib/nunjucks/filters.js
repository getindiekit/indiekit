import Color from 'color';
import luxon from 'luxon';
import markdownIt from '../markdown-it.js';

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
 * @param {string} format Tokenised date format
 * @param {object} locale Locale to use for formatting datetime
 * @param {object} zone Timezone offset
 * @returns {string} Formatted date
 */
export const date = (string, format, locale = 'en-GB', zone = 'utc') => {
  const {DateTime} = luxon;
  const date = (string === 'now') ? DateTime.local() : string;
  const datetime = DateTime.fromISO(date, {
    locale,
    zone
  }).toFormat(format);
  return datetime;
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
