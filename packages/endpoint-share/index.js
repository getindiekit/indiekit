import { fileURLToPath } from "node:url";
import express from "express";
import { shareController } from "./lib/controllers/share.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = {
  mountPath: "/share",
};

export const ShareEndpoint = class {
  constructor(options = {}) {
    this.id = "endpoint-share";
    this.meta = import.meta;
    this.name = "Share endpoint";
    this.options = { ...defaults, ...options };
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get routes() {
    const router = this._router;

    router.get("/:path?", shareController.get);
    router.post("/:path?", validate, shareController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.extend("navigationItems", {
      href: this.options.mountPath,
      text: "share.title",
    });

    Indiekit.extend("routes", {
      mountPath: this.options.mountPath,
      routes: () => this.routes,
    });

    Indiekit.config.application.shareEndpoint = this.options.mountPath;
  }
};

export default ShareEndpoint;
