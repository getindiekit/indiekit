import got from "got";
import parser from "microformats-parser";

/**
 * Return mf2 properties of a post
 *
 * @param {object} mf2 mf2 object
 * @param {Array|string} requestedProperties mf2 properties to select
 * @returns {Promise|object} mf2 with requested properties
 */
export const getMf2Properties = (mf2, requestedProperties) => {
  const mf2HasItems = mf2.items && mf2.items.length > 0;
  if (!mf2HasItems) {
    throw new Error("Source has no items");
  }

  const item = mf2.items[0];
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
 * @param {string} jf2 JF2
 * @returns {string} Micropub action
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
  if (mf2.properties.content[0] && mf2.properties.content[0].text) {
    mf2.properties.content[0].value = jf2.content.text;
    delete mf2.properties.content[0].text;
  }

  return mf2;
};

/**
 * Return mf2 of a given URL
 *
 * @param {string} url URL path to post
 * @returns {Promise|object} mf2 object
 */
export const url2Mf2 = async (url) => {
  const { body } = await got(url);
  const mf2 = parser.mf2(body, {
    baseUrl: url,
  });

  return mf2;
};
