import express from "express";
import { expressSharp, HttpAdapter } from "express-sharp";

const defaults = {
  cache: false,
  me: "",
  mountPath: "/image",
};

export const ImageEndpoint = class {
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
      "/",
      expressSharp({
        cache: this.options.cache,
        imageAdapter: new HttpAdapter({
          cacheOptions: {
            shared: false,
            immutableMinTimeToLive: 2_592_000,
          },
          prefixUrl: this.options.me,
        }),
      })
    );

    return router;
  }

  init(Indiekit) {
    Indiekit.config.application.imageEndpoint = this.options.mountPath;
  }
};

export default ImageEndpoint;
