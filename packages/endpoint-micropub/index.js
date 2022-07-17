import express from "express";
import multer from "multer";
import { actionController } from "./lib/controllers/action.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = { mountPath: "/micropub" };
const router = express.Router(); // eslint-disable-line new-cap
const multipartParser = multer({ storage: multer.memoryStorage() });

export default class MicropubEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-micropub";
    this.meta = import.meta;
    this.name = "Micropub endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routes() {
    router.get("/", queryController);
    router.post("/", multipartParser.any(), actionController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.micropubEndpoint = this.options.mountPath;
  }
}
