import { fileURLToPath } from "node:url";
import express from "express";
import frontend from "@indiekit/frontend";
import rateLimit from "express-rate-limit";
import * as assetsController from "./controllers/assets.js";
import * as homepageController from "./controllers/homepage.js";
import * as sessionController from "./controllers/session.js";
import * as statusController from "./controllers/status.js";
import { IndieAuth } from "./indieauth.js";

const { assetsPath } = frontend;
const router = express.Router(); // eslint-disable-line new-cap
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
});

export const routes = (indiekitConfig) => {
  const { application, publication } = indiekitConfig;

  const indieauth = new IndieAuth({
    me: publication.me,
  });

  // Prevent pages from being indexed
  router.use((request, response, next) => {
    response.setHeader("X-Robots-Tag", "noindex");
    next();
  });

  // Homepage
  router.get("/", homepageController.viewHomepage);

  // Prevent pages from being crawled
  router.get("/robots.txt", (request, response) => {
    response.type("text/plain");
    response.send("User-agent: *\nDisallow: /");
  });

  // Assets
  router.use("/assets", express.static(assetsPath));
  router.get("/assets/app.css", assetsController.getStyles);

  // Plug-in assets
  for (const plugin of application.installedPlugins) {
    if (plugin.meta?.url) {
      const assetsPath = fileURLToPath(new URL("assets", plugin.meta.url));
      router.use(`/assets/${plugin.id}`, express.static(assetsPath));
    }
  }

  // Session
  router.get("/session/login", limit, sessionController.login);
  router.post("/session/login", limit, indieauth.login());
  router.get("/session/auth", limit, indieauth.authenticate());
  router.get("/session/logout", sessionController.logout);

  // Status
  router.get(
    "/status",
    limit,
    indieauth.authorise(),
    statusController.viewStatus
  );

  // Unauthenticated plug-in routes
  for (const route of application.routesPublic) {
    router.use(route.mountPath, limit, route.routes());
  }

  // Authenticated plug-in routes
  for (const route of application.routes) {
    router.use(route.mountPath, limit, indieauth.authorise(), route.routes());
  }

  return router;
};
