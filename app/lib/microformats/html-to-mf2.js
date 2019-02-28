const microformats = require('microformat-node');

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

  try {
    const {items} = await microformats.getAsync({
      html: await html,
      textFormat: 'normalised'
    });

    if (items && items.length === 0) {
      throw new Error('Page has no items');
    }

    if (items && items.length > 1) {
      throw new Error('Page has more than one item');
    }

    if (items && items.length === 1) {
      const item = items[0];
      const itemHasProperties = Object.keys(item.properties).length > 1;

      // Clean up HTML and return all properties
      if (itemHasProperties) {
        const {html} = item.properties.content[0];
        if (html) {
          item.properties.content[0].html = html.trim().replace(/\s\s+/g, ' ');
        }

        mf2 = item;
      } else {
        throw new Error('Item has no properties');
      }

      // Only return requested properties
      if (properties && itemHasProperties) {
        const selected = Object.keys(mf2.properties)
          .filter(key => properties.includes(key))
          .reduce((obj, key) => {
            obj[key] = mf2.properties[key];
            return obj;
          }, {});

        mf2 = selected;
      }

      return mf2;
    }
  } catch (error) {
    throw new Error(error);
  }
};
