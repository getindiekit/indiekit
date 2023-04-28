/**
 * Generate space-separated list of HTML attribute key values
 * @param {object} attributes - Attributes
 * @returns {string} Space-separated list of HTML attribute key values
 */
export const attributes = (attributes) => {
  let html = "";

  for (const name in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, name)) {
      if (!attributes[name]) {
        return html;
      }

      html +=
        typeof attributes[name] === "boolean"
          ? ` ${name}`
          : ` ${name}="${attributes[name]}"`;
    }
  }

  return html;
};
