import i18n from "i18n";

/**
 * Set locale
 * @param {object} Indiekit - Indiekit instance
 * @returns {import("express").RequestHandler} Next middleware
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
