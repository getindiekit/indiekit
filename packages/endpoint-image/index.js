import express from "express";
import {
  createIPX,
  ipxFSStorage,
  ipxHttpStorage,
  createIPXNodeServer,
} from "ipx";

const defaults = { mountPath: "/image" };
const router = express.Router();

export default class ImageEndpoint {
  constructor(options = {}) {
    this.name = "Image resizing endpoint";
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.imageEndpoint = this.options.mountPath;
  }

  _routes(indiekitConfig) {
    const ipx = createIPX({
      storage: ipxFSStorage({ dir: "./public" }),
      httpStorage: ipxHttpStorage({ domains: indiekitConfig.publication.me }),
    });

    router.use(createIPXNodeServer(ipx));

    return router;
  }
}
