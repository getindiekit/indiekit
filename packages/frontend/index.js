import { fileURLToPath } from "node:url";

export const assetsPath = fileURLToPath(new URL("assets", import.meta.url));
export { appIcon, shortcutIcon } from "./lib/sharp.js";
export { templates } from "./lib/nunjucks.js";
export { scripts } from "./lib/esbuild.js";
export { styles } from "./lib/lightningcss.js";
export { getBackgroundColor, getThemeColor } from "./lib/utils/theme.js";

export { tagInputSanitizer } from "./components/tag-input/sanitizer.js";
