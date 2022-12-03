import express from "express";
import { actionController } from "./lib/controllers/action.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = { mountPath: "/media" };
const router = express.Router(); // eslint-disable-line new-cap

export default class MediaEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-media";
    this.meta = import.meta;
    this.name = "Micropub media endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routes() {
    router.get("/", queryController);
    router.post("/", actionController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);

    // Use private value to register Micropub media endpoint path
    Indiekit.config.application._mediaEndpointPath = this.options.mountPath;
  }
}
