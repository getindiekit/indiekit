import express from "express";

import { syndicateController } from "./lib/controllers/syndicate.js";

const defaults = { mountPath: "/syndicate" };
const router = express.Router();

export default class SyndicateEndpoint {
  name = "Syndication endpoint";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routesPublic() {
    router.post("/", syndicateController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);

    // Use private value to register syndication endpoint path
    Indiekit.config.application._syndicationEndpointPath =
      this.options.mountPath;
  }
}
