import process from "node:process";

import { IndiekitEndpointPlugin } from "@indiekit/plugin";

import { webmentionsController } from "./lib/controllers/webmentions.js";

const defaults = {
  mountPath: "/webmentions",
  token: process.env.WEBMENTION_IO_TOKEN,
};

export default class WebmentionEndpointPlugin extends IndiekitEndpointPlugin {
  name = "Webmention.io endpoint";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.mountPath] - Path to endpoint
   * @param {string} [options.token] - Webmention.io API token
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.mountPath = this.options.mountPath;

    this.navigationItems = {
      href: this.mountPath,
      text: "webmention-io.title",
    };
  }

  get routes() {
    this.router.get("/", webmentionsController({ token: this.options.token }));

    return this.router;
  }
}
