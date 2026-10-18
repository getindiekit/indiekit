import { markdown } from "../filters/string.js";

/**
 * Get HTML for a value, formatted by type
 * @param {unknown} value - Value
 * @returns {string} HTML
 */
const _valueText = (value) => {
  if (typeof value === "string") {
    return `<code class="token string">"${value}"</code>`;
  }

  if (Array.isArray(value) && typeof value[0] === "boolean") {
    return `<code class="token boolean">${value}</code>`;
  }

  try {
    return markdown(`~~~js\n${JSON.stringify(value, undefined, 2)}\n~~~`);
  } catch {
    return `<code class="token class-name">${/** @type {object} */ (value).constructor.name}</code>`;
  }
};

/**
 * Transform object to array for consumption by summary component
 * @param {object} object - Object
 * @returns {Array<{key: {text: string}, value: {text: string}}>} Rows
 */
export const summaryRows = (object) => {
  const rows = [];

  for (const [key, value] of Object.entries(object)) {
    rows.push({
      key: {
        text: key,
      },
      value: {
        text: _valueText(value),
      },
    });
  }

  return rows;
};
