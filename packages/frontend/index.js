import { fileURLToPath } from "node:url";

export const assetsPath = fileURLToPath(new URL("assets", import.meta.url));
export { appIcon, shortcutIcon } from "./lib/sharp.js";
export { templates } from "./lib/nunjucks.js";
export { scripts, styles } from "./lib/assets.js";
export { tagInputSanitizer } from "./lib/utils/validation.js";
export {
  defaultThemeColor,
  getBackgroundColor,
  getThemeColor,
} from "./lib/utils/theme.js";
