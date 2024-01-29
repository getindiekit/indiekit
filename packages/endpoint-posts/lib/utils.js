import { Buffer } from "node:buffer";
import { sanitise, ISO_6709_RE } from "@indiekit/util";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import formatcoords from "formatcoords";
import { endpoint } from "./endpoint.js";
import { statusTypes } from "./status-types.js";

/**
 * Get geographic coordinates property
 * @param {string} geo - Latitude and longitude, comma separated
 * @returns {object} JF2 geo location property
 */
export const getGeoProperty = (geo) => {
  const { latitude, longitude } = geo.match(ISO_6709_RE).groups;

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
 * @param {object} location - JF2 location property
 * @returns {string|undefined} Latitude and longitude, comma separated
 */
export const getGeoValue = (location) => {
  if (location && location.geo) {
    return [location.geo.latitude, location.geo.longitude].toString();
  } else if (location && location.type === "geo") {
    return [location.latitude, location.longitude].toString();
  }
};

/**
 * Get location property
 * @param {object} values - Latitude and longitude, comma separated
 * @returns {object} JF2 location property
 */
export const getLocationProperty = (values) => {
  const { geo, location } = values;

  const hasGeo = geo && geo.length > 0;
  const hasLocation = location && Object.entries(sanitise(location)).length > 0;

  // Determine Microformat type
  if (hasLocation && location.name) {
    location.type = "card";
  } else if (hasLocation && !hasGeo) {
    location.type = "adr";
  }

  // Add (or use) any provided geo location properties
  if (hasLocation && hasGeo) {
    location.geo = getGeoProperty(geo);
  } else if (hasGeo) {
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

  const type = properties["post-type"];
  const { name } = publication.postTypes[type];

  return name;
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
