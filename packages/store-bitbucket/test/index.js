import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import nock from "nock";
import { Indiekit } from "@indiekit/indiekit";
import BitbucketStore from "../index.js";

describe("store-bitbucket", () => {
  const bitbucket = new BitbucketStore({
    user: "username",
    password: "password",
    repo: "repo",
  });

  const bitbucketUrl = "https://api.bitbucket.org";

  it("Gets plug-in environment", () => {
    assert.deepEqual(bitbucket.environment, ["BITBUCKET_PASSWORD"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(bitbucket.name, "Bitbucket store");
    assert.equal(bitbucket.info.name, "username/repo on Bitbucket");
    assert.equal(bitbucket.info.uid, "https://bitbucket.org/username/repo");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(
      bitbucket.prompts[0].message,
      "What is your Bitbucket username?",
    );
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    bitbucket.init(indiekit);

    assert.equal(
      indiekit.publication.store.info.name,
      "username/repo on Bitbucket",
    );
  });

  it("Creates file", async () => {
    nock(bitbucketUrl).post("/2.0/repositories/username/repo/src").reply(201, {
      "content-type": "application/json",
    });

    const result = await bitbucket.createFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://bitbucket.org/username/repo/foo.txt");
  });

  it("Throws error creating file", async () => {
    nock(bitbucketUrl)
      .post("/2.0/repositories/username/repo/src")
      .replyWithError("Not found");

    await assert.rejects(
      bitbucket.createFile("foo.txt", "foo", { message: "Message" }),
      {
        message:
          "Bitbucket store: request to https://api.bitbucket.org/2.0/repositories/username/repo/src failed, reason: Not found",
      },
    );
  });

  it("Reads file", async () => {
    nock(bitbucketUrl)
      .get("/2.0/repositories/username/repo/src/main/foo.txt")
      .query({ format: "rendered" })
      .reply(201, { raw: "foo", type: "rendered" });

    const result = await bitbucket.readFile("foo.txt");

    assert.equal(result, "foo");
  });

  it("Throws error reading file", async () => {
    nock(bitbucketUrl)
      .get("/2.0/repositories/username/repo/src/main/foo.txt")
      .query({ format: "rendered" })
      .replyWithError("Not found");

    await assert.rejects(bitbucket.readFile("foo.txt"), {
      message:
        "Bitbucket store: request to https://api.bitbucket.org/2.0/repositories/username/repo/src/main/foo.txt?format=rendered failed, reason: Not found",
    });
  });

  it("Updates file", async () => {
    nock(bitbucketUrl).post("/2.0/repositories/username/repo/src").reply(201, {
      "content-type": "application/json",
    });

    const result = await bitbucket.updateFile("foo.txt", "foo", {
      message: "Message",
    });

    assert.equal(result, "https://bitbucket.org/username/repo/foo.txt");
  });

  it("Updates and renames file", async () => {
    nock(bitbucketUrl)
      .post("/2.0/repositories/username/repo/src")
      .twice()
      .reply(201, {
        "content-type": "application/json",
      });

    const result = await bitbucket.updateFile("foo.txt", "foo", {
      message: "Message",
      newPath: "bar.txt",
    });

    assert.equal(result, "https://bitbucket.org/username/repo/bar.txt");
  });

  it("Throws error updating file", async () => {
    nock(bitbucketUrl)
      .post("/2.0/repositories/username/repo/src")
      .replyWithError("Not found");

    await assert.rejects(
      bitbucket.updateFile("foo.txt", "foo", { message: "Message" }),
      {
        message:
          "Bitbucket store: request to https://api.bitbucket.org/2.0/repositories/username/repo/src failed, reason: Not found",
      },
    );
  });

  it("Deletes a file", async () => {
    nock(bitbucketUrl).post("/2.0/repositories/username/repo/src").reply(201, {
      "content-type": "application/json",
    });

    const result = await bitbucket.deleteFile("foo.txt", {
      message: "Message",
    });

    assert.equal(result, true);
  });

  it("Throws error deleting a file", async () => {
    nock(bitbucketUrl)
      .post("/2.0/repositories/username/repo/src")
      .replyWithError("Not found");

    await assert.rejects(
      bitbucket.deleteFile("foo.txt", { message: "Message" }),
      {
        message:
          "Bitbucket store: request to https://api.bitbucket.org/2.0/repositories/username/repo/src failed, reason: Not found",
      },
    );
  });
});
