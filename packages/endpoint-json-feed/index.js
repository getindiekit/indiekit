import path from "node:path";

import { IndiekitEndpointPlugin } from "@indiekit/plugin";

import { jsonFeedController } from "./lib/controllers/json-feed.js";

const defaults = {
  feedName: "feed.json",
  mountPath: "/",
};

export default class jsonFeedEndpointPlugin extends IndiekitEndpointPlugin {
  name = "JSON Feed";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.feedName] - File name
   * @param {string} [options.mountPath] - Path to endpoint
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.mountPath = this.options.mountPath;
  }

  get jsonFeedPath() {
    return path.join(this.mountPath, this.options.feedName);
  }

  get routesPublic() {
    this.router.get(this.jsonFeedPath, jsonFeedController);

    return this.router;
  }

  async init() {
    await super.init();

    this.indiekit.config.application.jsonFeed = this.jsonFeedPath;
  }
}
