import path from "node:path";
import dateFnsTz from "date-fns-tz";
import newbase60 from "newbase60";
import { v4 as uuidv4 } from "uuid";
import { getServerTimeZone } from "./date.js";

const { format } = dateFnsTz;

/**
 * Generate pagination data
 *
 * @param {number} currentPage Current page
 * @param {limit} limit Limit of items per page
 * @param {count} count Count of all items
 * @returns {object}
 */
export const getPages = (currentPage, limit, count) => {
  // Pagination pages
  const totalPages = Math.ceil(count / limit);
  const nextPage = currentPage < totalPages ? currentPage + 1 : false;
  const previousPage = currentPage > 0 ? currentPage - 1 : false;
  const pageItems = [...Array(totalPages).keys()].map((item) => ({
    current: item + 1 === currentPage,
    href: `?${new URLSearchParams({ page: item + 1, limit })}`,
    text: item + 1,
  }));

  // Pagination results
  const resultsFrom = (currentPage - 1) * limit + 1;
  let resultsTo = resultsFrom - 1 + limit;
  resultsTo = resultsTo > count ? count : resultsTo;

  return {
    items: pageItems.length > 1 ? pageItems : false,
    next: nextPage
      ? {
          href: `?${new URLSearchParams({ page: nextPage, limit })}`,
        }
      : false,
    previous: previousPage
      ? {
          href: `?${new URLSearchParams({ page: previousPage, limit })}`,
        }
      : false,
    results: {
      from: resultsFrom,
      to: resultsTo,
      count,
    },
  };
};

/**
 * Generate random alpha-numeric string, 5 characters long
 *
 * @returns {string} Alpha-numeric string
 * @example random() => 'f0pjf'
 */
export const randomString = () => Math.random().toString(36).slice(-5);

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

/**
 * Derive a permalink (by combining publication URL, that may
 * include a path, with the path to a post or file
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
