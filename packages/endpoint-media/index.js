import express from "express";
import multer from "multer";
import { uploadController } from "./lib/controllers/upload.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = { mountPath: "/media" };
const router = express.Router(); // eslint-disable-line new-cap
const multipartParser = multer({ storage: multer.memoryStorage() });

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
    router.post("/", multipartParser.single("file"), uploadController);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.mediaEndpoint = this.options.mountPath;
  }
}
