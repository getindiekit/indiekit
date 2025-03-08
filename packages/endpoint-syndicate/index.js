import { IndiekitEndpointPlugin } from "@indiekit/plugin";

import { syndicateController } from "./lib/controllers/syndicate.js";

const defaults = {
  mountPath: "/syndicate",
};

export default class SyndicateEndpointPlugin extends IndiekitEndpointPlugin {
  name = "Syndication endpoint";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.mountPath] - Path to endpoint
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.mountPath = this.options.mountPath;
  }

  get routesPublic() {
    this.router.post("/", syndicateController.post);

    return this.router;
  }

  async init() {
    await super.init();

    // Use private value to register syndication endpoint path
    this.indiekit.config.application._syndicationEndpointPath = this.mountPath;
  }
}
