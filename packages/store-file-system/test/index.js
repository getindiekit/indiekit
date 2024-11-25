import { strict as assert } from "node:assert";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { afterEach, describe, it } from "node:test";
import mockFs from "mock-fs";
import { Indiekit } from "@indiekit/indiekit";
import FileSystemStore from "../index.js";

describe("store-file-system", () => {
  const fileSystem = new FileSystemStore({
    directory: "directory",
  });

  afterEach(() => {
    mockFs.restore();
  });

  it("Gets plug-in info", () => {
    assert.equal(fileSystem.name, "File system store");
    assert.equal(fileSystem.info.name, "directory");
    assert.equal(fileSystem.info.uid, "file://directory");
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
        "@indiekit/store-file-system": { directory: "directory" },
      },
    });
    await indiekit.installPlugins();
    await indiekit.updatePublicationConfig();

    assert.equal(indiekit.publication.store.info.name, "directory");
  });

  it("Creates file", async () => {
    mockFs();

    const result = await fileSystem.createFile("foo.txt", "foo");

    assert.equal(result, "file://directory/foo.txt");
    assert.equal(await fs.readFile("directory/foo.txt", "utf8"), "foo");
  });

  it("Doesn’t create file if already exists", async () => {
    mockFs({ "directory/bar.txt": "foo" });

    const result = await fileSystem.createFile("bar.txt", "foo");

    assert.equal(result, undefined);
  });

  it("Throws error creating file", async () => {
    mockFs();

    await assert.rejects(fileSystem.createFile(undefined, "foo"), {
      message: `File system store: The "path" argument must be of type string. Received undefined`,
    });
  });

  it("Updates file", async () => {
    mockFs({ "directory/foo.txt": "foo" });

    const result = await fileSystem.updateFile("foo.txt", "bar");

    assert.equal(result, "file://directory/foo.txt");
    assert.equal(await fs.readFile("directory/foo.txt", "utf8"), "bar");
  });

  it("Updates and renames file", async () => {
    mockFs({ "directory/foo.txt": "foo" });

    const result = await fileSystem.updateFile("foo.txt", "bar", {
      newPath: "bar.txt",
    });

    assert.equal(result, "file://directory/bar.txt");
    assert.equal(await fs.readFile("directory/bar.txt", "utf8"), "bar");
  });

  it("Throws error updating file", async () => {
    mockFs();

    await assert.rejects(fileSystem.updateFile("foo.txt", "foo"), {
      message:
        "File system store: ENOENT, no such file or directory 'directory/foo.txt'",
    });
  });

  it("Deletes file", async () => {
    mockFs({ "directory/foo.txt": "foo" });

    await fileSystem.deleteFile("foo.txt");
    const result = existsSync("directory/foo.txt");

    assert.equal(result, false);
  });

  it("Throws error deleting file", async () => {
    mockFs();

    await assert.rejects(fileSystem.deleteFile("foo.txt"), {
      message:
        "File system store: ENOENT, no such file or directory 'directory/foo.txt'",
    });
  });
});
