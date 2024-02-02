import fs from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const appIcon = async (themeColor, size) => {
  const svgPath = fileURLToPath(
    new URL("../assets/app-icon.svg", import.meta.url),
  );

  const svg = fs.readFileSync(svgPath);
  return sharp(svg)
    .tint(themeColor)
    .resize(size)
    .png({ colours: 16 })
    .toBuffer();
};
