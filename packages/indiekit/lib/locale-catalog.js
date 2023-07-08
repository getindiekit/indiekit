import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import deepmerge from "deepmerge";

const require = createRequire(import.meta.url);

/**
 * Add catalog of localised strings to application configuration
 * @param {object} application - Application config
 * @returns {object} Catalog of localised strings
 */
export const getLocaleCatalog = (application) => {
  const catalog = new Map();

  for (const locale of application.localesAvailable) {
    const translations = [
      // Application translations
      require(`../locales/${locale}.json`),
      // Error translations
      require(`@indiekit/error/locales/${locale}.json`),
      // Frontend translations
      require(`@indiekit/frontend/locales/${locale}.json`),
    ];

    // Plug-in translations
    for (const plugin of application.installedPlugins) {
      const translationUrl = new URL(`locales/${locale}.json`, plugin.meta.url);
      const translationPath = fileURLToPath(translationUrl);
      try {
        translations.push(require(translationPath));
      } catch {} // eslint-disable-line no-empty
    }

    catalog.set(locale, deepmerge.all(translations));
  }

  return catalog;
};
