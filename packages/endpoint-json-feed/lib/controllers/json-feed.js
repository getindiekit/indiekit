import { jsonFeed } from "../json-feed.js";

/**
 * View posts in JSON Feed format
 * @param {Request} request - Express request
 * @param {Response} response - Express response
 * @returns {Promise<void>}
 */
export const jsonFeedController = async (request, response) => {
  const { application } = request.app.locals;
  const feedUrl = new URL(request.originalUrl, application.url).href;

  const postsCollection = application?.collections?.get("posts");
  const posts = await postsCollection
    .find({
      "properties.post-status": {
        $ne: "draft",
      },
    })
    .toArray();

  return void response
    .type("application/feed+json")
    .json(jsonFeed(application, feedUrl, posts));
};

/**
 * @import { Request, Response } from "express"
 */
