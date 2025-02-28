import path from "node:path";

import { assetsPath } from "@indiekit/frontend";
import express from "express";
import rateLimit from "express-rate-limit";

import * as assetsController from "./controllers/assets.js";
import * as clientController from "./controllers/client.js";
import * as feedController from "./controllers/feed.js";
import * as homepageController from "./controllers/homepage.js";
import * as manifestController from "./controllers/manifest.js";
import * as offlineController from "./controllers/offline.js";
import * as pluginController from "./controllers/plugin.js";
import * as sessionController from "./controllers/session.js";
import * as statusController from "./controllers/status.js";
import { IndieAuth } from "./indieauth.js";

const router = express.Router();
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
});

/**
 * Expose configuration to frontend templates and plug-ins
 * @param {object} Indiekit - Indiekit instance
 * @returns {import("express").Router} Express router
 */
export const routes = (Indiekit) => {
  const { endpoints, installedPlugins, publication } = Indiekit;

  const indieauth = new IndieAuth({
    devMode: process.env.NODE_ENV === "development",
    me: publication.me,
  });

  // Prevent pages from being indexed
  router.use((request, response, next) => {
    response.setHeader("X-Robots-Tag", "noindex");
    next();
  });
  router.get("/robots.txt", (request, response) => {
    response.type("text/plain");
    response.send("User-agent: *\nDisallow: /");
  });

  // Assets
  router.use("/assets", express.static(assetsPath, { maxAge: "7d" }));
  router.get("/assets/app-:hash.js", assetsController.getScripts);
  router.get("/assets/app-:hash.css", assetsController.getStyles);
  router.get(
    "/assets/app-icon-:size-:purpose.png",
    assetsController.getAppIcon,
  );
  router.get(
    "/assets/shortcut-icon-:size-:name.png",
    assetsController.getShortcutIcon,
  );

  // Service worker
  router.get("/serviceworker.js", offlineController.serviceworker);
  router.get("/offline", offlineController.offline);

  // Plug-in assets
  for (const plugin of installedPlugins) {
    if (plugin.filePath) {
      const assetsPath = path.join(plugin.filePath, "assets");
      router.use(`/assets/${plugin.id}`, express.static(assetsPath));
    }
  }

  // Feed
  router.get("/feed.jf2", feedController.jf2);

  // Web App Manifest
  router.get("/app.webmanifest", manifestController.get);

  // Client metadata
  router.get("/id", clientController.get);

  // Session
  router.get("/session/login", limit, sessionController.login);
  router.post("/session/login", limit, indieauth.login());
  router.get("/session/auth", limit, indieauth.authorize());
  router.get("/session/logout", sessionController.logout);

  // Public and .well-known endpoints
  for (const endpoint of endpoints) {
    if (endpoint.mountPath && endpoint.routesPublic) {
      router.use(endpoint.mountPath, limit, endpoint.routesPublic);
    }

    if (endpoint.routesWellKnown) {
      router.use("/.well-known/", limit, endpoint.routesWellKnown);
    }
  }

  // Authenticate subsequent requests
  router.use(indieauth.authenticate());

  // Homepage
  router.get("/", homepageController.viewHomepage);

  // Plugin
  router.get("/plugins", limit, pluginController.list);
  router.get("/plugins/:pluginId", limit, pluginController.view);

  // Status
  router.get("/status", limit, statusController.viewStatus);

  // Authenticated endpoints
  for (const endpoint of endpoints) {
    if (endpoint.mountPath && endpoint.routes) {
      router.use(endpoint.mountPath, limit, endpoint.routes);
    }
  }

  return router;
};
