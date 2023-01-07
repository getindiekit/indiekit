import express from "express";
import { syndicateController } from "./lib/controllers/syndicate.js";

const defaults = { mountPath: "/syndicate" };
const router = express.Router(); // eslint-disable-line new-cap

export default class SyndicateEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-syndicate";
    this.meta = import.meta;
    this.name = "Syndication endpoint";
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
