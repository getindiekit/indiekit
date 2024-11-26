import { scripts, styles } from "@indiekit/frontend";
import { sha1 } from "@indiekit/util";

import { getEndpointUrls } from "../endpoints.js";
import { getNavigation } from "../navigation.js";
import { getUrl } from "../utils.js";

const jsHash = sha1(await scripts());
const cssHash = sha1(await styles());

/**
 * Expose configuration to frontend templates and plug-ins
 * @param {object} Indiekit - Indiekit instance
 * @returns {import("express").RequestHandler} Next middleware
 */
export const locals = (Indiekit) =>
  async function (request, response, next) {
    try {
      // Display MongoDB client connection error
      if (Indiekit.mongodbClientError) {
        request.app.locals.error = Indiekit.mongodbClientError;
      }

      // Application
      const { application } = Indiekit.config;

      application.collections = Indiekit.collections;
      application.localeUsed = response.locals.getLocale();
      application.package = Indiekit.package;
      application.url = application.url || getUrl(request);

      if (request.accepts("html")) {
        application.cssPath = `/assets/app-${cssHash}.css`;
        application.jsPath = `/assets/app-${jsHash}.js`;

        // Only update if serving HTML to prevent wrong session link being shown
        application.navigation = getNavigation(Indiekit, request, response);
      }

      request.app.locals.application = {
        ...application,
        ...getEndpointUrls(application, request),
      };

      // Installed plug-ins
      request.app.locals.installedPlugins = Indiekit.installedPlugins;

      // Publication
      request.app.locals.publication = Indiekit.publication;

      // Validation schemas
      request.app.locals.validationSchemas = Indiekit.validationSchemas;

      // Persist scope and token
      request.app.locals.scope =
        request.app.locals.scope || request.session.scope;
      request.app.locals.token =
        request.app.locals.token || request.session.access_token;

      return next();
    } catch (error) {
      return next(error);
    }
  };
