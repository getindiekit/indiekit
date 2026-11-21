import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

/**
 * Resolve path to file in `node_modules`
 * @param {string} filePath - File path
 * @returns {string} Resolved file path
 * @example `@import url("~codemirror/lib/codemirror.css");`
 */
function resolveModuleFilePath(filePath) {
  if (filePath.includes("~")) {
    const moduleFilePath = filePath.split("~", 2)[1];
    return require.resolve(moduleFilePath);
  }

  return filePath;
}

/**
 * Bundle styles
 *
 * lightningcss is a development dependency, so it is only imported when the
 * prebuilt bundle is unavailable (for example, when working on Indiekit from a
 * clone of its repository).
 * @returns {Promise<string>} Bundled CSS
 */
export const bundleStyles = async () => {
  const { bundleAsync } = await import("lightningcss");
  const inputFile = fileURLToPath(
    new URL("../styles/app.css", import.meta.url),
  );

  let { code } = await bundleAsync({
    filename: inputFile,
    minify: true,
    resolver: {
      read(filePath) {
        filePath = resolveModuleFilePath(filePath);
        return fs.readFileSync(filePath, "utf8");
      },
    },
  });

  return code.toString();
};
