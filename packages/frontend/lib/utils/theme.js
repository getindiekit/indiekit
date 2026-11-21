/**
 * Theme colours.
 *
 * Only the hue of the configured theme colour is calculated here. It tints
 * the neutral palette, and is used for colours given outside the stylesheet,
 * such as in the web app manifest. Variants of the primary colour are derived
 * in CSS, using relative colour syntax (see `styles/config/custom-properties.css`).
 */

/**
 * Parse hexadecimal colour
 * @param {string} string - Hexadecimal colour, i.e. `#04f` or `#0044ff`
 * @returns {[number, number, number]} Red, green and blue channels (0–255)
 */
export const parseHex = (string) => {
  const match =
    typeof string === "string" &&
    /^#([\da-f]{3}|[\da-f]{6})$/i.exec(string.trim());

  if (!match) {
    throw new TypeError(`Expected a hexadecimal colour, got “${string}”`);
  }

  const hex =
    match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];

  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
};

/**
 * Format colour as six-digit hexadecimal
 * @param {string} string - Hexadecimal colour, i.e. `#04f` or `#0044FF`
 * @returns {string} Hexadecimal colour, i.e. `#0044ff`
 */
export const formatHex = (string) =>
  "#" +
  parseHex(string)
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("");

/**
 * Get hue of a colour, rounded to the nearest degree
 * @param {string} string - Hexadecimal colour
 * @returns {number} Hue (0–359)
 */
export const getHue = (string) => {
  const [r, g, b] = parseHex(string).map((channel) => channel / 255);
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;

  let hue;
  switch (max) {
    case min: {
      // Grey has no hue
      hue = 0;
      break;
    }

    case r: {
      hue = (g - b) / delta;
      break;
    }

    case g: {
      hue = 2 + (b - r) / delta;
      break;
    }

    default: {
      hue = 4 + (r - g) / delta;
    }
  }

  hue = Math.min(hue * 60, 360);
  if (hue < 0) {
    hue += 360;
  }

  // Normalise before rounding, as the previous colour library did, so that
  // results are unchanged (adding 360 can round a value like 7.4999… to 7.5)
  hue = ((hue % 360) + 360) % 360;

  return Number(hue.toFixed(0)) % 360;
};

/**
 * Default theme colour, used if the configured colour isn’t valid
 */
export const defaultThemeColor = "#04f";

/**
 * Invalid theme colours that have been warned about, so that a warning isn’t
 * logged every time a page is rendered
 * @type {Set<string>}
 */
const invalidColors = new Set();

/**
 * Get theme colour, or the default theme colour if not valid
 *
 * The theme is used on every page, including error pages, so an invalid
 * colour falls back to the default rather than stopping pages from rendering.
 * @param {unknown} string - Color (as hexadecimal)
 * @returns {string} Hexadecimal colour
 */
const getValidThemeColor = (string) => {
  try {
    return formatHex(/** @type {string} */ (string));
  } catch (error) {
    if (!invalidColors.has(String(string))) {
      invalidColors.add(String(string));
      console.warn(
        `${/** @type {Error} */ (error).message}. Using default theme colour ${defaultThemeColor} instead.`,
      );
    }

    return formatHex(defaultThemeColor);
  }
};

/**
 * Return background color
 * @param {string} string - Color (as hexadecimal)
 * @param {string} colorScheme - Color scheme
 * @returns {string} CSS color value (HSL)
 */
export const getBackgroundColor = (string, colorScheme = "light") =>
  `hsl(${getHue(getValidThemeColor(string))}, 5%, ${colorScheme === "light" ? 99 : 10}%)`;

/**
 * Return theme color
 * @param {string} string - Color (as hexadecimal)
 * @param {string} colorScheme - Color scheme
 * @returns {string} CSS color value (HSL)
 */
export const getThemeColor = (string, colorScheme = "light") =>
  `hsl(${getHue(getValidThemeColor(string))}, 5%, ${colorScheme === "light" ? 95 : 20}%)`;

/**
 * Return theme color as CSS custom properties
 * @param {string} string - Color (as hexadecimal)
 * @returns {string} CSS custom properties
 */
export const getThemeCustomProperties = (string) => {
  const color = getValidThemeColor(string);

  return `
--tint-neutral: ${getHue(color)} 5%;
--color-primary: ${color};`;
};
