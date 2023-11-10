import { WebMentionHandler } from "webmention-handler";
import { MongoWebMentionStorage } from "webmention-handler-mongodb";

export const handler = async (request, response, next) => {
  const { me } = request.app.locals.publication;
  const { mongodbUrl } = request.app.locals.application;
  const { host } = new URL(me);

  const storage = new MongoWebMentionStorage({
    databaseUri: mongodbUrl,
    dbName: "indiekit",
    mentionCollection: "mentions",
    pendingCollection: "mentions-pending",
    maxPendingFetch: 100,
    limitMentionsPerPageFetch: 50,
  });

  response.locals.hander = new WebMentionHandler({
    supportedHosts: [host],
    storageHandler: storage,
    // requiredProtocol: "https",
  });

  next();
};
