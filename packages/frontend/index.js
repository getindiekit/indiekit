import { fileURLToPath } from "node:url";

export const assetsPath = fileURLToPath(new URL("assets", import.meta.url));
export { appIcon } from "./lib/app-icon.js";
export { templates } from "./lib/nunjucks.js";
export { styles } from "./lib/lightningcss.js";
export { scripts } from "./lib/rollup.js";
