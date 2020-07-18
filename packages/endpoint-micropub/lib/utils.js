import _ from 'lodash';
import dateFns from 'date-fns';
import uriTemplate from 'uri-template-lite';

const {format, parseISO} = dateFns;
const {URI} = uriTemplate;

/**
 * Decode form-encoded query parameter
 *
 * @param {string} string String to decode
 * @returns {string} Decoded string
 * @example decodeQueryParameter('foo+bar') => 'foo bar'
 * @example decodeQueryParameter('https%3A%2F%2Ffoo.bar') => 'https://foo.bar'
 */
export const decodeQueryParameter = string => {
  return decodeURIComponent(string.replace(/\+/g, ' '));
};

/**
 * Excerpt first n words from a string
 *
 * @param {string} string String to excerpt
 * @param {number} n Max number of words
 * @returns {string} Excerpt
 * @example excerpt('Foo bar baz', 2) => 'Foo bar'
 */
export const excerptString = (string, n) => {
  if (typeof string === 'string') {
    string = string.split(/\s+/).slice(0, n).join(' ');
    return string;
  }
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
  const date = parseISO(properties.published[0]);
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
 * Add properties to object
 *
 * @param {object} object Object to update
 * @param {object} additions Properties to add
 * @returns {object} Updated object
 */
export const addProperties = (object, additions) => {
  for (const key in additions) {
    if (Object.prototype.hasOwnProperty.call(additions, key)) {
      const newValue = additions[key];
      const existingValue = object[key];

      // If no existing value, add it
      if (!existingValue) {
        object[key] = newValue;
        return object;
      }

      // If existing value, add to it
      if (existingValue) {
        const updatedValue = [...existingValue];

        for (const value of newValue) {
          updatedValue.push(value);
        }

        object = _.set(object, key, updatedValue);
        return object;
      }
    }
  }
};

/**
 * Delete individual entries for properties of an object
 *
 * @param {object} object Object to update
 * @param {object} deletions Property entries to delete
 * @returns {object} Updated object
 */
export const deleteEntries = (object, deletions) => {
  for (const key in deletions) {
    if (Object.prototype.hasOwnProperty.call(deletions, key)) {
      const valuesToDelete = deletions[key];

      if (!Array.isArray(valuesToDelete)) {
        throw new TypeError(`${key} should be an array`);
      }

      const values = object[key];
      if (!valuesToDelete || !values) {
        return object;
      }

      for (const value of valuesToDelete) {
        const index = values.indexOf(value);
        if (index > -1) {
          values.splice(index, 1);
        }

        if (values.length === 0) {
          delete object[key]; // Delete property if no values remain
        } else {
          object[key] = values;
        }
      }
    }
  }

  return object;
};

/**
 * Delete properties of an object
 *
 * @param {object} object Object to update
 * @param {Array} deletions Properties to delete
 * @returns {object} Updated object
 */
export const deleteProperties = (object, deletions) => {
  for (const key of deletions) {
    delete object[key];
  }

  return object;
};

/**
 * Replace entries of a property. If property doesn’t exist, create it.
 *
 * @param {object} object Object to update
 * @param {object} replacements Properties to replace
 * @returns {object} Updated object
 */
export const replaceEntries = (object, replacements) => {
  for (const key in replacements) {
    if (Object.prototype.hasOwnProperty.call(replacements, key)) {
      const value = replacements[key];
      object = _.set(object, key, value);
    }
  }

  return object;
};
