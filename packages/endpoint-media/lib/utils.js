import crypto from "node:crypto";
import { getServerTimeZone, supplant } from "@indiekit/util";
import { format } from "date-fns-tz";
import newbase60 from "newbase60";
import { mediaTypeCount } from "./media-type-count.js";

/**
 * Render path from URI template and properties
 * @param {string} path - URI template path
 * @param {object} properties - Properties to use
 * @param {object} application - Application configuration
 * @returns {Promise<string>} Path
 */
export const renderPath = async (path, properties, application) => {
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
      timeZone:
        application.timeZone === "server"
          ? serverTimeZone
          : application.timeZone,
      // @ts-ignore (https://github.com/marnusw/date-fns-tz/issues/239)
      useAdditionalDayOfYearTokens: true,
    });
  }

  // Add day of the year (NewBase60) token
  tokens.D60 = newbase60.DateToSxg(dateObject); // eslint-disable-line new-cap

  // Add count of media type for the day
  const count = await mediaTypeCount.get(application, properties);
  tokens.n = count + 1;

  // Add slug token if 'mp-slug' property
  if (properties["mp-slug"]) {
    tokens.slug = properties["mp-slug"];
  }

  // Add UUID token
  tokens.uuid = crypto.randomUUID();

  // Populate URI template path with properties
  tokens = { ...tokens, ...properties };
  path = supplant(path, tokens);

  return path;
};

/**
 * Get post type configuration for a given type
 * @param {string} type - Post type
 * @param {object} postTypes - Publication post types
 * @returns {object} Post type configuration
 */
export const getPostTypeConfig = (type, postTypes) =>
  postTypes.find((item) => item.type === type);
