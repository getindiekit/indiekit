import { IndiekitEndpointPlugin } from "@indiekit/plugin";
import deepmerge from "deepmerge";

import { actionController } from "./lib/controllers/action.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = {
  imageProcessing: {
    resize: {
      fit: "outside",
      withoutEnlargement: true,
    },
  },
  mountPath: "/media",
};

export default class MediaEndpointPlugin extends IndiekitEndpointPlugin {
  collection = "media";

  name = "Micropub media endpoint";

  /**
   * @param {object} [options] - Plug-in options
   * @param {object} [options.imageProcessing] - Image processing options
   * @param {string} [options.mountPath] - Path to endpoint
   */
  constructor(options = {}) {
    super(options);

    this.options = deepmerge(defaults, options);

    this.mountPath = this.options.mountPath;
  }

  get routes() {
    this.router.get("/", queryController);
    this.router.post("/", actionController(this.options.imageProcessing));

    return this.router;
  }

  async init() {
    await super.init();

    // Only mount if media endpoint not already configured
    if (!this.indiekit.config.application.mediaEndpoint) {
      this.indiekit.config.application.mediaEndpoint = this.mountPath;
    }
  }
}
