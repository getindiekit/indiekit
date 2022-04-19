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
    this.name = "Micropub media endpoint";
    this.options = { ...defaults, ...options };
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  routes(application, publication) {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get("/", queryController(publication));
    router.post(
      "/",
      multipartParser.single("file"),
      uploadController(publication)
    );
    router.get("/files", filesController(application, publication).list);
    router.get("/files/:id", filesController(application, publication).view);

    return router;
  }

  init(Indiekit) {
    const { application, publication } = Indiekit.config;

    if (application.hasDatabase) {
      Indiekit.extend("navigationItems", {
        href: `${this.options.mountPath}/files`,
        text: "media.title",
      });
    }

    Indiekit.extend("routes", {
      mountPath: this.options.mountPath,
      routes: () => this.routes(application, publication),
    });

    Indiekit.extend("views", [
      fileURLToPath(new URL("views", import.meta.url)),
    ]);

    application.mediaEndpoint = this.options.mountPath;
  }
};

export default MediaEndpoint;
