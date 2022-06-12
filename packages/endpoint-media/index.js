import express from "express";
import multer from "multer";
import { mediaController } from "./lib/controllers/media.js";

const defaults = {
  mountPath: "/media",
};

export const MediaEndpoint = class {
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

    router.get("/", mediaController.query);
    router.post("/", multipartParser.single("file"), mediaController.upload);

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.mediaEndpoint = this.options.mountPath;
  }
};

export default MediaEndpoint;
