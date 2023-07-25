import fs from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const touchIcon = async (themeColor) => {
  const svgPath = fileURLToPath(
    new URL("../assets/touch-icon.svg", import.meta.url),
  );

  const svg = fs.readFileSync(svgPath);
  return sharp(svg).png().tint(themeColor).toBuffer();
};
