import express from "express";

import { actionController } from "./lib/controllers/action.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = { mountPath: "/micropub" };
const router = express.Router();

export default class MicropubEndpoint {
  name = "Micropub endpoint";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routes() {
    router.get("/", queryController);
    router.post("/", actionController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addCollection("posts");
    Indiekit.addEndpoint(this);

    // Only mount if micropub endpoint not already configured
    if (!Indiekit.config.application.micropubEndpoint) {
      Indiekit.config.application.micropubEndpoint = this.mountPath;
    }
  }
}
