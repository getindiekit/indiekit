const fetch = require('node-fetch');

const {IndieKitError} = require(process.env.PWD + '/app/errors');

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
  let status;

  if (pubCategories && pubCategories.url) {
    const response = await fetch(pubCategories.url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }).catch(error => {
      throw new IndieKitError({
        status,
        error: error.name,
        error_description: error.message
      });
    });

    status = response.status;
    categories = await response.json();
  } else if (pubCategories && pubCategories.constructor === Array) {
    categories = pubCategories;
  }

  return categories;
};
