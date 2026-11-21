import { strict as assert } from "node:assert";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it, mock } from "node:test";
import { pathToFileURL } from "node:url";

import { readOrBundle, scripts, styles } from "../../lib/assets.js";

describe("frontend/lib/assets", () => {
  /**
   * Temporary directory containing test bundles
   * @type {URL}
   */
  let directory;

  before(async () => {
    const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "indiekit-"));
    directory = pathToFileURL(`${temporary}/`);
    await fs.writeFile(new URL("app.js", directory), "prebuilt();");
    await fs.mkdir(new URL("folder.js", directory));
  });

  after(async () => {
    await fs.rm(directory, { recursive: true });
  });

  it("Reads prebuilt bundle", async () => {
    const bundle = mock.fn(async () => "bundled();");
    const result = await readOrBundle("app.js", bundle, directory);

    assert.equal(result, "prebuilt();");
    assert.equal(bundle.mock.callCount(), 0);
  });

  it("Creates bundle if no prebuilt bundle found", async () => {
    const bundle = mock.fn(async () => "bundled();");
    const result = await readOrBundle("missing.js", bundle, directory);

    assert.equal(result, "bundled();");
    assert.equal(bundle.mock.callCount(), 1);
  });

  it("Throws error reading prebuilt bundle", async () => {
    const bundle = mock.fn(async () => "bundled();");

    await assert.rejects(readOrBundle("folder.js", bundle, directory), {
      code: "EISDIR",
    });
    assert.equal(bundle.mock.callCount(), 0);
  });

  it("Throws error if bundle can’t be created", async () => {
    const bundle = mock.fn(async () => {
      throw Object.assign(new Error("Cannot find package 'esbuild'"), {
        code: "ERR_MODULE_NOT_FOUND",
      });
    });

    await assert.rejects(readOrBundle("missing.js", bundle, directory), {
      message: /No prebuilt missing\.js found/,
    });
  });

  it("Gets scripts", async () => {
    const result = await scripts();

    assert.match(result, /customElements\.define/);
  });

  it("Gets styles", async () => {
    const result = await styles();

    assert.match(result, /--/);
  });

  it("Gets the same bundle on each call", async () => {
    assert.equal(await scripts(), await scripts());
    assert.equal(scripts(), scripts());
  });
});
