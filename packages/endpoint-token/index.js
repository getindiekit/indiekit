import cors from "cors";
import express from "express";
import { tokenController } from "./lib/controllers/token.js";

const defaults = {
  mountPath: "/token",
};

// eslint-disable-next-line new-cap
const router = express.Router({ caseSensitive: true, mergeParams: true });

export default class TokenEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-token";
    this.meta = import.meta;
    this.name = "Token endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routesPublic() {
    router.use(cors());
    router.options(cors());

    router.get("/", tokenController.get);
    router.post("/", tokenController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.tokenEndpoint = this.options.mountPath;
  }
}
