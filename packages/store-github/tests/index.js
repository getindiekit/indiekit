import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";
import GithubStore from "../index.js";

await mockAgent("store-github");

const github = new GithubStore({
  token: "abcd1234",
  user: "user",
  repo: "repo",
});

test("Gets plug-in info", (t) => {
  t.is(github.name, "GitHub store");
  t.is(github.info.name, "user/repo on GitHub");
  t.is(github.info.uid, "https://github.com/user/repo");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(github.prompts[0].message, "What is your GitHub username?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  github.init(indiekit);

  t.is(indiekit.publication.store.info.name, "user/repo on GitHub");
});

test("Creates file in a repository", async (t) => {
  t.true(await github.createFile("foo.md", "foobar", "Message"));
});

test("Throws error creating file in a repository", async (t) => {
  await t.throwsAsync(github.createFile("401.md", "foobar", "Message"), {
    message: "GitHub store: Unauthorized",
  });
});

test("Reads file in a repository", async (t) => {
  t.is(await github.readFile("foo.md", "Message"), "foobar");
});

test("Throws error reading file in a repository", async (t) => {
  await t.throwsAsync(github.readFile("404.md", "Message"), {
    message: "GitHub store: Not Found",
  });
});

test("Updates file in a repository", async (t) => {
  t.true(await github.updateFile("foo.md", "foobar", "Message"));
});

test("Creates file if original Not Found in repository", async (t) => {
  t.true(await github.updateFile("bar.md", "foobar", "Message"));
});

test("Throws error updating file in a repository", async (t) => {
  await t.throwsAsync(github.updateFile("401.md", "foobar", "Message"), {
    message: "GitHub store: Unauthorized",
  });
});

test("Deletes a file in a repository", async (t) => {
  t.true(await github.deleteFile("foo.md", "Message"));
});

test("Throws error file Not Found in repository", async (t) => {
  await t.throwsAsync(github.deleteFile("404.md", "Message"), {
    message: "GitHub store: Not Found",
  });
});

test("Throws error deleting a file in a repository", async (t) => {
  await t.throwsAsync(github.deleteFile("401.md", "Message"), {
    message: "GitHub store: Unauthorized",
  });
});
