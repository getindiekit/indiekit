import _ from 'lodash';

/**
 * Add properties to object
 *
 * @param {object} properties JF2 properties
 * @param {object} additions Properties to add (mf2)
 * @returns {object} Updated object
 */
export const addProperties = (properties, additions) => {
  for (const key in additions) {
    if (Object.prototype.hasOwnProperty.call(additions, key)) {
      const newValue = additions[key];
      const existingValue = properties[key];

      // If no existing value, add it
      if (!existingValue) {
        properties[key] = newValue;
        return properties;
      }

      // If existing value, add to it
      if (existingValue) {
        const updatedValue = [...existingValue];

        for (const value of newValue) {
          updatedValue.push(value);
        }

        properties = _.set(properties, key, updatedValue);
        return properties;
      }
    }
  }
};

/**
 * Replace entries of a property. If property doesn’t exist, create it.
 *
 * @param {object} properties JF2 properties
 * @param {object} replacements Properties to replace (mf2)
 * @returns {object} Updated object
 */
export const replaceEntries = (properties, replacements) => {
  for (const key in replacements) {
    if (Object.prototype.hasOwnProperty.call(replacements, key)) {
      const value = replacements[key];

      if (!Array.isArray(value)) {
        throw new TypeError('Replacement value should be an array');
      }

      properties = _.set(properties, key, value[0]);
    }
  }

  return properties;
};

/**
 * Delete individual entries for properties of an object
 *
 * @param {object} properties JF2 properties
 * @param {object} deletions Property entries to delete (mf2)
 * @returns {object} Updated object
 */
export const deleteEntries = (properties, deletions) => {
  for (const key in deletions) {
    if (Object.prototype.hasOwnProperty.call(deletions, key)) {
      const valuesToDelete = deletions[key];

      if (!Array.isArray(valuesToDelete)) {
        throw new TypeError(`${key} should be an array`);
      }

      const values = properties[key];
      if (!valuesToDelete || !values) {
        return properties;
      }

      for (const value of valuesToDelete) {
        const index = values.indexOf(value);
        if (index > -1) {
          values.splice(index, 1);
        }

        if (values.length === 0) {
          delete properties[key]; // Delete property if no values remain
        } else {
          properties[key] = values;
        }
      }
    }
  }

  return properties;
};

/**
 * Delete properties of an object
 *
 * @param {object} properties JF2 properties
 * @param {Array} deletions Properties to delete (mf2)
 * @returns {object} Updated object
 */
export const deleteProperties = (properties, deletions) => {
  for (const key of deletions) {
    delete properties[key];
  }

  return properties;
};
