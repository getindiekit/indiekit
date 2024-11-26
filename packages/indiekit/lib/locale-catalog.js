import { createRequire } from "node:module";
import path from "node:path";

import deepmerge from "deepmerge";

const require = createRequire(import.meta.url);

/**
 * Add catalog of localised strings to application configuration
 * @param {object} Indiekit - Indiekit instance
 * @returns {object} Catalog of localised strings
 */
export const getLocaleCatalog = (Indiekit) => {
  const catalog = new Map();

  for (const locale of Indiekit.locales) {
    const translations = [
      // Application translations
      require(`../locales/${locale}.json`),
      // Error translations
      require(`@indiekit/error/locales/${locale}.json`),
      // Frontend translations
      require(`@indiekit/frontend/locales/${locale}.json`),
    ];

    // Plug-in translations
    for (const plugin of Indiekit.installedPlugins) {
      const localePath = path.join(plugin.filePath, `locales/${locale}.json`);
      try {
        translations.push(require(localePath));
      } catch {} // eslint-disable-line no-empty
    }

    catalog.set(locale, deepmerge.all(translations));
  }

  return catalog;
};
