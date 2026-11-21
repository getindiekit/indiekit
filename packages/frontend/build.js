/**
 * Prebuild client scripts and styles into `dist/`, so that the published
 * package doesn’t need esbuild or lightningcss to serve them.
 * Run by `npm run build`, and automatically before packing or publishing.
 *
 * With `--clean`, remove the prebuilt files instead. Run automatically after
 * packing, so that a clone of the repository keeps serving its source files.
 */
import fs from "node:fs/promises";
import { parseArgs } from "node:util";

import { bundlesUrl } from "./lib/assets.js";
import { bundleScripts } from "./lib/esbuild.js";
import { bundleStyles } from "./lib/lightningcss.js";

const { values } = parseArgs({ options: { clean: { type: "boolean" } } });

if (values.clean) {
  await fs.rm(bundlesUrl, { recursive: true, force: true });
} else {
  await fs.mkdir(bundlesUrl, { recursive: true });
  await fs.writeFile(new URL("app.js", bundlesUrl), await bundleScripts());
  await fs.writeFile(new URL("app.css", bundlesUrl), await bundleStyles());
}
