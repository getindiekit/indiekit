const {DateTime} = require('luxon');

/**
 * Derives published date (based on microformats2 data, else the current date)
 *
 * @memberof microformats
 * @module dervivePublishedProperty
 * @param {Object} mf2 microformats2 object
 * @returns {Array} ISO formatted date
 */
module.exports = mf2 => {
  let date;

  try {
    const published = mf2.properties.published[0];
    date = published.toISO();
  } catch (error) {
    date = DateTime.local().toISO();
  }

  return new Array(date);
};
