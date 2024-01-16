/**
 * Remove properties with empty values from object
 * @param {object} object - Object to sanitise
 * @returns {object} Sanitised object
 */
export const sanitise = (object) => {
  for (const [key, value] of Object.entries(object)) {
    const noValue =
      value !== 0 &&
      ((typeof value === "string" && value.trim() === "") ||
        value.length === 0 ||
        Object.entries(value).length === 0);

    if (Object.prototype.hasOwnProperty.call(object, key) && noValue) {
      delete object[key];
    }
  }

  return object;
};
