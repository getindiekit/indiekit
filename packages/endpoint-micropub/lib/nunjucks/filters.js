import luxon from 'luxon';

const {DateTime} = luxon;

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
  const date = (string === 'now') ? DateTime.local() : string;
  const datetime = DateTime.fromISO(date, {
    locale,
    zone
  }).toFormat(format);
  return datetime;
};
