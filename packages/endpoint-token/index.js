import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { tokenController } from "./lib/controllers/token.js";

const defaults = {
  mountPath: "/token",
};

export const TokenEndpoint = class {
  constructor(options = {}) {
    this.id = "endpoint-token";
    this.meta = import.meta;
    this.name = "Token endpoint";
    this.options = { ...defaults, ...options };
    // eslint-disable-next-line new-cap
    this._router = express.Router({
      caseSensitive: true,
      mergeParams: true,
    });
  }

  get routes() {
    const router = this._router;

    router.use(cors());
    router.options(cors());

    router.get("/", tokenController.get);
    router.post("/", tokenController.post);

    return router;
  }

  init(Indiekit) {
    Indiekit.extend("routesPublic", {
      mountPath: this.options.mountPath,
      routes: () => this.routes,
    });

    Indiekit.config.application.tokenEndpoint = this.options.mountPath;
  }
};

export default TokenEndpoint;
