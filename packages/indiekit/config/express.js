import process from "node:process";
import express from "express";
import frontend from "@indiekit/frontend";
import * as error from "../lib/middleware/error.js";
import { forceHttps } from "../lib/middleware/force-https.js";
import { internationalisation } from "../lib/middleware/internationalisation.js";
import { locals } from "../lib/middleware/locals.js";
import { logging } from "../lib/middleware/logging.js";
import { routes } from "../lib/routes.js";
import { views } from "../lib/views.js";

const { templates } = frontend;

export const expressConfig = (indiekitConfig) => {
  const app = express();

  // Correctly report secure connections
  app.enable("trust proxy");

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session
  app.use(indiekitConfig.application.sessionMiddleware);

  // Force HTTPS
  if (process.env.NODE_ENV === "production") {
    app.use(forceHttps);
  }

  // Internationalisation
  app.use(internationalisation(indiekitConfig));

  // Locals
  app.use(locals(indiekitConfig));

  // Log requests
  app.use(logging);

  // Views
  app.set("views", views(indiekitConfig));
  app.engine("njk", templates(app).render);
  app.set("view engine", "njk");

  // Routes
  app.use(routes(indiekitConfig));

  // Handle errors
  app.use(error.notFound, error.internalServer);

  return app;
};
