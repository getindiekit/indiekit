import { fileURLToPath } from "node:url";

import * as esbuild from "esbuild";

export const scripts = async () => {
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
