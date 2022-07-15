import { createRequire } from "node:module";
import deepmerge from "deepmerge";

const require = createRequire(import.meta.url);

/**
 * Add catalog of localised strings to application configuration
 *
 * @param {object} application - Application config
 * @returns {object} Catalog of localised strings
 */
export const getLocaleCatalog = (application) => {
  const catalog = new Map();

  // Application localisations
  for (const locale of application.localesAvailable) {
    const translation = require(`../locales/${locale}.json`);
    catalog.set(locale, translation);
  }

  // Error localisations
  for (const locale of application.localesAvailable) {
    try {
      const appLocale = catalog.get(locale);
      const translation = require(`../../error/locales/${locale}.json`);
      catalog.set(locale, deepmerge(appLocale, translation));
    } catch {}
  }

  // Frontend localisations
  for (const locale of application.localesAvailable) {
    try {
      const appLocale = catalog.get(locale);
      const translation = require(`../../frontend/locales/${locale}.json`);
      catalog.set(locale, deepmerge(appLocale, translation));
    } catch {}
  }

  // Plug-in localisations
  for (const plugin of application.installedPlugins) {
    for (const locale of application.localesAvailable) {
      try {
        const appLocale = catalog.get(locale);
        const translation = require(`../../${plugin.id}/locales/${locale}.json`);
        catalog.set(locale, deepmerge(appLocale, translation));
      } catch {}
    }
  }

  return catalog;
};

/**
 * Add plug-ins to application configuration
 *
 * @param {object} Indiekit - Indiekit instance
 * @returns {Promise|Array} Installed plug-ins
 */
export const getInstalledPlugins = async (Indiekit) => {
  const installedPlugins = [];

  for await (const pluginName of Indiekit.config.plugins) {
    const { default: IndiekitPlugin } = await import(pluginName);
    const plugin = new IndiekitPlugin(Indiekit.config[pluginName]);

    // Register plug-in functions
    if (plugin.init) {
      await plugin.init(Indiekit);
      installedPlugins.push(plugin);
    }
  }

  return installedPlugins;
};
