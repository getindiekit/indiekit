import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import { statusTypes } from "../status-types.js";
import {
  getPostData,
  getPostName,
  getPostTypeName,
  getSyndicateToItems,
} from "../utils.js";

export const postData = {
  create(request, response, next) {
    const { publication } = request.app.locals;
    const { access_token, scope } = request.session;

    // Create new post object with default values
    const postType = request.query.type || "note";
    const data = request.body;

    // Only select ‘checked’ syndication targets on first view
    const checkTargets = Object.entries(request.body).length === 0;

    // Only show advanced options if one of those fields has been updated
    const showAdvancedOptions = data.category || data.geo || data.visibility;

    response.locals = {
      accessToken: access_token,
      action: "create",
      data,
      postsPath: path.dirname(request.baseUrl + request.path),
      postType,
      postTypeName: getPostTypeName(publication, postType),
      scope,
      showAdvancedOptions,
      syndicationTargetItems: getSyndicateToItems(publication, checkTargets),
      ...response.locals,
    };

    next();
  },

  async read(request, response, next) {
    try {
      const { application, publication } = request.app.locals;
      const { action, id } = request.params;
      const { access_token, scope } = request.session;

      const data = await getPostData(
        id,
        application.micropubEndpoint,
        access_token,
      );

      const postType = data["post-type"];

      response.locals = {
        accessToken: access_token,
        action: action || "create",
        data,
        draftMode: scope?.includes("draft"),
        postName: getPostName(publication, data),
        postsPath: path.dirname(request.baseUrl + request.path),
        postStatus: data["post-status"],
        postType,
        postTypeName: getPostTypeName(publication, postType),
        scope,
        showAdvancedOptions: true,
        syndicationTargetItems: getSyndicateToItems(publication),
        statusTypes,
        ...response.locals,
      };

      next();
    } catch (error) {
      let nextError = error;

      if (error.message === "Invalid URL") {
        nextError = IndiekitError.notFound(
          response.locals.__("NotFoundError.page"),
        );
      }

      next(nextError);
    }
  },
};
