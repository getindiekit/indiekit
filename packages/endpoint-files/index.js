import express from "express";
import { deleteController } from "./lib/controllers/delete.js";
import { fileController } from "./lib/controllers/file.js";
import { filesController } from "./lib/controllers/files.js";
import { formController } from "./lib/controllers/form.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = { mountPath: "/files" };
const router = express.Router(); // eslint-disable-line new-cap

export default class FilesEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-files";
    this.meta = import.meta;
    this.name = "File management endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get navigationItems() {
    return {
      href: this.options.mountPath,
      text: "files.title",
      requiresDatabase: true,
    };
  }

  get routes() {
    router.get("/", filesController);

    router.get("/new", formController.get);
    router.post("/new", validate, formController.post);

    router.get("/:id", fileController);

    router.get("/:id/delete", deleteController.get);
    router.post("/:id/delete", deleteController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.filesEndpoint = this.mountPath;
  }
}
