import compression from "compression";
import makeDebug from "debug";
import express from "express";
import fileUpload from "express-fileupload";
import { templates } from "@indiekit/frontend";
import * as error from "../lib/middleware/error.js";
import { forceHttps } from "../lib/middleware/force-https.js";
import { internationalisation } from "../lib/middleware/internationalisation.js";
import { locals } from "../lib/middleware/locals.js";
import { logging } from "../lib/middleware/logging.js";
import { routes } from "../lib/routes.js";
import { views } from "../lib/views.js";

const debug = makeDebug(`indiekit:express`);

/**
 * @typedef {import("express").Application} Application
 * @param {object} indiekitConfig - Indiekit configuration
 * @returns {Application} Express application
 */
export const expressConfig = (indiekitConfig) => {
  debug(`Create Express app`);
  const app = express();

  // Enable reversed proxy connections
  app.enable("trust proxy");

  // Don’t advertise server details
  app.set("x-powered-by", false);

  debug(`Add middlewares`);

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileUpload());

  // Compression
  app.use(compression());

  // Session
  app.use(indiekitConfig.application.sessionMiddleware);

  // Force HTTPS
  app.use(forceHttps);

  // Internationalisation
  app.use(internationalisation(indiekitConfig));

  // Locals
  app.use(locals(indiekitConfig));

  // Log requests
  app.use(logging);

  // Views
  debug(`Add view engine and templates`);
  app.set("views", views(indiekitConfig));
  app.engine("njk", templates(app).render);
  app.set("view engine", "njk");

  // Routes
  app.use(routes(indiekitConfig));

  // Handle errors
  debug(`Add error handling middlewares`);
  app.use(error.notFound, error.internalServer);

  return app;
};
