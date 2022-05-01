import { fileURLToPath } from "node:url";
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
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  routes(application, publication) {
    const router = this._router;
    const multipartParser = multer({
      storage: multer.memoryStorage(),
    });

    router.get("/", queryController(publication));
    router.post("/", multipartParser.any(), actionController(publication));
    router.get("/posts", postsController(application, publication).list);
    router.get("/posts/:id", postsController(application, publication).view);

    return router;
  }

  init(Indiekit) {
    const { application, publication } = Indiekit.config;

    if (application.hasDatabase) {
      Indiekit.extend("navigationItems", {
        href: `${this.options.mountPath}/posts`,
        text: "micropub.title",
      });
    }

    Indiekit.extend("routes", {
      mountPath: this.options.mountPath,
      routes: () => this.routes(application, publication),
    });

    application.micropubEndpoint = this.options.mountPath;
  }
};

export default MicropubEndpoint;
