import { markdown } from "../filters/string.js";

/**
 * Transform object into array for consumption by summary component
 *
 * @param {object} object - Object
 * @returns {Array} Rows
 */
export const summaryRows = (object) => {
  const rows = [];

  for (const [key, value] of Object.entries(object)) {
    const valueText = (value) => {
      if (typeof value === "string" || typeof value === "boolean") {
        return `<code class="token attr-value">${value}</code>`;
      }

      try {
        return markdown(`~~~js\n${JSON.stringify(value, 0, 2)}\n~~~`);
      } catch {
        return `<code class="token class-name">${value.constructor.name}</code>`;
      }
    };

    rows.push({
      key: {
        text: key,
      },
      value: {
        text: valueText(value),
      },
    });
  }

  return rows;
};
