const microformats = require('microformat-node');

const utils = require(__basedir + '/lib/utils');

/**
 * Parses microformats on HTML page
 *
 * @memberof microformats
 * @module htmlToMf2
 * @param {String} html HTML marked up with microformats
 * @param {String} properties mf2 properties to return
 * @return {Promise} mf2 object
 */
module.exports = async (html, properties) => {
  let mf2;
  const {items} = await microformats.getAsync({
    html: await html,
    textFormat: 'normalised'
  });

  if (items && items.length === 1) {
    const item = items[0];
    if (Object.keys(item.properties).length > 1) {
      const {html} = item.properties.content[0];
      if (html) {
        item.properties.content[0].html = utils.sanitizeHtml(html);
      }

      mf2 = item;
    }
  }

  if (properties) { // Respond only with requested properties
    console.log('Properties requested');
    const selected = Object.keys(mf2.properties)
      .filter(key => properties.includes(key))
      .reduce((obj, key) => {
        obj[key] = mf2.properties[key];
        return obj;
      }, {});

    return selected;
  }

  return mf2;
};
