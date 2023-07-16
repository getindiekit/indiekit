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
    const post = request.body;

    // Only select ‘checked’ syndication targets on first view
    const checkTargets = Object.entries(request.body).length === 0;

    // Only show advanced options if one of those fields has been updated
    const showAdvancedOptions =
      post.category || post.geo || post["mp-slug"] || post.visibility;

    response.locals = {
      accessToken: access_token,
      action: "create",
      post,
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

      const post = await getPostData(
        id,
        application.micropubEndpoint,
        access_token
      );

      const postType = post["post-type"];

      response.locals = {
        accessToken: access_token,
        action: action || "create",
        draftMode: scope?.includes("draft"),
        post,
        postName: getPostName(publication, post),
        postsPath: path.dirname(request.baseUrl + request.path),
        postStatus: post["post-status"],
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
          response.locals.__("NotFoundError.page")
        );
      }

      next(nextError);
    }
  },
};
