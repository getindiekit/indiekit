import express from "express";
import { expressSharp, HttpAdapter } from "express-sharp";
import Keyv from "keyv";
import KeyvMongoDB from "keyv-mongodb";

const defaults = {
  mountPath: "/image",
};

export const ImageEndpoint = class {
  constructor(options = {}) {
    this.id = "endpoint-image";
    this.name = "Image resizing endpoint";
    this.options = { ...defaults, ...options };
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountPath() {
    return this.options.mountPath;
  }

  init(Indiekit) {
    const { application, publication } = Indiekit.config;

    Indiekit.extend("routes", {
      mountPath: this.mountPath,
      routes: () => this.routes(application, publication),
    });

    application.imageEndpoint = this.mountPath;
  }

  routes(application, publication) {
    let cache;
    if (application.hasDatabase) {
      const store = new KeyvMongoDB({
        collection: "cache",
        url: application.mongodbUrl,
      });
      cache = new Keyv({ store });
    }

    const router = this._router;

    router.use(
      "/",
      expressSharp({
        imageAdapter: new HttpAdapter({
          cache,
          prefixUrl: publication.me,
        }),
      })
    );

    return router;
  }
};

export default ImageEndpoint;
