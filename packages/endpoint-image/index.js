import express from "express";
import { expressSharp, HttpAdapter } from "express-sharp";
import Keyv from "keyv";
import KeyvMongoDB from "keyv-mongodb";

const defaults = {
  mongodbUrl: false,
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
    let cache;
    if (this.options.mongodbUrl) {
      const store = new KeyvMongoDB({
        url: this.options.mongodbUrl,
      });
      cache = new Keyv({ store });
    }

    const router = this._router;

    router.use(
      "/",
      expressSharp({
        imageAdapter: new HttpAdapter({
          cache,
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
