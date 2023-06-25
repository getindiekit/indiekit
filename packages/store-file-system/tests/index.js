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
    "Which directory do you want to save files in?"
  );
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  fileSystem.init(indiekit);

  t.is(indiekit.publication.store.info.name, "directory");
});

test.serial("Creates file in a directory", async (t) => {
  mockFs();

  await fileSystem.createFile("foo.txt", "foo");
  const result = await fs.readFile("directory/foo.txt", "utf8");

  t.is(result, "foo");
  mockFs.restore();
});

test("Throws error creating file in a directory", async (t) => {
  mockFs();

  await t.throwsAsync(fileSystem.createFile("", "foo"), {
    message: "File system store: EBADF, bad file descriptor",
  });

  mockFs.restore();
});

test.serial("Updates file in a directory", async (t) => {
  mockFs({
    "directory/foo.txt": "foo",
  });

  await fileSystem.updateFile("foo.txt", "bar");
  const result = await fs.readFile("directory/foo.txt", "utf8");

  t.is(result, "bar");
  mockFs.restore();
});

test("Throws error updating file in a directory", async (t) => {
  mockFs();

  await t.throwsAsync(fileSystem.updateFile("foo.txt", "foo"), {
    message:
      "File system store: ENOENT, no such file or directory 'directory/foo.txt'",
  });

  mockFs.restore();
});

test.serial("Deletes file in a directory", async (t) => {
  mockFs({
    "directory/foo.txt": "foo",
  });

  await fileSystem.deleteFile("foo.txt");
  const result = existsSync("directory/foo.txt");

  t.false(result);
  mockFs.restore();
});

test("Throws error deleting file in a directory", async (t) => {
  mockFs();

  await t.throwsAsync(fileSystem.deleteFile("foo.txt"), {
    message:
      "File system store: ENOENT, no such file or directory 'directory/foo.txt'",
  });

  mockFs.restore();
});
