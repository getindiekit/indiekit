import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";
import { findBearerToken } from "../token.js";
import { getPostData } from "../utils.js";

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
          response.__("NotImplementedError.database")
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
      const postData = await getPostData(publication, sourceUrl);

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

      // Syndicate to target(s)
      let mpSyndicateTo = postData.properties["mp-syndicate-to"];
      const syndication = postData.properties.syndication || [];
      for await (const target of syndicationTargets) {
        const { uid } = target.info;

        const canSyndicate = mpSyndicateTo.includes(uid);
        if (canSyndicate) {
          try {
            const syndicatedUrl = await target.syndicate(
              postData.properties,
              publication
            );

            // Add syndicated URL to list of syndicated URLs
            syndication.push(syndicatedUrl);

            // Remove syndication target from list of syndication targets
            mpSyndicateTo = mpSyndicateTo.filter((target) => target !== uid);
          } catch (error) {
            console.error(error.message);
          }
        }
      }

      const failedSyndications = mpSyndicateTo.length > 0;

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
          ...(!failedSyndications && { delete: ["mp-syndicate-to"] }),
          replace: {
            ...(failedSyndications && { "mp-syndicate-to": mpSyndicateTo }),
            syndication,
          },
        }),
      });

      if (!micropubResponse.ok) {
        throw await IndiekitError.fromFetch(micropubResponse);
      }

      const body = await micropubResponse.json();

      // Include failed syndication targets in ‘success’ response
      if (failedSyndications) {
        body.success_description +=
          ". The following target(s) did not return a URL: " +
          mpSyndicateTo.join(" ");
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
