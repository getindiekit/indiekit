import { fileURLToPath } from "node:url";
import express from "express";
import { assetsPath } from "@indiekit/frontend";
import rateLimit from "express-rate-limit";
import * as assetsController from "./controllers/assets.js";
import * as feedController from "./controllers/feed.js";
import * as homepageController from "./controllers/homepage.js";
import * as manifestController from "./controllers/manifest.js";
import * as pluginController from "./controllers/plugin.js";
import * as sessionController from "./controllers/session.js";
import * as statusController from "./controllers/status.js";
import { IndieAuth } from "./indieauth.js";

const router = express.Router(); // eslint-disable-line new-cap
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
});

export const routes = (indiekitConfig) => {
  const { application, publication } = indiekitConfig;

  const indieauth = new IndieAuth({
    devMode: application._devMode,
    me: publication.me,
  });

  // Prevent pages from being indexed
  router.use((request, response, next) => {
    response.setHeader("X-Robots-Tag", "noindex");
    next();
  });

  // Assets
  router.use("/assets", express.static(assetsPath));
  router.get("/assets/app.js", assetsController.getScripts);
  router.get("/assets/app.css", assetsController.getStyles);
  router.get("/assets/app.png", assetsController.getTouchIcon);

  // Plug-in assets
  for (const plugin of application.installedPlugins) {
    if (plugin.meta?.url) {
      const assetsPath = fileURLToPath(new URL("assets", plugin.meta.url));
      router.use(`/assets/${plugin.id}`, express.static(assetsPath));
    }
  }

  // Feed
  router.get("/feed.jf2", feedController.jf2);

  // Web App Manifest
  router.get("/app.webmanifest", manifestController.get);

  // Session
  router.get("/session/login", limit, sessionController.login);
  router.post("/session/login", limit, indieauth.login());
  router.get("/session/auth", limit, indieauth.authorize());
  router.get("/session/logout", sessionController.logout);

  // Public and .well-known endpoints
  for (const endpoint of application.endpoints) {
    // Internal routing
    // Currently used for endpoint-image which requires configuration values
    // to be passed on to express-sharp middleware
    if (endpoint.mountPath && endpoint._routes) {
      router.use(endpoint.mountPath, limit, endpoint._routes(indiekitConfig));
    }

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
  for (const endpoint of application.endpoints) {
    if (endpoint.mountPath && endpoint.routes) {
      router.use(endpoint.mountPath, limit, endpoint.routes);
    }
  }

  return router;
};
