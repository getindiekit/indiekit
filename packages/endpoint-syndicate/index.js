import express from "express";
import { syndicateController } from "./lib/controllers/syndicate.js";

const defaults = {
  mountPath: "/syndicate",
};

export default class SyndicateEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-syndicate";
    this.meta = import.meta;
    this.name = "Syndication endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get routes() {
    const router = this._router;

    router.post("/", syndicateController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
  }
}
