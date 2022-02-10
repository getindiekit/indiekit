import path from "node:path";
import dateFnsTz from "date-fns-tz";
import newbase60 from "newbase60";
import slugify from "@sindresorhus/slugify";
import { v4 as uuidv4 } from "uuid";
import { getServerTimeZone } from "./date.js";

const { format } = dateFnsTz;

/**
 * Decode form-encoded query parameter
 *
 * @param {string} string String to decode
 * @returns {string} Decoded string
 * @example decodeQueryParameter('foo+bar') => 'foo bar'
 * @example decodeQueryParameter('https%3A%2F%2Ffoo.bar') => 'https://foo.bar'
 */
export const decodeQueryParameter = (string) =>
  decodeURIComponent(string.replace(/\+/g, " "));

/**
 * Excerpt the first n words from a string
 *
 * @param {string} string String to excerpt
 * @param {number} n Max number of words
 * @returns {string} Excerpt
 * @example excerptString('Foo bar baz', 2) => 'Foo bar'
 */
export const excerptString = (string, n) => {
  if (typeof string === "string") {
    const excerpt = string.split(/\s+/).slice(0, n).join(" ");
    return excerpt;
  }
};

/**
 * Slugify a string
 *
 * @param {string} string String to excerpt
 * @param {number} separator Character used to separate words
 * @returns {string} Slugified string
 * @example slugifyString('Foo bar baz', '_') => 'foo_bar_baz'
 */
export const slugifyString = (string, separator = "-") => {
  if (typeof string === "string") {
    const slug = slugify(string, {
      customReplacements: [
        ["'", ""],
        ["’", ""],
      ],
      decamelize: false,
      separator,
    });
    return slug;
  }
};

/**
 * Derive a permalink (by combining publication URL, that may include a
 * path, with the path to a post or file
 *
 * @param {object} url URL
 * @param {object} pathname Permalink path
 * @returns {string} Returns either 'photo', 'video' or audio
 * @example permalink('http://foo.bar/baz', '/qux/quux') =>
 *   'http://foo.bar/baz/qux/quux'
 */
export const getPermalink = (url, pathname) => {
  url = new URL(url);
  let permalink = path.join(url.pathname, pathname);
  permalink = new URL(permalink, url).href;

  return permalink;
};

/**
 * Get post type configuration for a given type
 *
 * @param {string} type Post type
 * @param {object} postTypes Publication post types
 * @returns {object} Post type configuration
 */
export const getPostTypeConfig = (type, postTypes) =>
  postTypes.find((item) => item.type === type);

/**
 * Generate random alpha-numeric string, 5 characters long
 *
 * @returns {string} Alpha-numeric string
 * @example random() => 'jb6zm'
 */
export const randomString = () => Math.random().toString(36).slice(-5);

/**
 * Render relative path if URL is on publication
 *
 * @param {URL} url External URL
 * @param {URL} me Publication URL
 * @returns {string} Path
 */
export const relativeMediaPath = (url, me) =>
  url.includes(me) ? url.replace(me, "") : url;

/**
 * Render path from URI template and properties
 *
 * @param {string} path URI template path
 * @param {object} properties Properties to use
 * @param {string} timeZoneSetting Time zone setting
 * @returns {string} Path
 */
export const renderPath = (path, properties, timeZoneSetting) => {
  let tokens = {};
  const dateObject = new Date(properties.published);
  const serverTimeZone = getServerTimeZone();
  const dateTokens = [
    "y", // Calendar year, eg 2020
    "yyyy", // Calendar year (zero-padded), eg 2020
    "M", // Month number, eg 9
    "MM", // Month number (zero-padded), eg 09
    "MMM", // Month name (abbreviated), eg Sep
    "MMMM", // Month name (wide), eg September
    "w", // Week number, eg 1
    "ww", // Week number (zero-padded), eg 01
    "D", // Day of the year, eg 1
    "DDD", // Day of the year (zero-padded), eg 001
    "d", // Day of the month, eg 1
    "dd", // Day of the month (zero-padded), eg 01
    "h", // Hour (12-hour-cycle), eg 1
    "hh", // Hour (12-hour-cycle, zero-padded), eg 01
    "H", // Hour (24-hour-cycle), eg 1
    "HH", // Hour (24-hour-cycle, zero-padded), eg 01
    "m", // Minute, eg 1
    "mm", // Minute (zero-padded), eg 01
    "s", // Second, eg 1
    "ss", // Second (zero-padded), eg 01
    "t", // UNIX epoch seconds, eg 512969520
    "T", // UNIX epoch milliseconds, eg 51296952000
  ];

  // Add date tokens
  for (const dateToken of dateTokens) {
    tokens[dateToken] = format(dateObject, dateToken, {
      timeZone: timeZoneSetting === "server" ? serverTimeZone : timeZoneSetting,
      useAdditionalDayOfYearTokens: true,
    });
  }

  // Add day of the year (NewBase60) token
  tokens.D60 = newbase60.DateToSxg(dateObject); // eslint-disable-line new-cap

  // Add slug token if 'mp-slug' property
  if (properties["mp-slug"]) {
    tokens.slug = properties["mp-slug"];
  }

  // Add UUID token
  tokens.uuid = uuidv4();

  // Populate URI template path with properties
  tokens = { ...tokens, ...properties };
  path = supplant(path, tokens);

  return path;
};

/**
 * Substitute variables enclosed in { } braces with data from object
 *
 * @param {string} string String to parse
 * @param {object} object Properties to use
 * @returns {string} String with substituted
 */
export const supplant = (string, object) =>
  string.replace(/{([^{}]*)}/g, (a, b) => {
    const r = object[b];

    if (typeof r === "string" || typeof r === "number") {
      return r;
    }

    return a;
  });
