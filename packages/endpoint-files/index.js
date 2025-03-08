import path from "node:path";

import { IndiekitEndpointPlugin } from "@indiekit/plugin";

import { deleteController } from "./lib/controllers/delete.js";
import { fileController } from "./lib/controllers/file.js";
import { filesController } from "./lib/controllers/files.js";
import { formController } from "./lib/controllers/form.js";
import { fileData } from "./lib/middleware/file-data.js";
import { validate } from "./lib/middleware/validation.js";

const defaults = {
  mountPath: "/files",
};

export default class FilesEndpointPlugin extends IndiekitEndpointPlugin {
  name = "File management endpoint";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.mountPath] - Path to endpoint
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.mountPath = this.options.mountPath;

    this.navigationItems = {
      href: this.mountPath,
      text: "files.title",
      requiresDatabase: true,
    };

    this.shortcutItems = {
      url: path.join(this.mountPath, "upload"),
      name: "files.upload.action",
      iconName: "uploadFile",
      requiresDatabase: true,
    };
  }

  get routes() {
    this.router.get("/", filesController);

    this.router.get("/upload", fileData.upload, formController.get);
    this.router.post("/upload", fileData.upload, validate, formController.post);

    this.router.use("/:uid{/:action}", fileData.read);
    this.router.get("/:uid", fileController);

    this.router.get("/:uid/delete", deleteController.get);
    this.router.post("/:uid/delete", deleteController.post);

    return this.router;
  }

  async init() {
    await super.init();

    this.indiekit.config.application.filesEndpoint = this.mountPath;
  }
}
