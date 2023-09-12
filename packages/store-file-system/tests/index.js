import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import test from "ava";
import mockFs from "mock-fs";
import { Indiekit } from "@indiekit/indiekit";
import FileSystemStore from "../index.js";

const fileSystem = new FileSystemStore({
  directory: "directory",
});

test("Gets plug-in info", (t) => {
  t.is(fileSystem.name, "File system store");
  t.is(fileSystem.info.name, "directory");
  t.is(fileSystem.info.uid, "file://directory");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(
    fileSystem.prompts[0].message,
    "Which directory do you want to save files in?",
  );
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  fileSystem.init(indiekit);

  t.is(indiekit.publication.store.info.name, "directory");
});

test.serial("Creates file", async (t) => {
  mockFs();

  const result = await fileSystem.createFile("foo.txt", "foo");

  t.is(result, "file://directory/foo.txt");
  t.is(await fs.readFile("directory/foo.txt", "utf8"), "foo");

  mockFs.restore();
});

test("Throws error creating file", async (t) => {
  mockFs();

  await t.throwsAsync(fileSystem.createFile("", "foo"), {
    message: "File system store: EBADF, bad file descriptor",
  });

  mockFs.restore();
});

test.serial("Updates file", async (t) => {
  mockFs({ "directory/foo.txt": "foo" });

  const result = await fileSystem.updateFile("foo.txt", "bar");

  t.is(result, "file://directory/foo.txt");
  t.is(await fs.readFile("directory/foo.txt", "utf8"), "bar");

  mockFs.restore();
});

test.serial("Updates and renames file", async (t) => {
  mockFs({ "directory/foo.txt": "foo" });

  const result = await fileSystem.updateFile("foo.txt", "bar", {
    newPath: "bar.txt",
  });

  t.is(result, "file://directory/bar.txt");
  t.is(await fs.readFile("directory/bar.txt", "utf8"), "bar");

  mockFs.restore();
});

test("Throws error updating file", async (t) => {
  mockFs();

  await t.throwsAsync(fileSystem.updateFile("foo.txt", "foo"), {
    message:
      "File system store: ENOENT, no such file or directory 'directory/foo.txt'",
  });

  mockFs.restore();
});

test.serial("Deletes file", async (t) => {
  mockFs({ "directory/foo.txt": "foo" });

  await fileSystem.deleteFile("foo.txt");
  const result = existsSync("directory/foo.txt");

  t.false(result);

  mockFs.restore();
});

test("Throws error deleting file", async (t) => {
  mockFs();

  await t.throwsAsync(fileSystem.deleteFile("foo.txt"), {
    message:
      "File system store: ENOENT, no such file or directory 'directory/foo.txt'",
  });

  mockFs.restore();
});
