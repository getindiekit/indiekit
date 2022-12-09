import path from "node:path";
import { status } from "../status.js";
import {
  getPostData,
  getPostName,
  getPostTypeName,
  getSyndicateToItems,
  getVisibilityItems,
} from "../utils.js";

export const postData = {
  create(request, response, next) {
    const { publication } = request.app.locals;
    const { access_token, scope } = request.session;

    // Create new post object with default values
    const postType = request.query.type || "note";
    const post = {
      "mp-syndicate-to": publication.syndicationTargets
        .filter((target) => target.options.checked === true)
        .map((target) => target.info.uid),
      visibility: "_ignore",
    };

    response.locals = {
      accessToken: access_token,
      action: "create",
      back: path.dirname(request.baseUrl + request.path),
      post,
      postType,
      postTypeName: getPostTypeName(publication, postType),
      scope,
      syndicationTargetItems: getSyndicateToItems(publication, post),
      visibilityItems: getVisibilityItems(response, post),
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
        back: path.dirname(request.baseUrl + request.path),
        draftMode: scope?.includes("draft"),
        post,
        postName: getPostName(publication, post),
        postStatus: post["post-status"],
        postType,
        postTypeName: getPostTypeName(publication, postType),
        scope,
        syndicationTargetItems: getSyndicateToItems(publication, post),
        visibilityItems: getVisibilityItems(response, post),
        status,
        ...response.locals,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
};
