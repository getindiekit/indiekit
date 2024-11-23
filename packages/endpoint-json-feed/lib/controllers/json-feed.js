import { jsonFeed } from "../json-feed.js";

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

  return response
    .type("application/feed+json")
    .json(jsonFeed(application, feedUrl, posts));
};
