/**
 * Generate space-separated list of HTML attribute key values
 * @param {object} attributes - Attributes
 * @returns {string} Space-separated list of HTML attribute key values
 */
export const attributes = (attributes) => {
  let html = "";

  for (const name in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, name)) {
      const value = attributes[name];

      if (!value) {
        return html;
      }

      html += typeof value === "boolean" ? ` ${name}` : ` ${name}="${value}"`;
    }
  }

  return html;
};
