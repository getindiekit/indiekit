import deepmerge from "deepmerge";

/**
 * Add localisations to application configuration
 *
 * @param {object} application Application config
 * @returns {Promise|object} Localisations
 */
export const getLocales = async (application) => {
  const locales = new Map();

  // Application localisations
  for await (const locale of application.localesAvailable) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { default: translation } = await import(`../locales/${locale}.js`);
    locales.set(locale, translation);
  }

  // Plug-in localisations
  for (const plugin of application.installedPlugins) {
    for await (const locale of application.localesAvailable) {
      try {
        const appLocale = locales.get(locale);
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const { default: translation } = await import(
          `../../${plugin.id}/locales/${locale}.js`
        );
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
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
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
