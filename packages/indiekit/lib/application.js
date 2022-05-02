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
