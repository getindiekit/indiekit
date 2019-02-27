const {DateTime} = require('luxon');

/**
 * Derives published date (based on microformats2 data, else the current date)
 *
 * @memberof microformats
 * @module dervivePublishedProperty
 * @param {Object} mf2 microformats2 object
 * @returns {Array} Array containing ISO formatted date
 */
module.exports = mf2 => {
  let {published} = mf2.properties;
  const now = DateTime.local().toISO();

  if (published) {
    published = DateTime.fromISO(published[0]).toISO();
    return new Array(published);
  }

  return new Array(now);
};
