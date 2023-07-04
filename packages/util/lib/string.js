/**
 * Substitute variables enclosed in { } braces with data from object
 * @param {string} string - String to parse
 * @param {object} object - Properties to use
 * @returns {string} String with substituted
 */
export const supplant = (string, object) => {
  const replacer = function (match, p1) {
    const r = object[p1];

    if (typeof r === "string" || typeof r === "number") {
      return r;
    }

    return match;
  };

  return string.replace(/{([^{}]*)}/g, replacer);
};
