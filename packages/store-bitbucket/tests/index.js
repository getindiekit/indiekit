import test from "ava";
import nock from "nock";
import { Indiekit } from "@indiekit/indiekit";
import BitbucketStore from "../index.js";

const bitbucket = new BitbucketStore({
  user: "username",
  password: "password",
  repo: "repo",
});

test.beforeEach((t) => {
  t.context.bitbucketUrl = "https://api.bitbucket.org";
});

test("Gets plug-in environment", (t) => {
  t.deepEqual(bitbucket.environment, ["BITBUCKET_PASSWORD"]);
});

test("Gets plug-in info", (t) => {
  t.is(bitbucket.name, "Bitbucket store");
  t.is(bitbucket.info.name, "username/repo on Bitbucket");
  t.is(bitbucket.info.uid, "https://bitbucket.org/username/repo");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(bitbucket.prompts[0].message, "What is your Bitbucket username?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  bitbucket.init(indiekit);

  t.is(indiekit.publication.store.info.name, "username/repo on Bitbucket");
});

test("Creates file", async (t) => {
  nock(t.context.bitbucketUrl)
    .post("/2.0/repositories/username/repo/src")
    .reply(201, {
      "content-type": "application/json",
    });

  const result = await bitbucket.createFile("foo.txt", "foo", {
    message: "Message",
  });

  t.is(result, "https://bitbucket.org/username/repo/foo.txt");
});

test("Throws error creating file", async (t) => {
  nock(t.context.bitbucketUrl)
    .post("/2.0/repositories/username/repo/src")
    .replyWithError("Not found");

  await t.throwsAsync(
    bitbucket.createFile("foo.txt", "foo", { message: "Message" }),
    {
      message:
        "Bitbucket store: request to https://api.bitbucket.org/2.0/repositories/username/repo/src failed, reason: Not found",
    },
  );
});

test("Reads file", async (t) => {
  nock(t.context.bitbucketUrl)
    .get("/2.0/repositories/username/repo/src/main/foo.txt")
    .query({ format: "rendered" })
    .reply(201, { raw: "foo", type: "rendered" });

  const result = await bitbucket.readFile("foo.txt");

  t.is(result, "foo");
});

test("Throws error reading file", async (t) => {
  nock(t.context.bitbucketUrl)
    .get("/2.0/repositories/username/repo/src/main/foo.txt")
    .query({ format: "rendered" })
    .replyWithError("Not found");

  await t.throwsAsync(bitbucket.readFile("foo.txt"), {
    message:
      "Bitbucket store: request to https://api.bitbucket.org/2.0/repositories/username/repo/src/main/foo.txt?format=rendered failed, reason: Not found",
  });
});

test("Updates file", async (t) => {
  nock(t.context.bitbucketUrl)
    .post("/2.0/repositories/username/repo/src")
    .reply(201, {
      "content-type": "application/json",
    });

  const result = await bitbucket.updateFile("foo.txt", "foo", {
    message: "Message",
  });

  t.is(result, "https://bitbucket.org/username/repo/foo.txt");
});

test.serial("Updates and renames file", async (t) => {
  nock(t.context.bitbucketUrl)
    .post("/2.0/repositories/username/repo/src")
    .twice()
    .reply(201, {
      "content-type": "application/json",
    });

  const result = await bitbucket.updateFile("foo.txt", "foo", {
    message: "Message",
    newPath: "bar.txt",
  });

  t.is(result, "https://bitbucket.org/username/repo/bar.txt");
});

test("Throws error updating file", async (t) => {
  nock(t.context.bitbucketUrl)
    .post("/2.0/repositories/username/repo/src")
    .replyWithError("Not found");

  await t.throwsAsync(
    bitbucket.updateFile("foo.txt", "foo", { message: "Message" }),
    {
      message:
        "Bitbucket store: request to https://api.bitbucket.org/2.0/repositories/username/repo/src failed, reason: Not found",
    },
  );
});

test("Deletes a file", async (t) => {
  nock(t.context.bitbucketUrl)
    .post("/2.0/repositories/username/repo/src")
    .reply(201, {
      "content-type": "application/json",
    });

  const result = await bitbucket.deleteFile("foo.txt", { message: "Message" });

  t.true(result);
});

test("Throws error deleting a file", async (t) => {
  nock(t.context.bitbucketUrl)
    .post("/2.0/repositories/username/repo/src")
    .replyWithError("Not found");

  await t.throwsAsync(bitbucket.deleteFile("foo.txt", { message: "Message" }), {
    message:
      "Bitbucket store: request to https://api.bitbucket.org/2.0/repositories/username/repo/src failed, reason: Not found",
  });
});
