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

  for (const locale of application.localesAvailable) {
    const translations = [
      // Application translations
      require(`../locales/${locale}.json`),
      // Error translations
      require(`../../error/locales/${locale}.json`),
      // Frontend translations
      require(`../../frontend/locales/${locale}.json`),
    ];

    // Plug-in translations
    for (const plugin of application.installedPlugins) {
      try {
        translations.push(require(`../../${plugin.id}/locales/${locale}.json`));
      } catch {}
    }

    catalog.set(locale, deepmerge.all(translations));
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
