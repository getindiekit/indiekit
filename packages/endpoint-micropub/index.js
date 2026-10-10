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
    // Every paginated query sorts and ranges on `properties.uid`, and MongoDB
    // abandons an unindexed sort once it needs more than 32MB
    Indiekit.addCollection("posts", [{ key: { "properties.uid": 1 } }]);
    Indiekit.addEndpoint(this);

    // Only mount if micropub endpoint not already configured
    if (!Indiekit.config.application.micropubEndpoint) {
      Indiekit.config.application.micropubEndpoint = this.mountPath;
    }
  }
}
