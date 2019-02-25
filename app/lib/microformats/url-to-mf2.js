const fetch = require('node-fetch');

const htmlToMf2 = require(__basedir + '/lib/microformats/html-to-mf2');

/**
 * Parses microformats at a given URL
 *
 * @memberof microformats
 * @module urlToMf2
 * @param {String} url URL path to post
 * @param {String} properties mf2 properties to return
 * @returns {Promise} mf2 object
 */
module.exports = async (url, properties) => {
  try {
    console.info(`Making request to ${url}`);
    const response = await fetch(url);

    if (response) {
      const html = await response.text();
      return htmlToMf2(html, properties);
    }

    throw new Error(`Unable to connect to ${url}`);
  } catch (error) {
    console.error(error);
  }
};
