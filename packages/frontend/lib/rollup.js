import { fileURLToPath } from "node:url";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export const scripts = async () => {
  const bundle = await rollup({
    input: fileURLToPath(new URL("../scripts/app.js", import.meta.url)),
    plugins: [nodeResolve()],
  });

  const { output } = await bundle.generate({ format: "iife", name: "app" });

  return output[0].code;
};
