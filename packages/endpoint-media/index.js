import { fileURLToPath } from "node:url";
import express from "express";
import multer from "multer";
import { uploadController } from "./lib/controllers/upload.js";
import { filesController } from "./lib/controllers/files.js";
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
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get routes() {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get("/", queryController);
    router.post("/", multipartParser.single("file"), uploadController);
    router.get("/files", filesController.list);
    router.get("/files/:id", filesController.view);

    return router;
  }

  init(Indiekit) {
    if (Indiekit.config.application.hasDatabase) {
      Indiekit.extend("navigationItems", {
        href: `${this.options.mountPath}/files`,
        text: "media.title",
      });
    }

    Indiekit.extend("routes", {
      mountPath: this.options.mountPath,
      routes: () => this.routes,
    });

    Indiekit.config.application.mediaEndpoint = this.options.mountPath;
  }
};

export default MediaEndpoint;
