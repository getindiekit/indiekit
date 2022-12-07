import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { fetch } from "undici";

/**
 * Get publishing permissions
 *
 * @param {string} scope - Provided scope (space separated)
 * @param {object} post - Post properties
 * @returns {object} List of permissions and values
 */
export const getPermissions = (scope, post) => {
  const canCreate = scope.includes("create") || scope.includes("draft");
  const canUpdate = scope.includes("update") || scope.includes("draft");
  const canDelete = scope.includes("delete");

  return {
    canCreate,
    canUpdate,
    canDelete: canDelete && post["post-status"] !== "deleted",
    canUndelete: canCreate && post["post-status"] === "deleted",
  };
};

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
  const postData = mf2tojf2(body);

  return postData;
};

/**
 * Get post name or post type name
 *
 * @param {string} post - Post properties
 * @param {string} publication - Publication configuration
 * @returns {string} Post name or post type name
 */
export const getPostName = (post, publication) => {
  if (post.name) {
    return post.name;
  }

  const { postTypes } = publication;
  const postType = post["post-type"];
  const postTypeConfig = postTypes.find((item) => item.type === postType);
  return postTypeConfig.name;
};
