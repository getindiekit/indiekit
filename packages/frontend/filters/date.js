import luxon from 'luxon';

/**
 * Format a date.
 *
 * @param {string} string ISO 8601 date
 * @param {string} format Tokenised date format
 * @param {string} locale Locale
 * @returns {string} Formatted date
 */
export const date = (string, format, locale = 'en-GB') => {
  const {DateTime} = luxon;
  const date = (string === 'now') ? DateTime.local() : string;
  const datetime = DateTime.fromISO(date, {
    locale,
    zone: 'utc'
  }).toFormat(format);
  return datetime;
};
