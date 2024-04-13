import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import { statusTypes } from "../status-types.js";
import {
  getGeoValue,
  getPostName,
  getPostProperties,
  getSyndicateToItems,
} from "../utils.js";

export const postData = {
  create(request, response, next) {
    const { publication } = request.app.locals;
    const { access_token, scope } = request.session;

    // Create new post object with default values
    const postType = request.query.type || "note";
    const properties = request.body;

    // Get post type config
    const { name, fields, h } = publication.postTypes[postType];

    // Only select ‘checked’ syndication targets on first view
    const checkTargets = Object.entries(request.body).length === 0;

    response.locals = {
      accessToken: access_token,
      action: "create",
      fields,
      name,
      postsPath: path.dirname(request.baseUrl + request.path),
      postType,
      properties,
      scope,
      showAdvancedOptions: false,
      syndicationTargetItems: getSyndicateToItems(publication, checkTargets),
      type: h,
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

      const allDay = properties?.start && !properties.start.includes("T");
      const geo = properties?.location && getGeoValue(properties.location);
      const postType = properties["post-type"];

      // Get post type config
      const { name, fields, h } = publication.postTypes[postType];

      response.locals = {
        accessToken: access_token,
        action: action || "create",
        allDay,
        draftMode: scope?.includes("draft"),
        fields,
        geo,
        h,
        name,
        postName: getPostName(publication, properties),
        postsPath: path.dirname(request.baseUrl + request.path),
        postStatus: properties["post-status"],
        postType,
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
