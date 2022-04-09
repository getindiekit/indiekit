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
    this.name = "Micropub endpoint";
    this.options = { ...defaults, ...options };
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountPath() {
    return this.options.mountPath;
  }

  init(Indiekit) {
    const { application, publication } = Indiekit.config;

    if (application.hasDatabase) {
      Indiekit.extend("navigationItems", {
        href: `${this.mountPath}/posts`,
        text: "micropub.title",
      });
    }

    Indiekit.extend("routes", {
      mountPath: this.mountPath,
      routes: () => this.routes(application, publication),
    });

    Indiekit.extend("views", [
      fileURLToPath(new URL("views", import.meta.url)),
    ]);

    application.micropubEndpoint = this.mountPath;
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
};

export default MicropubEndpoint;
