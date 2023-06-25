import express from "express";
import { expressSharp } from "express-sharp";
import { Adapter } from "./lib/adapter.js";
import { cacheControl } from "./lib/middleware/cache.js";

const defaults = { mountPath: "/image" };
const router = express.Router(); // eslint-disable-line new-cap

export default class ImageEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-image";
    this.meta = import.meta;
    this.name = "Image resizing endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  _routes(indiekitConfig) {
    router.use(
      cacheControl,
      expressSharp({
        cache: indiekitConfig.application.cache,
        imageAdapter: new Adapter({
          prefixUrl: indiekitConfig.publication.me,
        }),
      })
    );

    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.imageEndpoint = this.options.mountPath;
  }
}
