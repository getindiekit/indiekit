/**
 * Return mf2 properties of a post
 *
 * @param {object} mf2 - mf2 object
 * @param {Array|string} requestedProperties - mf2 properties to select
 * @returns {Promise|object} mf2 with requested properties
 */
export const getMf2Properties = (mf2, requestedProperties) => {
  if (!requestedProperties) {
    return mf2;
  }

  const item = mf2.items ? mf2.items[0] : mf2;
  const { properties } = item;

  // Return requested properties
  if (requestedProperties) {
    requestedProperties = Array.isArray(requestedProperties)
      ? requestedProperties
      : [requestedProperties];

    const selectedProperties = {};

    for (const key of requestedProperties) {
      if (properties[key]) {
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
 * Convert JF2 to mf2
 *
 * @param {string} jf2 - JF2
 * @returns {object} mf2
 */
export const jf2ToMf2 = (jf2) => {
  const mf2 = {
    type: [`h-${jf2.type}`],
    properties: {},
  };

  delete jf2.type;

  // Convert values to arrays, ie 'a' => ['a'] and move to properties object
  for (const key in jf2) {
    if (Object.prototype.hasOwnProperty.call(jf2, key)) {
      const value = jf2[key];
      mf2.properties[key] = Array.isArray(value) ? value : [value];
    }
  }

  // Update key for plaintext content
  if (
    mf2.properties.content &&
    mf2.properties.content[0] &&
    mf2.properties.content[0].text
  ) {
    mf2.properties.content[0].value = jf2.content.text;
    delete mf2.properties.content[0].text;
  }

  return mf2;
};
