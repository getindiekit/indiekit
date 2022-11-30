import { fileURLToPath } from "node:url";

export const assetsPath = fileURLToPath(new URL("assets", import.meta.url));
export { touchIcon } from "./lib/touch-icon.js";
export { templates } from "./lib/nunjucks.js";
export { styles } from "./lib/postcss.js";
export { scripts } from "./lib/rollup.js";
