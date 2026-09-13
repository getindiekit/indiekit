import path from "node:path";

import { IndiekitError } from "@indiekit/error";

import { statusTypes } from "../status-types.js";
import {
  getChannelItems,
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
    const properties = request.body || {};

    // Get post type config
    const { name, fields, h } = publication.postTypes[postType];

    // Only select ‘checked’ syndication targets on first view
    const shouldCheckTargets = Object.entries(properties).length === 0;

    // A bookmarklet or a reader’s ‘Post’ button can hand over a URL and a
    // title. The URL goes to the field the post type has for one, or to its
    // content when it has none; the title only where the type has a name.
    // Anything already in the form wins.
    const { name: queryName, url: queryUrl } = request.query;
    if (queryUrl) {
      const urlField = [
        "bookmark-of",
        "in-reply-to",
        "like-of",
        "repost-of",
      ].find((field) => fields?.[field]);
      const target = urlField || (fields?.content && "content");
      if (target) {
        properties[target] ||= String(queryUrl);
      }
    }

    if (queryName && fields?.name) {
      properties.name ||= String(queryName);
    }

    response.locals = {
      accessToken: access_token,
      action: "create",
      channelItems: getChannelItems(publication),
      fields,
      name,
      postsPath: path.dirname(request.baseUrl + request.path),
      postType,
      properties,
      scope,
      showAdvancedOptions: false,
      syndicationTargetItems: getSyndicateToItems(
        publication,
        shouldCheckTargets,
      ),
      type: h,
      ...response.locals,
    };

    next();
  },

  async read(request, response, next) {
    try {
      const { application, publication } = request.app.locals;
      const { action = "create", uid } = request.params;
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
        action,
        allDay,
        channelItems: getChannelItems(publication),
        isDraftMode: scope?.includes("draft"),
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
