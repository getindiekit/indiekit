import { IndiekitEndpointPlugin } from "@indiekit/plugin";

import { actionController } from "./lib/controllers/action.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = {
  mountPath: "/micropub",
};

export default class MicropubEndpointPlugin extends IndiekitEndpointPlugin {
  collection = "posts";

  name = "Micropub endpoint";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.mountPath] - Path to endpoint
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.mountPath = this.options.mountPath;
  }

  get routes() {
    this.router.get("/", queryController);
    this.router.post("/", actionController);

    return this.router;
  }

  async init() {
    await super.init();

    // Only mount if micropub endpoint not already configured
    if (!this.indiekit.config.application.micropubEndpoint) {
      this.indiekit.config.application.micropubEndpoint = this.mountPath;
    }
  }
}
