import {
  dateTokens,
  formatDate,
  getTimeZoneDesignator,
  isDate,
  randomString,
  supplant,
} from "@indiekit/util";
import newbase60 from "newbase60";
import { postTypeCount } from "./post-type-count.js";

/**
 * Decode form-encoded query parameter
 * @param {*} value - Parameter value to decode
 * @returns {*} Decoded string, else original parameter value
 * @example decodeQueryParameter(['foo', 'bar']) => ['foo', 'bar']
 * @example decodeQueryParameter('2024-02-14T13:24:00+0100') => '2024-02-14T13:24:00+0100'
 * @example decodeQueryParameter('https%3A%2F%2Ffoo.bar') => 'https://foo.bar'
 * @example decodeQueryParameter('foo+bar') => 'foo bar'
 */
export const decodeQueryParameter = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return isDate(value)
    ? decodeURIComponent(value)
    : decodeURIComponent(value.replaceAll("+", " "));
};

/**
 * Excerpt the first n words from a string
 * @param {string} string - String to excerpt
 * @param {number} n - Max number of words
 * @returns {string|undefined} Excerpt
 * @example excerptString('Foo bar baz', 2) => 'Foo bar'
 */
export const excerptString = (string, n) => {
  if (typeof string === "string") {
    const excerpt = string.split(/\s+/).slice(0, n).join(" ");
    return excerpt;
  }
};

/**
 * Get post template properties
 * @param {object} properties - JF2 properties
 * @returns {object} Template properties
 */
export const getPostTemplateProperties = (properties) => {
  const templateProperties = structuredClone(properties);

  for (let key in templateProperties) {
    // Remove server commands from post template properties
    if (key.startsWith("mp-")) {
      delete templateProperties[key];
    }

    // Remove post-type property, only needed internally
    if (key === "post-type") {
      delete templateProperties["post-type"];
    }
  }

  return templateProperties;
};

/**
 * Render relative path if URL is on publication
 * @param {string} url - External URL
 * @param {string} me - Publication URL
 * @returns {string} Path
 */
export const relativeMediaPath = (url, me) =>
  url.includes(me) ? url.replace(me, "") : url;

/**
 * Render path from URI template and properties
 * @param {string} path - URI template path
 * @param {object} properties - JF2 properties
 * @param {object} application - Application configuration
 * @param {string} separator - Slug separator
 * @returns {Promise<string>} Path
 */
export const renderPath = async (path, properties, application, separator) => {
  const dateObject = new Date(properties.published);
  const serverTimeZone = getTimeZoneDesignator();
  const { locale, timeZone } = application;
  let tokens = {};

  // Add date tokens
  for (const dateToken of dateTokens) {
    tokens[dateToken] = formatDate(properties.published, dateToken, {
      locale,
      timeZone: timeZone === "server" ? serverTimeZone : timeZone,
      // @ts-ignore (https://github.com/marnusw/date-fns-tz/issues/239)
      useAdditionalDayOfYearTokens: true,
    });
  }

  // Add day of the year (NewBase60) token
  tokens.D60 = newbase60.DateToSxg(dateObject); // eslint-disable-line new-cap

  // Add count of post-type for the day
  const count = await postTypeCount.get(application, properties);
  tokens.n = count + 1;

  // Add random token
  tokens.random = randomString(5)
    .replace(separator, "0") // Don’t use slug separator character
    .toLowerCase();

  // Add slug token
  tokens.slug = properties.slug;

  // Add UUID token
  tokens.uuid = crypto.randomUUID();

  // Populate URI template path with properties
  path = supplant(path, tokens);

  return path;
};

/**
 * Convert string to array if not already an array
 * @param {string|Array} object - String or array to convert
 * @returns {Array} Array
 */
export const toArray = (object) => (Array.isArray(object) ? object : [object]);
