import { strict as assert } from "node:assert";
import path from "node:path";
import { describe, it, mock } from "node:test";

import { getFileContents, getFiles } from "../../lib/files.js";

describe("create-indiekit/lib/files", () => {
  it("Gets file contents", async () => {
    const result = await getFileContents("template.gitignore");

    assert.equal(result, "node_modules/\n");
  });

  it("Throws error getting file contents", async () => {
    mock.method(console, "error", () => {});
    mock.method(process, "exit", () => {});

    await getFileContents("template.foo");
    const result = console.error.mock.calls[0].arguments[0];

    assert.equal(result.includes("ENOENT: no such file or directory"), true);
    assert.equal(process.exit.mock.calls.length, 1);
  });

  it("Gets files to create", async () => {
    const result = await getFiles({ me: "https://website.example" });

    assert.deepEqual(result[0], {
      path: "README.md",
      contents: `# Indiekit server for https://website.example\n\nLearn more at <https://getindiekit.com>\n`,
    });

    assert.deepEqual(result[1], {
      path: ".gitignore",
      contents: "node_modules/\n",
    });

    assert.equal(result[2].path, path.join(".vscode", "launch.json"));
  });

  it("Gets files to create, including docker files", async () => {
    const result = await getFiles({
      me: "https://website.example",
      useDocker: true,
    });

    assert.equal(result[3].path, "docker-compose.yml");
    assert.equal(result[4].path, "Dockerfile");
    assert.equal(result[5].path, ".dockerignore");
  });
});
