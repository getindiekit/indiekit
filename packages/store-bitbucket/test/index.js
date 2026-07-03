import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";

import BitbucketStore from "../index.js";

await mockAgent("store-bitbucket");

describe("store-bitbucket", async () => {
  const bitbucket = new BitbucketStore({
    email: "username@website.example",
    user: "username",
    token: "abcd1234",
    repo: "repo",
  });

  it("Gets plug-in environment", () => {
    assert.deepEqual(bitbucket.environment, ["BITBUCKET_TOKEN"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(bitbucket.name, "Bitbucket store");
    assert.equal(bitbucket.info.name, "username/repo on Bitbucket");
    assert.equal(bitbucket.info.uid, "https://bitbucket.org/username/repo");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(
      bitbucket.prompts[0].message,
      "What is your Bitbucket workspace?",
    );
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({
      config: {
        plugins: ["@indiekit/store-bitbucket"],
        publication: { me: "https://website.example" },
        "@indiekit/store-bitbucket": { user: "user", repo: "repo" },
      },
    });
    await indiekit.installPlugins();
    await indiekit.updatePublicationConfig();

    assert.equal(
      indiekit.publication.store.info.name,
      "user/repo on Bitbucket",
    );
  });

  it("Checks if file exists", async () => {
    assert.equal(await bitbucket.fileExists("foo.txt"), true);
    assert.equal(await bitbucket.fileExists("404.txt"), false);
  });

  it("Creates file", async () => {
    const result = await bitbucket.createFile("new.txt", "new", {
      message: "Message",
    });

    assert.equal(result, "https://bitbucket.org/username/repo/new.txt");
  });

  it("Doesn’t create file if already exists", async () => {
    const result = await bitbucket.createFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, undefined);
  });

  it("Throws error creating file", async () => {
    await assert.rejects(
      bitbucket.createFile("401.txt", "foo", { message: "Message" }),
      {
        message: "Bitbucket store: Unauthorized",
      },
    );
  });

  it("Reads file", async () => {
    const result = await bitbucket.readFile("foo.txt");

    assert.equal(result, "foo");
  });

  it("Throws error reading file", async () => {
    await assert.rejects(bitbucket.readFile("404.txt"), {
      message: "Bitbucket store: Not found",
    });
  });

  it("Updates file", async () => {
    const result = await bitbucket.updateFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://bitbucket.org/username/repo/foo.txt");
  });

  it("Updates and renames file", async () => {
    const result = await bitbucket.updateFile("foo.txt", "foo", {
      message: "Message",
      newPath: "bar.txt",
    });

    assert.equal(result, "https://bitbucket.org/username/repo/bar.txt");
  });

  it("Throws error updating file", async () => {
    await assert.rejects(
      bitbucket.updateFile("401.txt", "foo", { message: "Message" }),
      {
        message: "Bitbucket store: Unauthorized",
      },
    );
  });

  it("Deletes a file", async () => {
    const result = await bitbucket.deleteFile("foo.txt", {
      message: "Message",
    });

    assert.equal(result, true);
  });

  it("Throws error deleting a file", async () => {
    await assert.rejects(
      bitbucket.deleteFile("401.txt", { message: "Message" }),
      {
        message: "Bitbucket store: Unauthorized",
      },
    );
  });
});
