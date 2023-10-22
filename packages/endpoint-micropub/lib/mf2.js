/**
 * Return mf2 properties of a post
 * @param {object} mf2 - mf2 object
 * @param {Array<string>|string} requestedProperties - mf2 properties to select
 * @returns {Promise<object>} mf2 with requested properties
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
 * Convert JF2 post data to mf2
 * @param {object} postData - Post data
 * @param {boolean} [includeObjectId] - Include ObjectID from post data
 * @returns {object} mf2
 */
export const jf2ToMf2 = (postData, includeObjectId = true) => {
  const { properties, _id } = postData;

  const mf2 = {
    type: [`h-${properties.type}`],
    properties: {
      ...(includeObjectId && _id && { uid: [_id] }),
    },
  };

  delete properties.type;

  // Move values to property object
  for (const key in properties) {
    // Convert nested vocabulary to mf2 (i.e. h-card, h-geo, h-adr)
    if (Object.prototype.hasOwnProperty.call(properties[key], "type")) {
      mf2.properties[key] = [jf2ToMf2({ properties: properties[key] }, false)];
    }

    // Convert values to arrays (i.e. 'a' => ['a'])
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
