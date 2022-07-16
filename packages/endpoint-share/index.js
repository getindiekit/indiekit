import express from "express";
import { shareController } from "./lib/controllers/share.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = {
  mountPath: "/share",
};

export default class ShareEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-share";
    this.meta = import.meta;
    this.name = "Share endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  navigationItems() {
    return {
      href: this.options.mountPath,
      text: "share.title",
    };
  }

  get routes() {
    const router = this._router;

    router.get("/:path?", shareController.get);
    router.post("/:path?", validate, shareController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.shareEndpoint = this.options.mountPath;
  }
}
