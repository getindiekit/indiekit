import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";
import GithubStore from "../index.js";

await mockAgent("store-github");

describe("store-github", async () => {
  const github = new GithubStore({
    token: "abcd1234",
    user: "user",
    repo: "repo",
  });

  it("Gets plug-in environment", () => {
    assert.deepEqual(github.environment, ["GITHUB_TOKEN"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(github.name, "GitHub store");
    assert.equal(github.info.name, "user/repo on GitHub");
    assert.equal(github.info.uid, "https://github.com/user/repo");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(github.prompts[0].message, "What is your GitHub username?");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({
      config: {
        plugins: ["@indiekit/store-github"],
        publication: { me: "https://website.example" },
        "@indiekit/store-github": { user: "user", repo: "repo" },
      },
    });
    await indiekit.bootstrap();

    assert.equal(indiekit.publication.store.info.name, "user/repo on GitHub");
  });

  it("Creates file", async () => {
    const result = await github.createFile("foo.md", "foobar", {
      message: "Message",
    });

    assert.equal(result, "https://github.com/user/repo/blob/main/foo.txt");
  });

  it("Throws error creating file", async () => {
    await assert.rejects(
      github.createFile("401.md", "foobar", { message: "Message" }),
      {
        message: "GitHub store: Unauthorized",
      },
    );
  });

  it("Reads file", async () => {
    assert.equal(await github.readFile("foo.md"), "foobar");
  });

  it("Throws error reading file", async () => {
    await assert.rejects(github.readFile("404.md"), {
      message: "GitHub store: Not Found",
    });
  });

  it("Updates file", async () => {
    const result = await github.updateFile("foo.md", "foobar", {
      message: "Message",
    });

    assert.equal(result, "https://github.com/user/repo/blob/main/foo.txt");
  });

  it("Updates and renames file", async () => {
    const result = await github.updateFile("foo.md", "qux", {
      message: "Message",
      newPath: "bar.md",
    });

    assert.equal(result, "https://github.com/user/repo/blob/main/bar.txt");
  });

  it("Creates file if original Not Found in repository", async () => {
    const result = await github.updateFile("bar.md", "foobar", {
      message: "Message",
    });

    assert.equal(result, "https://github.com/user/repo/blob/main/bar.txt");
  });

  it("Throws error updating file", async () => {
    await assert.rejects(
      github.updateFile("401.md", "foobar", { message: "Message" }),
      {
        message: "GitHub store: Unauthorized",
      },
    );
  });

  it("Deletes a file", async () => {
    assert.ok(await github.deleteFile("foo.md", { message: "Message" }));
  });

  it("Throws error file Not Found in repository", async () => {
    await assert.rejects(github.deleteFile("404.md", { message: "Message" }), {
      message: "GitHub store: Not Found",
    });
  });

  it("Throws error deleting a file", async () => {
    await assert.rejects(github.deleteFile("401.md", { message: "Message" }), {
      message: "GitHub store: Unauthorized",
    });
  });
});
