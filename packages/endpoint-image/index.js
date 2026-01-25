import express from "express";
import {
  createIPX,
  ipxFSStorage,
  ipxHttpStorage,
  createIPXNodeServer,
} from "ipx";

const defaults = { domains: [], mountPath: "/image" };
const router = express.Router();

export default class ImageEndpoint {
  name = "Image resizing endpoint";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.domains = this.options.domains;
    this.mountPath = this.options.mountPath;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.imageEndpoint = this.options.mountPath;
  }

  _routes(indiekitConfig) {
    const domains = Array.isArray(this.domains) ? this.domains : [this.domains];

    const ipx = createIPX({
      storage: ipxFSStorage({
        dir: "./public",
      }),
      httpStorage: ipxHttpStorage({
        domains: [indiekitConfig.publication.me, ...domains],
      }),
    });

    router.use(createIPXNodeServer(ipx));

    return router;
  }
}
