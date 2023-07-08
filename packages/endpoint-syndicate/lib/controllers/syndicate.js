import { IndiekitError } from "@indiekit/error";
import { findBearerToken } from "../token.js";
import { getPostData, syndicateToTargets } from "../utils.js";

export const syndicateController = {
  async post(request, response, next) {
    try {
      const { application, publication } = request.app.locals;
      const bearerToken = findBearerToken(request);

      const sourceUrl =
        request.query.source_url || request.body.syndication?.source_url;
      const redirectUri =
        request.query.redirect_uri || request.body.syndication?.redirect_uri;

      if (!application.hasDatabase) {
        throw IndiekitError.notImplemented(
          response.locals.__("NotImplementedError.database")
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

      // Get post data
      const postData = await getPostData(application, sourceUrl);

      if (!postData && sourceUrl) {
        return response.json({
          success: "OK",
          success_description: `No post record available for ${sourceUrl}`,
        });
      }

      if (!postData) {
        return response.json({
          success: "OK",
          success_description: "No posts awaiting syndication",
        });
      }

      // Syndicate to targets
      const { failedTargets, syndicatedUrls } = await syndicateToTargets(
        publication,
        postData.properties
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

      /** @type {object} */
      const body = await micropubResponse.json();

      // Include failed syndication targets in ‘success’ response
      if (failedTargets) {
        body.success_description +=
          ". The following target(s) did not return a URL: " +
          failedTargets.join(" ");
      }

      if (redirectUri && redirectUri.startsWith("/")) {
        const message = encodeURIComponent(body.success_description);
        return response.redirect(`${redirectUri}?success=${message}`);
      }

      return response.status(micropubResponse.status).json(body);
    } catch (error) {
      next(error);
    }
  },
};
