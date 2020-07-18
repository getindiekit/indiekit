import dateFns from 'date-fns';
import uriTemplate from 'uri-template-lite';

const {format, parseISO} = dateFns;
const {URI} = uriTemplate;

/**
 * Generate random alpha-numeric string, 5 characters long
 *
 * @returns {string} Alpha-numeric string
 * @example random() => 'b3dog'
 */
export const randomString = () => {
  return (Number(new Date())).toString(36).slice(-5);
};

/**
 * Render path from URI template and properties
 *
 * @param {string} path URI template path
 * @param {object} properties Properties to use
 * @returns {string} Path
 */
export const renderPath = (path, properties) => {
  const date = parseISO(properties.uploaded);
  const dateTokens = [
    'y', // Calendar year, eg 2020
    'yyyy', // Calendar year (zero padded), eg 2020
    'M', // Month number, eg 9
    'MM', // Month number (zero padded), eg 09
    'MMM', // Month name (abbreviated), eg Sep
    'MMMM', // Month name (wide), eg September
    'w', // Week number, eg 1
    'ww', // Week number (zero padded), eg 01
    'D', // Day of the year, eg 1
    'DDD', // Day of the year (zero padded), eg 001
    'd', // Day of the month, eg 1
    'dd', // Day of the month (zero padded), eg 01
    'h', // Hour (12-hour-cycle), eg 1
    'hh', // Hour (12-hour-cycle, zero padded), eg 01
    'H', // Hour (24-hour-cycle), eg 1
    'HH', // Hour (24-hour-cycle, zero padded), eg 01
    'm', // Minute, eg 1
    'mm', // Minute (zero padded), eg 01
    's', // Second, eg 1
    't', // UNIX epoch seconds, eg 512969520
    'T' // UNIX epoch milliseconds, eg 51296952000
  ];

  // Add date tokens to properties object
  dateTokens.forEach(token => {
    properties[token] = format(date, token, {
      useAdditionalDayOfYearTokens: true
    });
  });

  // Populate URI template path with properties
  path = URI.expand(path, properties);

  return path;
};

/**
 * Get post type configuration for a given type
 *
 * @param {string} type Post type
 * @param {object} config Publication configuration
 * @returns {object} Post type configuration
 */
export const getPostTypeConfig = (type, config) => {
  return config['post-types'].find(
    item => item.type === type
  );
};
