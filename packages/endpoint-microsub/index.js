import express from "express";

import { microsubController } from "./lib/controllers/microsub.js";

const defaults = {
  mountPath: "/microsub",
};
const router = express.Router();

export default class MicrosubEndpoint {
  name = "Microsub endpoint";

  /**
   * @param {object} options - Plugin options
   * @param {string} [options.mountPath] - Path to mount Microsub endpoint
   */
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.mountPath = this.options.mountPath;
  }

  /**
   * Microsub API routes (authenticated)
   * @returns {import("express").Router} Express router
   */
  get routes() {
    // Main Microsub endpoint - dispatches based on action parameter
    router.get("/", microsubController.get);
    router.post("/", microsubController.post);

    return router;
  }

  /**
   * Initialize plugin
   * @param {object} indiekit - Indiekit instance
   */
  async init(indiekit) {
    indiekit.addCollection("microsub_channels");
    // `id` orders and pages the timeline, `uid` is the feed's own identifier
    // and keeps an item from being stored twice, `url` is what clients mark
    // read by
    indiekit.addCollection("microsub_items", [
      { key: { channel: 1, id: 1 }, unique: true },
      { key: { channel: 1, uid: 1 }, unique: true },
      { key: { channel: 1, url: 1 } },
    ]);

    // Register endpoint
    indiekit.addEndpoint(this);

    // Set microsub endpoint URL in config
    if (!indiekit.config.application.microsubEndpoint) {
      indiekit.config.application.microsubEndpoint = this.mountPath;
    }
  }
}
