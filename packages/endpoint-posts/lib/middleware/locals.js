import path from "node:path";
import { getSyndicateToItems, getVisibilityItems } from "../utils.js";

export const locals = (request, response, next) => {
  const { publication } = request.app.locals;
  const { scope } = request.session;

  response.locals.back = path.dirname(request.baseUrl + request.path);
  response.locals.draftMode = scope.includes("draft");
  response.locals.syndicationTargetItems = getSyndicateToItems(publication);
  response.locals.visibilityItems = getVisibilityItems(response, {
    visibility: "_ignore",
  });

  next();
};
