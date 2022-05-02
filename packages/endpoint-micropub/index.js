import express from "express";
import multer from "multer";
import { actionController } from "./lib/controllers/action.js";
import { postsController } from "./lib/controllers/posts.js";
import { queryController } from "./lib/controllers/query.js";

const defaults = {
  mountPath: "/micropub",
};

export const MicropubEndpoint = class {
  constructor(options = {}) {
    this.id = "endpoint-micropub";
    this.meta = import.meta;
    this.name = "Micropub endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  navigationItems(application) {
    if (application.hasDatabase) {
      return {
        href: `${this.options.mountPath}/posts`,
        text: "micropub.title",
      };
    }
  }

  get routes() {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get("/", queryController);
    router.post("/", multipartParser.any(), actionController);
    router.get("/posts", postsController.list);
    router.get("/posts/:id", postsController.view);

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.micropubEndpoint = this.options.mountPath;
  }
};

export default MicropubEndpoint;
