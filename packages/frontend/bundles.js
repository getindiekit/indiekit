import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import manifestPlugin from "esbuild-plugin-manifest";

const __filename = fileURLToPath(import.meta.url);
const outdir = "public";
const node_modules = path.join(__filename, "..", "..", "..", "node_modules");

const result = await esbuild.build({
  assetNames: "assets/[name]-[hash]",
  bundle: true,
  chunkNames: "chunks/[name]-[hash]",
  entryNames: "entries/[name]-[hash]",
  entryPoints: [
    path.join(node_modules, "codemirror", "lib", "codemirror.css"),
    path.join(node_modules, "codemirror", "lib", "codemirror.js"),
    path.join(__filename, "..", "styles", "app.css"),
    path.join(__filename, "..", "scripts", "app.js"),
  ],
  format: "esm",
  metafile: true, // upload generated meta.json to https://bundle-buddy.com/ to visualize the bundle
  minify: true,
  outdir,
  plugins: [
    // @ts-ignore-next-line TS2322
    manifestPlugin({ hash: true }),
  ],
  sourcemap: true,
  target: ["chrome125", "edge125", "firefox125", "safari17"], // https://caniuse.com/usage-table
  write: true,
});

for (const warning of result.warnings) {
  console.warn(warning);
}

if (result.errors.length > 0) {
  for (const error of result.errors) {
    console.error(error);
  }
  throw new Error(`esbuild bundle failed:\n${result.errors.join("\n")}`);
}

fs.writeFileSync(
  path.join(outdir, "meta.json"),
  JSON.stringify(result.metafile),
);
console.log(`esbuild metafile written to ${path.join(outdir, "meta.json")}`);

for (const key of Object.keys(result.metafile.outputs)) {
  console.log(`wrote ${key}`);
}
