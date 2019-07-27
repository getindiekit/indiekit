const fetch = require('node-fetch');

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
    const response = await fetch(pubCategories.url);
    categories = await response.json();
  } else if (pubCategories && pubCategories.constructor === Array) {
    categories = pubCategories;
  }

  return categories;
};
