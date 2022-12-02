import { jsonFeed } from "../json-feed.js";

export const jf2 = async (request, response) => {
  const { application, publication } = request.app.locals;
  const feedUrl = new URL(request.originalUrl, application.url).href;
  const posts = await publication.posts
    .find({
      "properties.post-status": {
        $ne: "draft",
      },
    })
    .toArray();

  return response.type("application/jf2feed+json").json({
    type: "feed",
    name: application.name,
    url: feedUrl,
    children: posts.map((post) => post.properties),
  });
};

export const json = async (request, response) => {
  const { application, publication } = request.app.locals;
  const feedUrl = new URL(request.originalUrl, application.url).href;
  const posts = await publication.posts
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
