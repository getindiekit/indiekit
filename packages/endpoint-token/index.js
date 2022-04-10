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
    this.name = "Token endpoint";
    this.options = { ...defaults, ...options };
    // eslint-disable-next-line new-cap
    this._router = express.Router({
      caseSensitive: true,
      mergeParams: true,
    });
  }

  get mountPath() {
    return this.options.mountPath;
  }

  init(Indiekit) {
    const { application, publication } = Indiekit.config;

    Indiekit.extend("routesNoAuth", {
      mountPath: this.mountPath,
      routes: () => this.routes(application, publication),
    });

    Indiekit.extend("views", [
      fileURLToPath(new URL("views", import.meta.url)),
    ]);

    application.tokenEndpoint = this.mountPath;
  }

  routes(application, publication) {
    const router = this._router;

    router.use(cors());
    router.options(cors());

    router.get("/", tokenController(publication).get);
    router.post("/", tokenController(publication).post);

    return router;
  }
};

export default TokenEndpoint;
