import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { getFileContents, getFiles } from "../../lib/files.js";

describe("create-indiekit/lib/files", () => {
  it("Gets file contents", async () => {
    const result = await getFileContents("template.gitignore");

    assert.equal(result.startsWith("# Environment"), true);
  });

  it("Logs error getting file contents", async () => {
    mock.method(console, "error", () => {});
    mock.method(process, "exit", () => {});

    const result = await getFileContents("template.foo");
    const message = console.error.mock.calls[0].arguments[0];

    assert.equal(result, "");
    assert.equal(message.includes("ENOENT: no such file or directory"), true);
  });

  it("Gets files to create", async () => {
    const result = await getFiles({ me: "https://website.example" });

    assert.deepEqual(result, [
      {
        path: "README.md",
        contents: `# Indiekit server for <https://website.example>\n\nLearn more at <https://getindiekit.com>\n`,
      },
      {
        path: ".gitignore",
        contents:
          "# Environment\n.env\n\n# Node\nnode_modules/\nnpm-debug.log\n",
      },
    ]);
  });

  it("Gets files to create, including docker files", async () => {
    const result = await getFiles({
      me: "https://website.example",
      useDocker: true,
    });

    assert.equal(result[2].path, "docker-compose.yml");
    assert.equal(result[3].path, "Dockerfile");
    assert.equal(result[4].path, ".dockerignore");
    assert.equal(result[5].path, ".env");
  });
});
