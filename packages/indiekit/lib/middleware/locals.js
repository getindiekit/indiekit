import { scripts, styles } from "@indiekit/frontend";
import { sha1 } from "@indiekit/util";
import { getEndpointUrls } from "../endpoints.js";
import { getNavigation } from "../navigation.js";
import { getShortcuts } from "../shortcuts.js";
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
      const {
        application,
        collections,
        database,
        mongodbClientError,
        publication,
      } = Indiekit;

      // Application
      request.app.locals.application = application;

      // Display MongoDB client connection error
      if (mongodbClientError) {
        request.app.locals.error = mongodbClientError;
      }

      // Application database client
      application.database = database;

      // Application database collections
      application.collections = collections;

      // Application locale
      application.localeUsed = response.locals.getLocale();

      // Application URL
      application.url = application.url || getUrl(request);

      // Asset paths
      application.jsPath = `/assets/app-${jsHash}.js`;
      application.cssPath = `/assets/app-${cssHash}.css`;

      // Application navigation
      // Only update if serving HTML to prevent wrong session link being shown
      if (request.accepts("html")) {
        application.navigation = getNavigation(application, request, response);
      }

      // Application shortcuts
      application.shortcuts = getShortcuts(application, response);

      // Application endpoints
      request.app.locals.application = {
        ...application,
        ...getEndpointUrls(application, request),
      };

      // Publication
      request.app.locals.publication = publication;

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
