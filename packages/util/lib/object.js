/**
 * Check if a value is empty
 * @param {unknown} value - Value to check
 * @returns {boolean} Value is empty
 */
export const isEmpty = (value) => {
  // Zero is a valid value and should not be considered empty
  if (value === 0) return false;

  // Check for empty strings (including whitespace only)
  if (typeof value === "string") return value.trim() === "";

  // Check for undefined
  if (value == undefined) return true;

  // Check for empty arrays
  if (Array.isArray(value)) return value.length === 0;

  // Check for empty objects
  if (typeof value === "object") return Object.keys(value).length === 0;

  return false;
};

/**
 * Remove properties with empty values from object
 * @template T
 * @param {T} object - Object to sanitise
 * @returns {T} Sanitised object
 */
export const sanitise = (object) => {
  if (typeof object !== "object" || object == undefined) {
    return object;
  }

  // Array
  if (Array.isArray(object)) {
    // Recursively sanitise any objects
    const sanitisedArray = object.map((item) =>
      typeof item === "object" && item !== null ? sanitise(item) : item,
    );

    // Filter out empty items
    return /** @type {T} */ (sanitisedArray.filter((item) => !isEmpty(item)));
  }

  // Object
  const record = /** @type {Record<string, unknown>} */ (object);
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "object" && value !== null) {
      // Recursively sanitise nested objects
      record[key] = sanitise(value);

      // Remove key if the sanitised value is empty
      if (isEmpty(record[key])) {
        delete record[key];
      }
    } else if (isEmpty(value)) {
      // Remove empty primitive values
      delete record[key];
    }
  }

  return object;
};
