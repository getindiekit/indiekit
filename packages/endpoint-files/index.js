import express from "express";
import multer from "multer";
import { filesController } from "./lib/controllers/files.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = {
  mountPath: "/files",
};

export const FilesEndpoint = class {
  constructor(options = {}) {
    this.id = "endpoint-files";
    this.meta = import.meta;
    this.name = "File management endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  navigationItems(application) {
    if (application.hasDatabase) {
      return {
        href: this.options.mountPath,
        text: "files.title",
      };
    }
  }

  get routes() {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get("/", filesController.files);
    router.get("/new", filesController.new);
    router.post(
      "/new",
      multipartParser.single("file"),
      validate,
      filesController.upload
    );
    router.get("/:id", filesController.file);

    return router;
  }

  init() {
    return true;
  }
};

export default FilesEndpoint;
