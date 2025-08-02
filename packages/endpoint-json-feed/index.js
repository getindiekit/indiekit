import path from "node:path";

import express from "express";

import { jsonFeedController } from "./lib/controllers/json-feed.js";

const defaults = {
  feedName: "feed.json",
  mountPath: "/",
};
const router = express.Router();

export default class jsonFeedEndpoint {
  name = "JSON Feed";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.feedName = this.options.feedName;
    this.mountPath = this.options.mountPath;
  }

  get routesPublic() {
    router.get(`/${this.feedName}`, jsonFeedController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.jsonFeed = path.join(
      this.mountPath,
      this.feedName,
    );
  }
}
