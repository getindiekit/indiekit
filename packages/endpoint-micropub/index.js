import express from "express";
import multer from "multer";
import { actionController } from "./lib/controllers/action.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = {
  mountPath: "/micropub",
};

export const MicropubEndpoint = class {
  constructor(options = {}) {
    this.id = "endpoint-micropub";
    this.meta = import.meta;
    this.name = "Micropub endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get routes() {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get("/", queryController);
    router.post("/", multipartParser.any(), actionController);

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.micropubEndpoint = this.options.mountPath;
  }
};

export default MicropubEndpoint;
