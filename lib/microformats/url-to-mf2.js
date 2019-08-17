const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const fetch = require('node-fetch');

const htmlToMf2 = require(process.env.PWD + '/lib/microformats/html-to-mf2');

/**
 * Parses microformats at a given URL.
 *
 * @exports urlToMf2
 * @param {String} url URL path to post
 * @param {String} properties mf2 properties to return
 * @returns {Promise} mf2 object
 */
module.exports = async (url, properties) => {
  const response = await fetch(url).catch(error => {
    throw new IndieKitError({
      status: 404,
      error: 'Not found',
      error_description: error.message
    });
  });
  const html = await response.text();
  return htmlToMf2(html, properties);
};
