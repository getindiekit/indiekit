import path from "node:path";
import express from "express";
import { jsonFeedController } from "./lib/controllers/json-feed.js";

const defaults = {
  feedName: "feed.json",
  mountPath: "/",
};
const router = express.Router(); // eslint-disable-line new-cap

export default class jsonFeedEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-json-feed";
    this.meta = import.meta;
    this.name = "JSON Feed";
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
      this.feedName
    );
  }
}
