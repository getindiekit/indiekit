import { Buffer } from "node:buffer";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import formatcoords from "formatcoords";
import { endpoint } from "./endpoint.js";
import { statusTypes } from "./status-types.js";

export const LAT_LONG_RE =
  /^(?<latitude>(?:-?|\+?)?\d+(?:\.\d+)?),\s*(?<longitude>(?:-?|\+?)?\d+(?:\.\d+)?)$/;

/**
 * Get location property
 * @param {string} geo - Latitude and longitude, comma separated
 * @returns {object} JF2 location property
 */
export const getLocationProperty = (geo) => {
  const { latitude, longitude } = geo.match(LAT_LONG_RE).groups;

  return {
    type: "geo",
    latitude,
    longitude,
    name: formatcoords(geo).format({
      decimalPlaces: 2,
    }),
  };
};

/**
 * Get post status badges
 * @param {object} post - Post
 * @param {import("express").Response} response - Response
 * @returns {Array} Badges
 */
export const getPostStatusBadges = (post, response) => {
  const badges = [];

  if (post["post-status"]) {
    const statusType = post["post-status"];
    badges.push({
      color: statusTypes[statusType].color,
      size: "small",
      text: response.locals.__(statusTypes[statusType].text),
    });
  }

  if (post.deleted) {
    badges.push({
      color: statusTypes.deleted.color,
      size: "small",
      text: response.locals.__(statusTypes.deleted.text),
    });
  }

  return badges;
};

/**
 * Get post ID from URL
 * @param {string} url - URL
 * @returns {string} Post ID
 */
export const getPostId = (url) => {
  return Buffer.from(url).toString("base64url");
};

/**
 * Query Micropub endpoint for post data
 * @param {string} id - Post ID
 * @param {string} micropubEndpoint - Micropub endpoint
 * @param {string} accessToken - Access token
 * @returns {Promise<object>} JF2 properties
 */
export const getPostData = async (id, micropubEndpoint, accessToken) => {
  const micropubUrl = new URL(micropubEndpoint);
  micropubUrl.searchParams.append("q", "source");
  micropubUrl.searchParams.append("url", getPostUrl(id));

  const micropubResponse = await endpoint.get(micropubUrl.href, accessToken);
  const postData = mf2tojf2({ items: [micropubResponse] });

  return postData;
};

/**
 * Get post name, falling back to post type name
 * @param {string} publication - Publication configuration
 * @param {object} post - Post properties
 * @returns {string} Post name or post type name
 */
export const getPostName = (publication, post) => {
  if (post.name) {
    return post.name;
  }

  return getPostTypeName(publication, post["post-type"]);
};

/**
 * Get post type name
 * @param {object} publication - Publication configuration
 * @param {string} postType - Post type
 * @returns {string} Post type name
 */
export const getPostTypeName = (publication, postType) => {
  if (publication.postTypes && postType) {
    const postTypeConfig = publication.postTypes.find(
      (item) => item.type === postType
    );

    return postTypeConfig.name;
  }

  return "";
};

/**
 * Get post URL from ID
 * @param {string} id - ID
 * @returns {string} Post URL
 */
export const getPostUrl = (id) => {
  const url = Buffer.from(id, "base64url").toString("utf8");
  return new URL(url).href;
};

/**
 * Get syndication target `items` for checkboxes component
 * @param {object} publication - Publication configuration
 * @param {boolean} [checkTargets] - Select ’checked’ targets
 * @returns {object} Items for checkboxes component
 */
export const getSyndicateToItems = (publication, checkTargets = false) => {
  return publication.syndicationTargets.map((target) => ({
    text: target.info.service.name,
    hint: { text: target.info.uid },
    value: target.info.uid,
    ...(checkTargets && { checked: target.options.checked }),
  }));
};
