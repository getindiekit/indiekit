/**
 * Copy of Undici matching the version bundled with the running Node.js.
 *
 * Node.js does not expose its bundled Undici, so tests install copies from
 * npm. Built-in `fetch()` reads the global dispatcher set by these copies, but
 * dispatchers are only compatible within the same major version. Always import
 * `MockAgent`, `setGlobalDispatcher` etc. from here, never from `undici`.
 * @see {@link https://github.com/nodejs/undici#supported-versions}
 */
const copies = {
  7: "undici-v7", // Bundled with Node.js 24.x
  8: "undici-v8", // Bundled with Node.js 26.x
};

export const bundledVersion = process.versions.undici;
export const packageName = copies[Number(bundledVersion.split(".", 1)[0])];

if (!packageName) {
  throw new Error(
    `No test copy of Undici for Node.js ${process.version} (bundled Undici ${bundledVersion}). Add one to helpers/undici/package.json.`,
  );
}

const undici = await import(packageName);

export const { Agent, MockAgent, getGlobalDispatcher, setGlobalDispatcher } =
  undici;
