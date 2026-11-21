import { fileURLToPath } from "node:url";

/**
 * Bundle client scripts
 *
 * esbuild is a development dependency, so it is only imported when the
 * prebuilt bundle is unavailable (for example, when working on Indiekit from a
 * clone of its repository).
 * @returns {Promise<string>} Bundled JavaScript
 */
export const bundleScripts = async () => {
  const esbuild = await import("esbuild");
  const inputFile = fileURLToPath(
    new URL("../scripts/app.js", import.meta.url),
  );

  const result = await esbuild.build({
    entryPoints: [inputFile],
    bundle: true,
    legalComments: "none",
    minify: true,
    write: false,
  });

  const { contents } = result.outputFiles[0];
  const code = new TextDecoder().decode(contents);

  return code;
};
