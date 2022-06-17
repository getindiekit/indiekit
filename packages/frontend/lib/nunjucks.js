import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import * as filters from "./nunjucks/filters.js";
import * as globals from "./nunjucks/globals.js";

/**
 * @param {Function} app Express
 * @returns {object} Nunjucks environment
 */
export const templates = (app) => {
  const appViews = app ? app.settings.views : [];
  const frontendViews = [
    fileURLToPath(new URL("../components", import.meta.url)),
    fileURLToPath(new URL("../layouts", import.meta.url)),
  ];
  const views = [...frontendViews, ...appViews];

  const options = {
    autoescape: true,
    express: app,
  };

  const parser = nunjucks.configure(views, options);

  // Add filters
  for (const filter of Object.keys(filters)) {
    parser.addFilter(filter, filters[filter]);
  }

  // Add globals
  parser.addGlobal("attributes", nunjucks.runtime.markSafe(globals.attributes));
  parser.addGlobal("classes", nunjucks.runtime.markSafe(globals.classes));
  parser.addGlobal("icon", nunjucks.runtime.markSafe(globals.icon));
  parser.addGlobal("pages", nunjucks.runtime.markSafe(globals.pages));

  return parser;
};
