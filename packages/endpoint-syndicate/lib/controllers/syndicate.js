import { IndiekitError } from "@indiekit/error";

import { findBearerToken } from "../token.js";
import {
  getPostData,
  getPostsAwaitingSyndication,
  syndicateToTargets,
} from "../utils.js";

// A deploy webhook and a scheduled request can arrive together; the second
// must not syndicate the same posts again while the first is still working
const batch = { isRunning: false };

/**
 * Syndicate a post to its targets and record the result on the post
 * @param {object} application - Application configuration
 * @param {object} publication - Publication configuration
 * @param {object} postData - Post data
 * @param {string} bearerToken - Access token for the Micropub update
 * @returns {Promise<object>} Micropub response body
 */
const syndicatePost = async (
  application,
  publication,
  postData,
  bearerToken,
) => {
  const { failedTargets, syndicatedUrls } = await syndicateToTargets(
    publication,
    postData.properties,
  );

  // Update post with syndicated URL(s) and remaining syndication target(s)
  const micropubResponse = await fetch(application.micropubEndpoint, {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${bearerToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      action: "update",
      url: postData.properties.url,
      ...(!failedTargets && { delete: ["mp-syndicate-to"] }),
      replace: {
        ...(failedTargets && { "mp-syndicate-to": failedTargets }),
        ...(syndicatedUrls && { syndication: syndicatedUrls }),
      },
    }),
  });

  if (!micropubResponse.ok) {
    throw await IndiekitError.fromFetch(micropubResponse);
  }

  /**
   * @type {object}
   */
  const body = await micropubResponse.json();

  // Include failed syndication targets in ‘success’ response
  if (failedTargets) {
    body.success_description +=
      ". The following target(s) did not return a URL: " +
      failedTargets.join(" ");
  }

  return body;
};

export const syndicateController = {
  async post(request, response, next) {
    try {
      const { application, publication } = request.app.locals;
      const bearerToken = findBearerToken(request);
      const sourceUrl =
        request.query.source_url || request.body?.syndication?.source_url;
      const redirectUri =
        request.query.redirect_uri || request.body?.syndication?.redirect_uri;

      const postsCollection = application?.collections?.get("posts");
      if (!postsCollection) {
        throw IndiekitError.notImplemented(
          response.locals.__("NotImplementedError.database"),
        );
      }

      // Get syndication targets
      const { syndicationTargets } = publication;
      if (syndicationTargets.length === 0) {
        return response.json({
          success: "OK",
          success_description: "No syndication targets have been configured",
        });
      }

      const respond = (body) => {
        if (redirectUri && redirectUri.startsWith("/")) {
          const message = encodeURIComponent(body.success_description);
          return response.redirect(`${redirectUri}?success=${message}`);
        }

        return response.json(body);
      };

      // Syndicate one post, by URL
      if (sourceUrl) {
        const postData = await getPostData(postsCollection, sourceUrl);

        if (!postData) {
          return response.json({
            success: "OK",
            success_description: `No post record available for ${sourceUrl}`,
          });
        }

        const body = await syndicatePost(
          application,
          publication,
          postData,
          bearerToken,
        );

        return respond(body);
      }

      // Syndicate every post awaiting syndication, oldest first
      if (batch.isRunning) {
        return response.json({
          success: "OK",
          success_description: "Syndication already in progress",
        });
      }

      batch.isRunning = true;

      try {
        const posts = await getPostsAwaitingSyndication(postsCollection);

        if (posts.length === 0) {
          return response.json({
            success: "OK",
            success_description: "No posts awaiting syndication",
          });
        }

        // One post at a time, as a target may not accept concurrent
        // requests. A target that fails is recorded on its post and the
        // batch carries on; an error updating a post stops the batch, and
        // the posts not reached are still awaiting syndication next time.
        const results = [];
        for (const postData of posts) {
          const body = await syndicatePost(
            application,
            publication,
            postData,
            bearerToken,
          );
          results.push({ url: postData.properties.url, ...body });
        }

        return respond({
          success: "OK",
          success_description: `Syndicated ${results.length} post${results.length === 1 ? "" : "s"}`,
          results,
        });
      } finally {
        batch.isRunning = false;
      }
    } catch (error) {
      next(error);
    }
  },
};
