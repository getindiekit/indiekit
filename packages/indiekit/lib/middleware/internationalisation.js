import i18n from "i18n";

/**
 * Set locale
 * @param {object} Indiekit - Indiekit instance
 * @returns {RequestHandler} Next middleware
 */
export const internationalisation = (Indiekit) =>
  function (request, response, next) {
    try {
      const { locale, localeCatalog } = Indiekit;

      i18n.configure({
        cookie: "locale",
        defaultLocale: "en",
        indent: "  ",
        objectNotation: true,
        queryParameter: "lang",
        // A key a locale has not translated yet falls back to its English
        // value rather than being rendered as the key itself
        retryInDefaultLocale: true,
        staticCatalog: Object.fromEntries(localeCatalog),
      });

      i18n.init(request, response);

      // Override system locale with configured value
      if (locale) {
        request.setLocale(locale);
      }

      next();
    } catch (error) {
      next(error);
    }
  };

/**
 * @import { RequestHandler } from "express"
 */
