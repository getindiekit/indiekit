import express from "express";

import { shareController } from "./lib/controllers/share.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = { mountPath: "/share" };
const router = express.Router();

export default class ShareEndpoint {
  name = "Share endpoint";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routes() {
    router.get("/{:path}", shareController.get);
    router.post("/{:path}", validate, shareController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.shareEndpoint = this.options.mountPath;
  }
}
