import express from "express";

import { webmentionsController } from "./lib/controllers/webmentions.js";

const defaults = {
  mountPath: "/webmentions",
  token: process.env.WEBMENTION_IO_TOKEN,
};
const router = express.Router();

export default class WebmentionEndpoint {
  name = "Webmention.io endpoint";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get navigationItems() {
    return {
      href: this.options.mountPath,
      text: "webmention-io.title",
    };
  }

  get routes() {
    router.get(
      "/",
      webmentionsController({
        token: this.options.token,
      }),
    );

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
  }
}
