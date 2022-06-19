import { markdown } from "../filters/markdown.js";

/**
 * Transform object into an array that can be consumed by the summary component.
 *
 * @param {object} object - Object
 * @returns {Array} Rows
 */
export const summaryRows = (object) => {
  const rows = [];

  for (const [key, value] of Object.entries(object)) {
    rows.push({
      key: {
        text: key,
      },
      value: {
        text:
          typeof value === "string"
            ? value
            : markdown(`~~~json\n${JSON.stringify(value, 0, 2)}\n~~~`),
      },
    });
  }

  return rows;
};
