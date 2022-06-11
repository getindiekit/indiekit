import { createRequire } from "node:module";
import deepmerge from "deepmerge";

const require = createRequire(import.meta.url);

/**
 * Add localisations to application configuration
 *
 * @param {object} application Application config
 * @returns {Promise|object} Localisations
 */
export const getLocales = (application) => {
  const locales = new Map();

  // Application localisations
  for (const locale of application.localesAvailable) {
    const translation = require(`../locales/${locale}.json`);
    locales.set(locale, translation);
  }

  // Plug-in localisations
  for (const plugin of application.installedPlugins) {
    for (const locale of application.localesAvailable) {
      try {
        const appLocale = locales.get(locale);
        const translation = require(`../../${plugin.id}/locales/${locale}.json`);
        locales.set(locale, deepmerge(appLocale, translation));
      } catch {}
    }
  }

  return locales;
};

/**
 * Add plugins to application configuration
 *
 * @param {object} Indiekit Indiekit instance
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
