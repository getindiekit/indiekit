import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import { statusTypes } from "../status-types.js";
import {
  getGeoValue,
  getPostName,
  getPostProperties,
  getPostTypeName,
  getSyndicateToItems,
} from "../utils.js";

export const postData = {
  create(request, response, next) {
    const { publication } = request.app.locals;
    const { access_token, scope } = request.session;

    // Create new post object with default values
    const postType = request.query.type || "note";
    const properties = request.body;

    // Only select ‘checked’ syndication targets on first view
    const checkTargets = Object.entries(request.body).length === 0;

    // Only show advanced options if one of those fields has been updated
    const showAdvancedOptions =
      properties.category || properties.geo || properties.visibility;

    response.locals = {
      accessToken: access_token,
      action: "create",
      postsPath: path.dirname(request.baseUrl + request.path),
      postType,
      postTypeName: getPostTypeName(publication, postType),
      properties,
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
      const { action, uid } = request.params;
      const { access_token, scope } = request.session;

      const properties = await getPostProperties(
        uid,
        application.micropubEndpoint,
        access_token,
      );

      if (!properties) {
        throw IndiekitError.notFound(response.locals.__("NotFoundError.page"));
      }

      if (properties.location.geo) {
        properties.geo = getGeoValue(properties.geo);
      }

      const postType = properties["post-type"];

      response.locals = {
        accessToken: access_token,
        action: action || "create",
        draftMode: scope?.includes("draft"),
        postName: getPostName(publication, properties),
        postsPath: path.dirname(request.baseUrl + request.path),
        postStatus: properties["post-status"],
        postType,
        postTypeName: getPostTypeName(publication, postType),
        properties,
        scope,
        showAdvancedOptions: true,
        syndicationTargetItems: getSyndicateToItems(publication),
        statusTypes,
        ...response.locals,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
};
