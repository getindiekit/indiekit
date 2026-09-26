import { strict as assert } from "node:assert";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import { Indiekit } from "@indiekit/indiekit";

import FileSystemStore from "../index.js";

describe("store-file-system", () => {
  let directory;
  let fileSystem;

  beforeEach(async () => {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "indiekit-"));
    fileSystem = new FileSystemStore({ directory });
  });

  afterEach(async () => {
    await fs.rm(directory, { force: true, recursive: true });
  });

  it("Gets plug-in info", () => {
    assert.equal(fileSystem.name, "File system store");
    assert.equal(fileSystem.info.name, directory);
    assert.equal(fileSystem.info.uid, `file://${directory}`);
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(
      fileSystem.prompts[0].message,
      "Which directory do you want to save files in?",
    );
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({
      config: {
        plugins: ["@indiekit/store-file-system"],
        publication: { me: "https://website.example" },
        "@indiekit/store-file-system": { directory },
      },
    });
    await indiekit.installPlugins();
    await indiekit.updatePublicationConfig();

    assert.equal(indiekit.publication.store.info.name, directory);
  });

  it("Creates file", async () => {
    const result = await fileSystem.createFile("foo.txt", "foo");

    assert.equal(result, `file://${directory}/foo.txt`);
    assert.equal(
      await fs.readFile(path.join(directory, "foo.txt"), "utf8"),
      "foo",
    );
  });

  it("Doesn’t create file if already exists", async () => {
    await fs.writeFile(path.join(directory, "bar.txt"), "foo");

    const result = await fileSystem.createFile("bar.txt", "foo");

    assert.equal(result, undefined);
  });

  it("Throws error creating file", async () => {
    await assert.rejects(fileSystem.createFile(undefined, "foo"), {
      message: `File system store: The "path" argument must be of type string. Received undefined`,
    });
  });

  it("Updates file", async () => {
    await fs.writeFile(path.join(directory, "foo.txt"), "foo");

    const result = await fileSystem.updateFile("foo.txt", "bar");

    assert.equal(result, `file://${directory}/foo.txt`);
    assert.equal(
      await fs.readFile(path.join(directory, "foo.txt"), "utf8"),
      "bar",
    );
  });

  it("Updates and renames file", async () => {
    await fs.writeFile(path.join(directory, "foo.txt"), "foo");

    const result = await fileSystem.updateFile("foo.txt", "bar", {
      newPath: "bar.txt",
    });

    assert.equal(result, `file://${directory}/bar.txt`);
    assert.equal(
      await fs.readFile(path.join(directory, "bar.txt"), "utf8"),
      "bar",
    );
  });

  it("Throws error updating file", async () => {
    await assert.rejects(fileSystem.updateFile("missing/foo.txt", "foo"), {
      message: /^File system store: ENOENT: no such file or directory/,
    });
  });

  it("Deletes file", async () => {
    await fs.writeFile(path.join(directory, "foo.txt"), "foo");

    await fileSystem.deleteFile("foo.txt");

    assert.equal(existsSync(path.join(directory, "foo.txt")), false);
  });

  it("Throws error deleting file", async () => {
    await assert.rejects(fileSystem.deleteFile("foo.txt"), {
      message: /^File system store: ENOENT: no such file or directory/,
    });
  });
});
