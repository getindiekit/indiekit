const fetch = require('node-fetch');

const logger = require(process.env.PWD + '/app/logger');

/**
 * Returns an array of available categories
 *
 * @memberof publication
 * @module getCategories
 * @param {String} pub Publication configuration
 * @returns {Promise|Array} Array of categories
 */
module.exports = async pub => {
  const pubCategories = pub.categories;
  let categories = [];

  if (pubCategories && pubCategories.url) {
    try {
      const response = await fetch(pubCategories.url);
      categories = await response.json();
    } catch (error) {
      logger.error('publication.getCategories', {error});
      throw new Error(error);
    }
  } else if (pubCategories && pubCategories.constructor === Array) {
    categories = pubCategories;
  }

  return categories;
};
