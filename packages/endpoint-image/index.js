import express from "express";
import { expressSharp } from "express-sharp";
import { Adapter } from "./lib/adapter.js";
import { cacheControl } from "./lib/middleware/cache.js";

const defaults = { cache: null, me: "", mountPath: "/image" };
const router = express.Router(); // eslint-disable-line new-cap

export default class ImageEndpoint {
  constructor(options = {}) {
    this.id = "endpoint-image";
    this.meta = import.meta;
    this.name = "Image resizing endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  get routesPublic() {
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
    Indiekit.addEndpoint(this);
    Indiekit.config.application.imageEndpoint = this.options.mountPath;
  }
}
