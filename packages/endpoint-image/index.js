import express from "express";
import { expressSharp } from "express-sharp";
import { Adapter } from "./lib/adapter.js";
import { cacheControl } from "./lib/middleware/cache.js";

const defaults = {
  cache: false,
  me: "",
  mountPath: "/image",
};

export default class ImageEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-image";
    this.meta = import.meta;
    this.name = "Image resizing endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get routesPublic() {
    const router = this._router;

    router.use(
      cacheControl,
      expressSharp({
        cache: this.options.cache,
        imageAdapter: new Adapter({
          prefixUrl: this.options.me,
        }),
      })
    );

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.imageEndpoint = this.options.mountPath;
  }
}
