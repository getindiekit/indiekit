import { IndiekitEndpointPlugin } from "@indiekit/plugin";

import { shareController } from "./lib/controllers/share.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = {
  mountPath: "/share",
};

export default class ShareEndpointPlugin extends IndiekitEndpointPlugin {
  name = "Share endpoint";

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
    this.router.get("/{:path}", shareController.get);
    this.router.post("/{:path}", validate, shareController.post);

    return this.router;
  }

  async init() {
    await super.init();

    this.indiekit.config.application.shareEndpoint = this.mountPath;
  }
}
