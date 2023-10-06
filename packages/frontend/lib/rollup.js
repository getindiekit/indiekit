import { fileURLToPath } from "node:url";
import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export const scripts = async () => {
  const bundle = await rollup({
    input: fileURLToPath(new URL("../scripts/app.js", import.meta.url)),
    plugins: [commonjs(), nodeResolve({ preferBuiltins: true })],
  });

  const { output } = await bundle.generate({ format: "iife", name: "app" });

  return output[0].code;
};
