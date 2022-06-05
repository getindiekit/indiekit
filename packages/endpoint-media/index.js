import express from "express";
import multer from "multer";
import { mediaController } from "./lib/controllers/media.js";
import { uploadController } from "./lib/controllers/upload.js";
import { queryController } from "./lib/controllers/query.js";

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

  navigationItems(application) {
    if (application.hasDatabase) {
      return {
        href: `${this.options.mountPath}/files`,
        text: "media.title",
      };
    }
  }

  get routes() {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get("/", queryController);
    router.post("/", multipartParser.single("file"), uploadController);
    router.get("/files", mediaController.list);
    router.get("/files/:id", mediaController.view);

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.mediaEndpoint = this.options.mountPath;
  }
};

export default MediaEndpoint;
