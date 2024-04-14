import fs from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Get application icon image
 * @param {string|number} size - Icon size
 * @param {string} themeColor - Theme colour
 * @param {string} [purpose] - Icon purpose (any, maskable or monochrome)
 * @returns {Promise<Buffer>} File buffer
 */
export const appIcon = async (size, themeColor, purpose = "any") => {
  const svgPath = fileURLToPath(
    new URL(`../assets/app-icon-${purpose}.svg`, import.meta.url),
  );

  const svg = fs.readFileSync(svgPath);
  return sharp(svg)
    .tint(themeColor)
    .resize(Number(size))
    .png({ colours: 16 })
    .toBuffer();
};
