import fs from "node:fs/promises";

import { bundleScripts } from "./esbuild.js";
import { bundleStyles } from "./lightningcss.js";

/**
 * Directory containing prebuilt bundles, created by `npm run build` and
 * included in the published package
 */
export const bundlesUrl = new URL("../dist/", import.meta.url);

/**
 * Read a prebuilt bundle, or create it if not found
 * @param {string} filename - Bundle file name
 * @param {() => Promise<string>} bundle - Function that creates the bundle
 * @param {URL} [directory] - Directory containing prebuilt bundles
 * @returns {Promise<string>} Bundle contents
 */
export const readOrBundle = async (
  filename,
  bundle,
  directory = bundlesUrl,
) => {
  try {
    return await fs.readFile(new URL(filename, directory), "utf8");
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT") {
      throw error;
    }

    try {
      return await bundle();
    } catch (bundleError) {
      // Bundlers are development dependencies
      if (
        /** @type {NodeJS.ErrnoException} */ (bundleError).code ===
        "ERR_MODULE_NOT_FOUND"
      ) {
        throw new Error(
          `No prebuilt ${filename} found, and it can’t be created without development dependencies. Run \`npm run build --workspace=@indiekit/frontend\` with development dependencies installed.`,
          { cause: bundleError },
        );
      }

      throw bundleError;
    }
  }
};

/**
 * Cached bundles. Contents don’t change while the server is running, so each
 * is read (or created) at most once.
 * @type {Map<string, Promise<string>>}
 */
const cache = new Map();

/**
 * Get bundle, reading or creating it only once
 * @param {string} filename - Bundle file name
 * @param {() => Promise<string>} bundle - Function that creates the bundle
 * @returns {Promise<string>} Bundle contents
 */
const getBundle = (filename, bundle) => {
  if (!cache.has(filename)) {
    cache.set(filename, readOrBundle(filename, bundle));
  }

  return /** @type {Promise<string>} */ (cache.get(filename));
};

/**
 * Get client scripts
 * @returns {Promise<string>} JavaScript
 */
export const scripts = () => getBundle("app.js", bundleScripts);

/**
 * Get styles
 * @returns {Promise<string>} CSS
 */
export const styles = () => getBundle("app.css", bundleStyles);
