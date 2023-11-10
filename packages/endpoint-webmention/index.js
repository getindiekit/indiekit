import express from "express";
import { receiveController } from "./lib/controllers/receive.js";
import { updateController } from "./lib/controllers/update.js";
import { queryController } from "./lib/controllers/query.js";
import { handler } from "./lib/middleware/handler.js";

const defaults = { mountPath: "/webmention" };
const router = express.Router(); // eslint-disable-line new-cap

export default class MicropubEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-webmention";
    this.meta = import.meta;
    this.name = "Webmention endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routes() {
    router.use("/", handler);
    router.post("/", receiveController);
    router.get("/update", updateController);
    router.get("/", queryController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);

    // Use private value to register Webmention endpoint path
    Indiekit.config.application._webmentionEndpointPath =
      this.options.mountPath;
  }
}
