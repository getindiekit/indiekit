import express from "express";

import { actionController } from "./lib/controllers/action.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = { mountPath: "/micropub" };
const router = express.Router();

export default class MicropubEndpoint {
  constructor(options = {}) {
    this.name = "Micropub endpoint";
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

    Indiekit.config.application.micropubEndpoint = this.mountPath;
  }
}
