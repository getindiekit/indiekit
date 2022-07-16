import express from "express";
import multer from "multer";
import { uploadController } from "./lib/controllers/upload.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = {
  mountPath: "/media",
};

export default class MediaEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-media";
    this.meta = import.meta;
    this.name = "Micropub media endpoint";
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
    router.post("/", multipartParser.single("file"), uploadController);

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.mediaEndpoint = this.options.mountPath;
  }
}
