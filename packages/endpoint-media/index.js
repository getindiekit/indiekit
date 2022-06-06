import express from "express";
import multer from "multer";
import { mediaController } from "./lib/controllers/media.js";
import { micropubController } from "./lib/controllers/micropub.js";

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
        href: this.options.mountPath,
        text: "media.title",
      };
    }
  }

  get routes() {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    // Application
    router.get("/", mediaController.files);
    router.get("/:id", mediaController.file);

    // Micropub API
    router.get("/", micropubController.query);
    router.post("/", multipartParser.single("file"), micropubController.upload);

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.mediaEndpoint = this.options.mountPath;
  }
};

export default MediaEndpoint;
