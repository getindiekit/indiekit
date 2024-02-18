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
  const { timeZone } = application;
  let tokens = {};

  // Add date tokens
  for (const dateToken of dateTokens) {
    tokens[dateToken] = formatDate(properties.published, dateToken, {
      locale: application.locale,
      timeZone: timeZone === "server" ? serverTimeZone : timeZone,
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
