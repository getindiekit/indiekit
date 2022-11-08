import express from "express";
import activitypubExpress from "activitypub-express";
import { getMongodbClient } from "@indiekit/indiekit/lib/mongodb.js";

const defaults = {
  domain: "localhost",
  mountPath: "/activitypub",
  username: "user",
};
const router = express.Router(); // eslint-disable-line new-cap

const paths = {
  actor: "/u/:actor",
  object: "/o/:id",
  activity: "/s/:id",
  inbox: "/u/:actor/inbox",
  outbox: "/u/:actor/outbox",
  followers: "/u/:actor/followers",
  following: "/u/:actor/following",
  liked: "/u/:actor/liked",
  collections: "/u/:actor/c/:id",
  blocked: "/u/:actor/blocked",
  rejections: "/u/:actor/rejections",
  rejected: "/u/:actor/rejected",
  shares: "/s/:id/shares",
  likes: "/s/:id/likes",
};

/**
 *
 * @param {object} paths - Paths
 * @param {string} mountPath - Mount path
 * @returns {object} Routes
 */
function getRoutes(paths, mountPath) {
  const routes = {};

  for (const key in paths) {
    if (Object.prototype.hasOwnProperty.call(paths, key)) {
      routes[key] = mountPath + paths[key];
    }
  }

  return routes;
}

export default class ActivitypubEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-activitypub";
    this.meta = import.meta;
    this.name = "ActivityPub endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this.apex = activitypubExpress({
      domain: this.options.domain,
      actorParam: "actor",
      objectParam: "id",
      activityParam: "id",
      routes: getRoutes(paths, this.options.mountPath),
    });
  }

  get routesPublic() {
    const { consts, net } = this.apex;

    router.use(
      express.json({ type: consts.jsonldTypes }),
      express.urlencoded({ extended: true }),
      this.apex,
    );

    router.route(paths.inbox).get(net.inbox.get).post(net.inbox.post);
    router.route(paths.outbox).get(net.outbox.get).post(net.outbox.post);
    router.get(paths.actor, net.actor.get);
    router.get(paths.followers, net.followers.get);
    router.get(paths.following, net.following.get);
    router.get(paths.liked, net.liked.get);
    router.get(paths.object, net.object.get);
    router.get(paths.activity, net.activityStream.get);
    router.get(paths.shares, net.shares.get);
    router.get(paths.likes, net.likes.get);

    router.get("/nodeinfo/:version", net.nodeInfo.get);
    router.get("/nodeinfo/:version", net.nodeInfo.get);

    return router;
  }

  get routesWellKnown() {
    const { net } = this.apex;

    router.get("/webfinger", net.webfinger.get);
    router.get("/nodeinfo", net.nodeInfoLocation.get);

    return router;
  }

  async init(Indiekit) {
    const { apex } = this;
    const { name, version, mongodbUrl } = Indiekit.config.application;
    const { username, displayName, summary, icon } = this.options;
    const actor = await apex.createActor(username, displayName, summary, icon);
    const { client } = await getMongodbClient(mongodbUrl);

    apex.settings.name = name;
    apex.settings.version = version;
    apex.store.db = client.db();
    apex.store.setup(actor);

    Indiekit.addEndpoint(this);
    Indiekit.config.application.activitypubEndpoint = this.options.mountPath;
  }
}
