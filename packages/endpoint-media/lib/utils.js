import {
  dateTokens,
  formatDate,
  getTimeZoneDesignator,
  supplant,
} from "@indiekit/util";
import newbase60 from "newbase60";
import { mediaTypeCount } from "./media-type-count.js";

/**
 * Get media properties
 * @param {object} mediaData - Media data
 * @returns {object} Media properties
 */
export const getMediaProperties = (mediaData) => {
  return {
    uid: mediaData._id,
    "content-type": mediaData.properties["content-type"],
    "media-type": mediaData.properties["media-type"],
    published: mediaData.properties.published,
    url: mediaData.properties.url,
  };
};

/**
 * Render path from URI template and properties
 * @param {string} path - URI template path
 * @param {object} properties - Media properties
 * @param {object} application - Application configuration
 * @returns {Promise<string>} Path
 */
export const renderPath = async (path, properties, application) => {
  const dateObject = new Date(properties.published);
  const serverTimeZone = getTimeZoneDesignator();
  const { locale, timeZone } = application;
  let tokens = {};

  // Add date tokens
  for (const dateToken of dateTokens) {
    tokens[dateToken] = formatDate(properties.published, dateToken, locale, {
      timeZone: timeZone === "server" ? serverTimeZone : timeZone,
      // @ts-ignore (https://github.com/marnusw/date-fns-tz/issues/239)
      useAdditionalDayOfYearTokens: true,
    });
  }

  // Add day of the year (NewBase60) token
  tokens.D60 = newbase60.DateToSxg(dateObject);

  // Add count of media type for the day
  const count = await mediaTypeCount.get(application, properties);
  tokens.n = count + 1;

  // Add file extension token
  tokens.ext = properties.ext;

  // Add file name token
  tokens.filename = properties.filename;

  // Add md5 token
  tokens.md5 = properties.md5;

  // Populate URI template path with properties
  path = supplant(path, tokens);

  return path;
};
