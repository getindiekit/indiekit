import path from "node:path";
import {
  getPostTypeConfig,
  getSyndicateToItems,
  getVisibilityItems,
} from "../utils.js";

export const locals = (request, response, next) => {
  const { publication } = request.app.locals;
  const { postTypes } = publication;
  const { scope } = request.session;
  const type = request.query.type || "note";

  response.locals.back = path.dirname(request.baseUrl + request.path);
  response.locals.draftMode = scope.includes("draft");
  response.locals.syndicationTargetItems = getSyndicateToItems(publication);
  response.locals.type = type;
  response.locals.postType = getPostTypeConfig(
    type,
    postTypes
  ).name.toLowerCase();
  response.locals.visibilityItems = getVisibilityItems(response, {
    visibility: "_ignore",
  });

  next();
};
