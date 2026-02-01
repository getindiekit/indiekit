import express from "express";

import { microsubController } from "./lib/controllers/microsub.js";
import { createIndexes } from "./lib/storage/items.js";

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
  init(indiekit) {
    console.info("[Microsub] Initializing endpoint-microsub plugin");

    // Register MongoDB collections
    indiekit.addCollection("microsub_channels");
    indiekit.addCollection("microsub_items");

    console.info("[Microsub] Registered MongoDB collections");

    // Register endpoint
    indiekit.addEndpoint(this);

    // Set microsub endpoint URL in config
    if (!indiekit.config.application.microsubEndpoint) {
      indiekit.config.application.microsubEndpoint = this.mountPath;
    }

    // Create indexes for optimal performance (runs in background)
    if (indiekit.database) {
      createIndexes(indiekit).catch((error) => {
        console.warn("[Microsub] Index creation failed:", error.message);
      });
    }
  }
}
