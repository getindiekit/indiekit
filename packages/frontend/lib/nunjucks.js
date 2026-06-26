import { fileURLToPath } from "node:url";

import nunjucks from "nunjucks";

import * as filters from "./filters/index.js";
import * as globals from "./globals/index.js";

/**
 * @typedef {import("express").Application} Application
 * @param {Application} app - Express
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
    lstripBlocks: true,
    trimBlocks: true,
  };

  const parser = nunjucks.configure(views, options);

  // Add filters
  for (const [filter, filterFunction] of Object.entries(filters)) {
    parser.addFilter(filter, filterFunction);
  }

  // Add globals
  for (const [global, globalFunction] of Object.entries(globals)) {
    parser.addGlobal(global, nunjucks.runtime.markSafe(globalFunction));
  }

  return parser;
};
