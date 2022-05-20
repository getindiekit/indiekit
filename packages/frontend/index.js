import { fileURLToPath } from "node:url";

export const assetsPath = fileURLToPath(new URL("assets", import.meta.url));
export { templates } from "./lib/nunjucks.js";
export { styles } from "./lib/postcss.js";
