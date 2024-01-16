import { Buffer } from "node:buffer";
import { sanitise } from "@indiekit/util";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import formatcoords from "formatcoords";
import { endpoint } from "./endpoint.js";
import { statusTypes } from "./status-types.js";

export const LAT_LONG_RE =
  /^(?<latitude>(?:-?|\+?)?\d+(?:\.\d+)?),\s*(?<longitude>(?:-?|\+?)?\d+(?:\.\d+)?)$/;

/**
 * Get geographic coordinates property
 * @param {string} geo - Latitude and longitude, comma separated
 * @returns {object} JF2 geo location property
 */
export const getGeoProperty = (geo) => {
  const { latitude, longitude } = geo.match(LAT_LONG_RE).groups;

  return {
    type: "geo",
    name: formatcoords(geo).format({
      decimalPlaces: 2,
    }),
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
};

/**
 * Get comma separated geographic coordinates
 * @param {object} geo - JF2 geo location property
 * @returns {string} Latitude and longitude, comma separated
 */
export const getGeoValue = (geo) => {
  return [geo.latitude, geo.longitude].toString();
};

/**
 * Get location property
 * @param {object} values - Latitude and longitude, comma separated
 * @returns {object} JF2 location property
 */
export const getLocationProperty = (values) => {
  const { location, geo } = values;

  // Determine Microformat type
  if (location && location.name) {
    location.type = "card";
  } else if (location) {
    location.type = "adr";
  }

  // Add (or use) any provided geo location properties
  if (location && geo) {
    location.geo = getGeoProperty(geo);
  } else if (geo) {
    return getGeoProperty(geo);
  }

  return sanitise(location);
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
 * Get post name, falling back to post type name
 * @param {object} publication - Publication configuration
 * @param {object} properties - JF2 properties
 * @returns {string} Post name or post type name
 */
export const getPostName = (publication, properties) => {
  if (properties.name) {
    return properties.name;
  }

  return getPostTypeName(publication, properties["post-type"]);
};

/**
 * Query Micropub endpoint for post data
 * @param {string} uid - Item UID
 * @param {string} micropubEndpoint - Micropub endpoint
 * @param {string} accessToken - Access token
 * @returns {Promise<object>} JF2 properties
 */
export const getPostProperties = async (uid, micropubEndpoint, accessToken) => {
  const micropubUrl = new URL(micropubEndpoint);
  micropubUrl.searchParams.append("q", "source");

  const micropubResponse = await endpoint.get(micropubUrl.href, accessToken);

  if (micropubResponse?.items?.length > 0) {
    const jf2 = mf2tojf2(micropubResponse);
    const items = jf2.children || [jf2];
    return items.find((item) => item.uid === uid);
  }

  return false;
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
      (item) => item.type === postType,
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
    label: target.info.service.name,
    hint: target.info.uid,
    value: target.info.uid,
    ...(checkTargets && { checked: target.options.checked }),
  }));
};
