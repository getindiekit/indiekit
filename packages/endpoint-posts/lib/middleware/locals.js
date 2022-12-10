import path from "node:path";
import {
  getPostData,
  getPostName,
  getPostTypeName,
  getSyndicateToItems,
  getVisibilityItems,
} from "../utils.js";

export const locals = async (request, response, next) => {
  try {
    const { application, publication } = request.app.locals;
    const { action, id } = request.params;
    const { access_token, scope } = request.session;

    let post;
    if (id === "new") {
      const newPostType = request.query.type || "note";
      post = {
        h: newPostType === "event" ? "event" : "entry",
        "post-type": newPostType,
      };
    } else {
      post = await getPostData(id, application.micropubEndpoint, access_token);
    }

    response.locals = {
      action,
      accessToken: access_token,
      back: path.dirname(request.baseUrl + request.path),
      draftMode: scope?.includes("draft"),
      post,
      postName: getPostName(publication, post),
      postStatus: post["post-status"],
      postType: post["post-type"],
      postTypeName: getPostTypeName(publication, post),
      scope,
      syndicationTargetItems: getSyndicateToItems(publication),
      visibilityItems: getVisibilityItems(response, {
        visibility: "_ignore",
      }),
      ...response.locals,
    };

    next();
  } catch (error) {
    next(error);
  }
};
