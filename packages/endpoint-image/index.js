import express from "express";
import {
  createIPX,
  ipxFSStorage,
  ipxHttpStorage,
  createIPXNodeHandler,
} from "ipx";

const defaults = { domains: [], mountPath: "/image" };
const router = express.Router();

export default class ImageEndpoint {
  name = "Image resizing endpoint";

  /**
   * @param {object} [options] - Plugin options
   * @param {string|string[]} [options.domains] - Domains to allow remote image resizing for
   * @param {string} [options.mountPath] - Path to mount image endpoint
   */
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.domains = this.options.domains;
    this.mountPath = this.options.mountPath;
  }

  /**
   * @param {IndiekitInstance} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    Indiekit.addEndpoint(this);
    Indiekit.config.application.imageEndpoint = this.options.mountPath;
  }

  /**
   * @param {IndiekitInstance} Indiekit - Indiekit instance
   * @returns {Router} Routes that don’t require authentication
   */
  _routes(Indiekit) {
    const domains = Array.isArray(this.domains) ? this.domains : [this.domains];

    const ipx = createIPX({
      storage: ipxFSStorage({
        dir: "./public",
      }),
      httpStorage: ipxHttpStorage({
        domains: [Indiekit.publication.me, ...domains],
      }),
    });

    const handler = /** @type {RequestHandler} */ (createIPXNodeHandler(ipx));

    router.use(handler);

    return router;
  }
}

/**
 * @import { RequestHandler, Router } from "express"
 */
