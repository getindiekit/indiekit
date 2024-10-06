// @ts-nocheck
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
        "@indiekit/store-github": { user: "user", repo: "repo", token: "123" },
      },
    });
    await indiekit.bootstrap();

    assert.equal(indiekit.publication.store.info.name, "user/repo on GitHub");
  });

  it("Checks if file exists", async () => {
    assert.equal(await github.fileExists("foo.txt"), true);
    assert.equal(await github.fileExists("404.txt"), false);
  });

  it("Creates file", async () => {
    const result = await github.createFile("new.txt", "new", {
      message: "Message",
    });

    assert.equal(result, "https://github.com/user/repo/blob/main/new.txt");
  });

  it("Doesn’t create file if already exists", async () => {
    const result = await github.createFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, undefined);
  });

  it("Throws error creating file", async () => {
    await assert.rejects(
      github.createFile("401.txt", "foo", { message: "Message" }),
      (error) => {
        assert(error.message.includes("Could not create file 401.txt"));
        return true;
      },
    );
  });

  it("Reads file", async () => {
    assert.equal(await github.readFile("foo.txt"), "foo");
  });

  it("Throws error reading file", async () => {
    await assert.rejects(github.readFile("404.txt"), (error) => {
      assert(error.message.includes("Could not read file 404.txt"));
      return true;
    });
  });

  it("Updates file", async () => {
    const result = await github.updateFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://github.com/user/repo/blob/main/foo.txt");
  });

  it("Updates and renames file", async () => {
    const result = await github.updateFile("foo.txt", "qux", {
      message: "Message",
      newPath: "bar.txt",
    });

    assert.equal(result, "https://github.com/user/repo/blob/main/bar.txt");
  });

  it("Creates file if original Not Found in repository", async () => {
    const result = await github.updateFile("bar.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://github.com/user/repo/blob/main/bar.txt");
  });

  it("Throws error updating file", async () => {
    await assert.rejects(
      github.updateFile("401.txt", "foo", { message: "Message" }),
      (error) => {
        assert(error.message.includes("Could not read file 401.txt"));
        return true;
      },
    );
  });

  it("Deletes a file", async () => {
    assert.ok(await github.deleteFile("foo.txt", { message: "Message" }));
  });

  it("Throws error file Not Found in repository", async () => {
    await assert.rejects(
      github.deleteFile("404.txt", { message: "Message" }),
      (error) => {
        assert(error.message.includes("Could not read file 404.txt"));
        return true;
      },
    );
  });

  it.skip("Throws error deleting a file", async () => {
    await assert.rejects(
      github.deleteFile("401.txt", { message: "Message" }),
      (error) => {
        assert(error.message.includes("Could not delete file 401.txt"));
        return true;
      },
    );
  });
});
