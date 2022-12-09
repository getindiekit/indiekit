import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { fetch } from "undici";

/**
 * Query Micropub endpoint for post data
 *
 * @param {string} id - Post ID
 * @param {string} micropubEndpoint - Micropub endpoint
 * @param {string} accessToken - Access token
 * @returns {object} JF2 properties
 */
export const getPostData = async (id, micropubEndpoint, accessToken) => {
  const url = Buffer.from(id, "base64").toString("utf8");

  const micropubUrl = new URL(micropubEndpoint);
  micropubUrl.searchParams.append("q", "source");
  micropubUrl.searchParams.append("url", url);

  /**
   * @todo Third-party Micropub endpoints may require a separate bearer token
   */
  const micropubResponse = await fetch(micropubUrl.href, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!micropubResponse.ok) {
    throw await IndiekitError.fromFetch(micropubResponse);
  }

  const body = await micropubResponse.json();
  const postData = mf2tojf2({ items: [body] });

  return postData;
};

/**
 * Get post name, falling back to post type name
 *
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
 *
 * @param {object} publication - Publication configuration
 * @param {string} post - Post properties
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
 * Get syndication target `items` for checkboxes component
 *
 * @param {object} publication - Publication configuration
 * @param {string} post - Post properties
 * @returns {object} Items for checkboxes component
 */
export const getSyndicateToItems = (publication, post = false) => {
  return publication.syndicationTargets.map((target) => {
    return {
      text: target.info.service.name,
      hint: { text: target.info.uid },
      value: target.info.uid,
      checked: post["mp-syndicate-to"]?.includes(target.info.uid),
    };
  });
};

/**
 * Get visibility `items` for radios component
 *
 * @param {object} response - HTTP response
 * @param {object} [post=false] - Post properties
 * @returns {object} Items for radios component
 */
export const getVisibilityItems = (response, post = false) => {
  return ["_ignore", "public", "unlisted", "private"].map((value) => ({
    text: response.__(
      value === "_ignore" ? response.__("noValue") : `posts.status.${value}`
    ),
    value,
    checked: post.visibility ? value === post.visibility : value === "_ignore",
  }));
};
