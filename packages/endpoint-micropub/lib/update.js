import _ from "lodash";

/**
 * Add properties to object
 *
 * @param {object} object Object to update
 * @param {object} additions Properties to add (mf2)
 * @returns {object} Updated object
 */
export const addProperties = (object, additions) => {
  for (const key in additions) {
    if (Object.prototype.hasOwnProperty.call(additions, key)) {
      const newValue = additions[key];
      let existingValue = object[key];

      // If no existing value, add it
      if (!existingValue) {
        object[key] = newValue;
        return object;
      }

      // If existing value, add to it
      if (existingValue) {
        existingValue = Array.isArray(existingValue)
          ? existingValue
          : [existingValue];

        const updatedValue = [...existingValue];

        for (const value of newValue) {
          updatedValue.push(value);
        }

        object = _.set(object, key, updatedValue);
        return object;
      }
    }
  }
};

/**
 * Replace entries of a property. If property doesn’t exist, create it.
 *
 * @param {object} object Object to update
 * @param {object} replacements Properties to replace (mf2)
 * @returns {object} Updated object
 */
export const replaceEntries = (object, replacements) => {
  for (const key in replacements) {
    if (Object.prototype.hasOwnProperty.call(replacements, key)) {
      const value = replacements[key];

      if (!Array.isArray(value)) {
        throw new TypeError("Replacement value should be an array");
      }

      object = _.set(object, key, value[0]);
    }
  }

  return object;
};

/**
 * Delete individual entries for properties of an object
 *
 * @param {object} object Object to update
 * @param {object} deletions Property entries to delete (mf2)
 * @returns {object} Updated object
 */
export const deleteEntries = (object, deletions) => {
  for (const key in deletions) {
    if (Object.prototype.hasOwnProperty.call(deletions, key)) {
      const valuesToDelete = deletions[key];

      if (!Array.isArray(valuesToDelete)) {
        throw new TypeError(`${key} should be an array`);
      }

      const values = object[key];
      if (!valuesToDelete || !values) {
        return object;
      }

      for (const value of valuesToDelete) {
        const index = values.indexOf(value);
        if (index > -1) {
          values.splice(index, 1);
        }

        if (values.length === 0) {
          delete object[key]; // Delete property if no values remain
        } else {
          object[key] = values;
        }
      }
    }
  }

  return object;
};

/**
 * Delete properties of an object
 *
 * @param {object} object Object to update
 * @param {Array} deletions Properties to delete (mf2)
 * @returns {object} Updated object
 */
export const deleteProperties = (object, deletions) => {
  for (const key of deletions) {
    delete object[key];
  }

  return object;
};
