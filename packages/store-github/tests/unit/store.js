import test from "ava";
import nock from "nock";
import { Indiekit } from "@indiekit/indiekit";
import { GithubStore } from "../../index.js";

const github = new GithubStore({
  token: "token",
  user: "username",
  repo: "repo",
});

test.beforeEach((t) => {
  t.context = {
    githubUrl: "https://api.github.com",
    getResponse: {
      content: "Zm9vYmFy",
      sha: "\b[0-9a-f]{5,40}\b",
      name: "foo.txt",
      path: "foo.txt",
    },
    putResponse: {
      commit: {
        message: "Message",
      },
    },
  };
});

test("Gets plug-in info", (t) => {
  t.is(github.name, "GitHub store");
  t.is(github.info.name, "username/repo on GitHub");
  t.is(github.info.uid, "https://github.com/username/repo");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(github.prompts[0].message, "What is your GitHub username?");
});

test("Initiates plug-in", (t) => {
  const indiekit = new Indiekit();
  github.init(indiekit);

  t.is(indiekit.publication.store.info.name, "username/repo on GitHub");
});

test("Creates file in a repository", async (t) => {
  nock(t.context.githubUrl)
    .put((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.putResponse);

  const result = await github.createFile("foo.txt", "foo", "Message");

  t.is(result.data.commit.message, "Message");
});

test("Throws error creating file in a repository", async (t) => {
  nock(t.context.githubUrl)
    .put((uri) => uri.includes("foo.txt"))
    .replyWithError("Not found");

  await t.throwsAsync(github.createFile("foo.txt", "foo", "Message"), {
    message: /\bNot found\b/,
  });
});

test("Reads file in a repository", async (t) => {
  nock(t.context.githubUrl)
    .get((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.getResponse);

  const result = await github.readFile("foo.txt");

  t.is(result, "foobar");
});

test("Throws error reading file in a repository", async (t) => {
  nock(t.context.githubUrl)
    .get((uri) => uri.includes("foo.txt"))
    .replyWithError("Not found");

  await t.throwsAsync(github.readFile("foo.txt"), {
    message: /\bNot found\b/,
  });
});

test("Updates file in a repository", async (t) => {
  nock(t.context.githubUrl)
    .get((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.getResponse)
    .put((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.putResponse);

  const result = await github.updateFile("foo.txt", "foo", "Message");

  t.is(result.status, 200);
  t.is(result.data.commit.message, "Message");
});

test("Creates file if original not found in repository", async (t) => {
  nock(t.context.githubUrl)
    .get((uri) => uri.includes("foo.txt"))
    .replyWithError("Not found")
    .put((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.putResponse);

  const result = await github.updateFile("foo.txt", "foo", "Message");

  t.is(result.status, 200);
  t.is(result.data.commit.message, "Message");
});

test("Throws error updating file in a repository", async (t) => {
  nock(t.context.githubUrl)
    .get((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.getResponse)
    .put((uri) => uri.includes("foo.txt"))
    .replyWithError("Unknown error");

  await t.throwsAsync(
    github.updateFile("foo.txt", "foo", { message: "Message" }),
    {
      message: /\bUnknown error\b/,
    }
  );
});

test("Deletes a file in a repository", async (t) => {
  nock(t.context.githubUrl)
    .get((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.getResponse)
    .delete((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.putResponse);

  const result = await github.deleteFile("foo.txt", "Message");

  t.is(result.status, 200);
  t.is(result.data.commit.message, "Message");
});

test("Throws error if file not found in repository", async (t) => {
  nock(t.context.githubUrl)
    .get((uri) => uri.includes("foo.txt"))
    .replyWithError("Not found");

  await t.throwsAsync(github.deleteFile("foo.txt", "Message"), {
    message: /\bNot found\b/,
  });
});

test("Throws error deleting a file in a repository", async (t) => {
  nock(t.context.githubUrl)
    .get((uri) => uri.includes("foo.txt"))
    .reply(200, t.context.getResponse)
    .delete((uri) => uri.includes("foo.txt"))
    .replyWithError("Unknown error");

  await t.throwsAsync(github.deleteFile("foo.txt", "Message"), {
    message: /\bUnknown error\b/,
  });
});
