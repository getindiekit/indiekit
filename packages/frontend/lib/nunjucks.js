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
  for (const filter of Object.keys(filters)) {
    // eslint-disable-next-line import/namespace
    parser.addFilter(filter, filters[filter]);
  }

  // Add globals
  for (const global of Object.keys(globals)) {
    // eslint-disable-next-line import/namespace
    parser.addGlobal(global, nunjucks.runtime.markSafe(globals[global]));
  }

  return parser;
};
