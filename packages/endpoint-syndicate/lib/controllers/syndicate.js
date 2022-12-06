import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";
import { getPostData } from "../utils.js";

export const syndicateController = {
  async post(request, response, next) {
    try {
      const { application, publication } = request.app.locals;
      const { token } = request.query;

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
      const { url } = request.query;
      const postData = await getPostData(publication, url);

      if (!postData && url) {
        return response.json({
          success: "OK",
          success_description: `No post record available for ${url}`,
        });
      }

      if (!postData) {
        return response.json({
          success: "OK",
          success_description: "No post records available",
        });
      }

      // Only syndicate to selected targets
      const syndicateTo = postData.properties["mp-syndicate-to"];
      if (!syndicateTo) {
        return response.json({
          success: "OK",
          success_description: "No posts awaiting syndication",
        });
      }

      // Syndicate to target(s)
      const syndication = [];
      for await (const target of syndicationTargets) {
        const { uid } = target.info;
        const canSyndicate = syndicateTo.includes(uid);
        if (canSyndicate) {
          try {
            const syndicatedUrl = await target.syndicate(
              postData.properties,
              publication
            );
            console.log("syndicatedUrl", syndicatedUrl);
            syndication.push(syndicatedUrl);
          } catch (error) {
            console.error(error.message);
          }
        }
      }

      // Update post with syndicated URL(s) and removal of syndication target(s)
      const micropubResponse = await fetch(application.micropubEndpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          url: postData.properties.url,
          delete: ["mp-syndicate-to"],
          add: {
            syndication,
          },
        }),
      });

      if (!micropubResponse.ok) {
        throw await IndiekitError.fromFetch(micropubResponse);
      }

      const body = await micropubResponse.json();

      return response.status(micropubResponse.status).json(body);
    } catch (error) {
      next(error);
    }
  },
};
