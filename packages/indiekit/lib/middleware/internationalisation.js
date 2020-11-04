import i18n from 'i18n';

/**
 * Set server locale
 *
 * @param {object} indiekitConfig Indiekit config
 * @returns {Function} Next middleware
 */
export const internationalisation = indiekitConfig => {
  return async function (request, response, next) {
    try {
      const {application} = indiekitConfig;

      i18n.configure({
        cookie: 'locale',
        defaultLocale: 'en',
        indent: '  ',
        objectNotation: true,
        queryParameter: 'lang',
        staticCatalog: application.locales
      });

      i18n.init(request, response);

      // Override system locale with configured value
      if (application.locale) {
        request.setLocale(application.locale);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
