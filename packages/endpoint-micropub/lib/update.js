import _ from "lodash";

import { mf2ToJf2 } from "./jf2.js";

/**
 * Add properties to object
 * @param {object} object - Object to update
 * @param {object} additions - Properties to add (mf2)
 * @returns {object|undefined} Updated object
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
 * @param {object} object - Object to update
 * @param {object} replacements - Properties to replace (mf2)
 * @returns {Promise<object>} Updated object (JF2)
 */
export const replaceEntries = async (object, replacements) => {
  for await (const [key, value] of Object.entries(replacements)) {
    if (!Array.isArray(value)) {
      throw new TypeError("Replacement value should be an array");
    }

    const replacement = await resolveReplacement(value);

    if (replacement !== undefined) {
      object = _.set(object, key, replacement);
    }
  }

  return object;
};

/**
 * Resolve replacement value from mf2 array to JF2
 * @param {Array<object>} value - Replacement value array (mf2)
 * @returns {Promise<object|undefined>} Resolved value, or undefined if empty
 */
const resolveReplacement = async (value) => {
  if (value.length === 0) {
    return;
  }

  if (value.length === 1) {
    return mf2ToJf2(value[0], false);
  }

  return value;
};

/**
 * Delete entries for properties of object
 * @param {object} object - Object to update
 * @param {object} deletions - Property entries to delete (mf2)
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
        if (index !== -1) {
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
 * Delete properties of object
 * @param {object} object - Object to update
 * @param {Array} deletions - Properties to delete (mf2)
 * @returns {object} Updated object
 */
export const deleteProperties = (object, deletions) => {
  for (const key of deletions) {
    delete object[key];
  }

  return object;
};
