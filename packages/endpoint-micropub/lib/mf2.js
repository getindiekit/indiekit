/**
 * mf2 item, with optional type so it can be removed from a response
 * @typedef {object} Mf2Item
 * @property {string[]} [type] - Item type, i.e. `h-entry`
 * @property {Record<string, unknown>} properties - Item properties
 */

/**
 * Return mf2 properties of a post
 * @param {Mf2Item|{items: Mf2Item[]}} mf2 - mf2 item, or mf2 with items
 * @param {Array<string>|string} [requestedProperties] - mf2 properties to select
 * @returns {Mf2Item|{items: Mf2Item[]}} mf2 with requested properties
 */
export const getMf2Properties = (mf2, requestedProperties) => {
  if (!requestedProperties) {
    return mf2;
  }

  const item = "items" in mf2 ? mf2.items[0] : mf2;
  const { properties } = item;

  // Return requested properties
  if (requestedProperties) {
    requestedProperties = Array.isArray(requestedProperties)
      ? requestedProperties
      : [requestedProperties];

    /**
     * @type {Record<string, unknown>}
     */
    const selectedProperties = {};

    for (const key of requestedProperties) {
      if (Object.hasOwn(properties, key)) {
        selectedProperties[key] = properties[key];
      }
    }

    item.properties = selectedProperties;
  }

  // Return properties
  delete item.type;
  return item;
};

/**
 * Convert JF2 post data to mf2
 * @param {Jf2Properties} jf2 - JF2
 * @returns {MicroformatRoot} mf2
 */
export const jf2ToMf2 = (jf2) => {
  const { properties } = jf2;

  /**
   * @type {Mf2Draft}
   */
  const mf2 = {
    type: [`h-${properties.type}`],
    properties: {},
  };

  delete properties.type;

  // Move values to property object
  for (const key in properties) {
    // Convert nested vocabulary to mf2 (i.e. h-card, h-geo, h-adr)
    if (Object.prototype.hasOwnProperty.call(properties[key], "type")) {
      mf2.properties[key] = [jf2ToMf2({ properties: properties[key] })];
    }

    // Convert values to arrays (i.e. "a" => ["a"])
    else if (Object.prototype.hasOwnProperty.call(properties, key)) {
      const value = properties[key];
      mf2.properties[key] = Array.isArray(value) ? value : [value];
    }
  }

  // Update key for plaintext content
  if (
    mf2.properties.content &&
    mf2.properties.content[0] &&
    mf2.properties.content[0].text
  ) {
    mf2.properties.content[0].value = properties.content.text;
    delete mf2.properties.content[0].text;
  }

  return mf2;
};
